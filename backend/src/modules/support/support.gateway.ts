import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { 
  Logger, 
  UseGuards, 
  Inject,
  forwardRef 
} from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { SupportRequestService } from './services/support-request.service';
import { SupportRequest } from './entities/support-request.entity';
import { Message } from './entities/message.entity';

@WebSocketGateway({
  namespace: '/support',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SupportGateway.name);
  
  private userSocketMap = new Map<number, string>();
  private socketUserMap = new Map<string, number>();

  constructor(
    @Inject(forwardRef(() => SupportRequestService))
    private readonly supportService: SupportRequestService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || 
                   client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Здесь должна быть логика верификации токена
      // Для демо используем userId из handshake
      const userId = client.handshake.auth.userId;
      
      if (userId) {
        this.userSocketMap.set(userId, client.id);
        this.socketUserMap.set(client.id, userId);
        
        this.logger.log(`WebSocket клиент подключен: userId=${userId}, socketId=${client.id}`);
        
        // Подписываем на события для пользователя
        client.join(`user_${userId}`);
        
        // Для менеджеров - подписываем на общие события поддержки
        const userRole = client.handshake.auth.role;
        if (userRole === 'manager' || userRole === 'admin') {
          client.join('managers');
          this.logger.log(`Менеджер подключен: userId=${userId}`);
        }
      }
    } catch (error) {
      this.logger.error(`Ошибка подключения: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUserMap.get(client.id);
    
    if (userId) {
      this.userSocketMap.delete(userId);
      this.socketUserMap.delete(client.id);
      this.logger.log(`Клиент отключен: userId=${userId}`);
    }
  }

  @SubscribeMessage('subscribeToChat')
  @UseGuards(WsJwtGuard)
  async handleSubscribeToChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: number },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Не авторизован' };
    }

    // Проверяем доступ к чату
    const hasAccess = await this.supportService.checkChatAccess(payload.chatId, userId);
    
    if (!hasAccess) {
      return { error: 'Нет доступа к этому чату' };
    }

    client.join(`chat_${payload.chatId}`);
    this.logger.log(`Клиент ${userId} подписался на чат ${payload.chatId}`);
    
    return { success: true, chatId: payload.chatId };
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(WsJwtGuard)
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { 
      chatId: number; 
      text: string;
    },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Не авторизован' };
    }

    try {
      const message = await this.supportService.sendMessage({
        author: userId,
        supportRequest: payload.chatId,
        text: payload.text,
      });

      // Отправляем сообщение всем подписанным на чат
      this.server.to(`chat_${payload.chatId}`).emit('newMessage', {
        ...message,
        supportRequest: payload.chatId,
      });

      // Уведомляем менеджеров о новом сообщении (если отправил клиент)
      const userRole = client.handshake.auth.role;
      if (userRole === 'client') {
        this.server.to('managers').emit('chatUpdated', {
          chatId: payload.chatId,
          hasNewMessages: true,
        });
      }

      return { success: true, message };
    } catch (error) {
      this.logger.error(`Ошибка отправки сообщения: ${error.message}`);
      return { error: 'Ошибка отправки сообщения' };
    }
  }

  @SubscribeMessage('markAsRead')
  @UseGuards(WsJwtGuard)
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { 
      chatId: number;
      messageIds: number[];
    },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Не авторизован' };
    }

    try {
      await this.supportService.markMessagesAsRead({
        user: userId,
        supportRequest: payload.chatId,
        createdBefore: new Date(),
      });

      // Уведомляем об обновлении статуса прочтения
      this.server.to(`chat_${payload.chatId}`).emit('messagesRead', {
        chatId: payload.chatId,
        readerId: userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Ошибка отметки прочтения: ${error.message}`);
      return { error: 'Ошибка отметки прочтения' };
    }
  }

  // Метод для отправки уведомлений из сервиса
  sendNewChatNotification(chat: SupportRequest) {
    this.server.to('managers').emit('newChatCreated', {
      chatId: chat._id,
      userId: chat.user._id,
      userName: chat.user.name,
      createdAt: chat.createdAt,
    });
  }

  sendMessageNotification(chatId: number, message: Message, senderRole: string) {
    const targetRoom = senderRole === 'client' ? 'managers' : `chat_${chatId}`;
    this.server.to(targetRoom).emit('messageNotification', {
      chatId,
      messageId: message._id,
      text: message.text.substring(0, 100), // Первые 100 символов
      sender: message.author.name,
      sentAt: message.sentAt,
    });
  }

  // Получить socketId пользователя
  getUserSocket(userId: number): string | undefined {
    return this.userSocketMap.get(userId);
  }

  // Отправить сообщение конкретному пользователю
  sendToUser(userId: number, event: string, data: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
