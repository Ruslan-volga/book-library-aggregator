import { 
  Injectable, 
  Inject, 
  forwardRef,
  NotFoundException,
  ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupportRequest } from '../entities/support-request.entity';
import { Message } from '../entities/message.entity';
import { User } from '../../users/entities/user.entity';
import { SupportGateway } from '../support.gateway';
import { 
  ISupportRequestService,
  ISupportRequestClientService,
  ISupportRequestEmployeeService,
  GetChatListParams,
  SendMessageDto,
  MarkMessagesAsReadDto,
  CreateSupportRequestDto,
} from '../interfaces/support-request.interface';

@Injectable()
export class SupportRequestService implements 
  ISupportRequestService, 
  ISupportRequestClientService, 
  ISupportRequestEmployeeService 
{
  private subscribers: ((supportRequest: SupportRequest, message: Message) => void)[] = [];

  constructor(
    @InjectRepository(SupportRequest)
    private supportRequestRepository: Repository<SupportRequest>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => SupportGateway))
    private supportGateway: SupportGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  // ISupportRequestService методы
  async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    const query = this.supportRequestRepository.createQueryBuilder('sr')
      .leftJoinAndSelect('sr.user', 'user')
      .leftJoinAndSelect('sr.messages', 'messages')
      .leftJoinAndSelect('messages.author', 'author');

    if (params.user) {
      query.andWhere('sr.user._id = :userId', { userId: params.user });
    }

    if (params.isActive !== undefined) {
      query.andWhere('sr.isActive = :isActive', { isActive: params.isActive });
    }

    query.orderBy('sr.updatedAt', 'DESC');

    return query.getMany();
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const { author, supportRequest, text } = data;

    // Находим обращение
    const request = await this.supportRequestRepository.findOne({
      where: { _id: supportRequest },
      relations: ['user', 'messages'],
    });

    if (!request) {
      throw new NotFoundException('Обращение не найдено');
    }

    // Находим автора
    const authorUser = await this.userRepository.findOne({
      where: { _id: author },
    });

    if (!authorUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Создаем сообщение
    const message = this.messageRepository.create({
      text,
      author: authorUser,
      supportRequest: request,
      sentAt: new Date(),
    });

    const savedMessage = await this.messageRepository.save(message);

    // Добавляем сообщение в обращение
    request.addMessage(savedMessage);
    await this.supportRequestRepository.save(request);

    // Уведомляем подписчиков
    this.notifySubscribers(request, savedMessage);

    // Отправляем WebSocket уведомление
    const senderRole = authorUser.role;
    this.supportGateway.sendMessageNotification(
      supportRequest, 
      savedMessage, 
      senderRole
    );

    // Генерируем событие
    this.eventEmitter.emit('message.created', {
      requestId: supportRequest,
      message: savedMessage,
      authorRole: senderRole,
    });

    return savedMessage;
  }

  async getMessages(supportRequest: number): Promise<Message[]> {
    const request = await this.supportRequestRepository.findOne({
      where: { _id: supportRequest },
      relations: ['messages', 'messages.author'],
    });

    if (!request) {
      throw new NotFoundException('Обращение не найдено');
    }

    return request.messages.sort((a, b) => 
      new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  }

  subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
    this.subscribers.push(handler);
    
    return () => {
      const index = this.subscribers.indexOf(handler);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(supportRequest: SupportRequest, message: Message) {
    this.subscribers.forEach(handler => handler(supportRequest, message));
  }

  // ISupportRequestClientService методы
  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    const { user, text } = data;

    const userEntity = await this.userRepository.findOne({
      where: { _id: user },
    });

    if (!userEntity) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Создаем обращение
    const supportRequest = this.supportRequestRepository.create({
      user: userEntity,
      isActive: true,
      hasNewMessages: false,
      messages: [],
    });

    const savedRequest = await this.supportRequestRepository.save(supportRequest);

    // Создаем первое сообщение
    await this.sendMessage({
      author: user,
      supportRequest: savedRequest._id,
      text,
    });

    // Уведомляем менеджеров через WebSocket
    this.supportGateway.sendNewChatNotification(savedRequest);

    return savedRequest;
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const { user, supportRequest, createdBefore } = params;

    const request = await this.supportRequestRepository.findOne({
      where: { _id: supportRequest },
      relations: ['messages', 'messages.author', 'user'],
    });

    if (!request) {
      throw new NotFoundException('Обращение не найдено');
    }

    // Проверяем доступ
    await this.checkChatAccess(supportRequest, user);

    // Определяем роль пользователя
    const userEntity = await this.userRepository.findOne({
      where: { _id: user },
    });

    if (!userEntity) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Фильтруем сообщения для отметки как прочитанные
    const messagesToMark = request.messages.filter(message => {
      const isBeforeDate = new Date(message.sentAt) < createdBefore;
      const isUnread = !message.readAt;
      
      if (userEntity.role === 'client') {
        // Клиент отмечает прочитанными сообщения от менеджеров/админов
        return isBeforeDate && isUnread && message.author.role !== 'client';
      } else {
        // Менеджер/админ отмечает прочитанными сообщения от клиентов
        return isBeforeDate && isUnread && message.author.role === 'client';
      }
    });

    // Обновляем сообщения
    for (const message of messagesToMark) {
      message.markAsRead();
      await this.messageRepository.save(message);
    }

    // Обновляем флаг новых сообщений
    if (messagesToMark.length > 0) {
      const hasRemainingUnread = request.messages.some(msg => 
        !msg.readAt && 
        ((userEntity.role === 'client' && msg.author.role !== 'client') ||
         (userEntity.role !== 'client' && msg.author.role === 'client'))
      );
      
      request.hasNewMessages = hasRemainingUnread;
      await this.supportRequestRepository.save(request);
    }
  }

  async getUnreadCount(supportRequest: number): Promise<number> {
    const request = await this.supportRequestRepository.findOne({
      where: { _id: supportRequest },
      relations: ['messages', 'messages.author'],
    });

    if (!request) {
      return 0;
    }

    // Для клиента считаем сообщения от менеджеров/админов
    // Для сотрудников считаем сообщения от клиентов
    // В реальном приложении нужно знать роль текущего пользователя
    return request.messages.filter(msg => !msg.readAt).length;
  }

  // ISupportRequestEmployeeService методы
  async closeRequest(supportRequest: number): Promise<void> {
    const request = await this.supportRequestRepository.findOne({
      where: { _id: supportRequest },
    });

    if (!request) {
      throw new NotFoundException('Обращение не найдено');
    }

    request.isActive = false;
    await this.supportRequestRepository.save(request);

    // Уведомляем через WebSocket
    this.supportGateway.sendToUser(request.user._id, 'chatClosed', {
      chatId: supportRequest,
    });
  }

  // Вспомогательные методы
  async checkChatAccess(chatId: number, userId: number): Promise<boolean> {
    const request = await this.supportRequestRepository.findOne({
      where: { _id: chatId },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException('Чат не найден');
    }

    const user = await this.userRepository.findOne({
      where: { _id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Доступ есть у создателя чата и у менеджеров/админов
    if (request.user._id === userId || user.role !== 'client') {
      return true;
    }

    throw new ForbiddenException('Нет доступа к этому чату');
  }

  async getUserChats(userId: number, isActive?: boolean): Promise<SupportRequest[]> {
    const query: GetChatListParams = { user: userId };
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    return this.findSupportRequests(query);
  }

  async getManagerChats(isActive?: boolean): Promise<SupportRequest[]> {
    const query: GetChatListParams = { user: null };
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    return this.findSupportRequests(query);
  }
}
