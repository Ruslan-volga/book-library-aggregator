import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  ParseIntPipe,
  Patch 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SupportRequestService } from '../services/support-request.service';
import { SendMessageDto } from '../dto/send-message.dto';

@ApiTags('support-manager')
@Controller('manager/support-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager', 'admin')
@ApiBearerAuth()
export class SupportManagerController {
  constructor(private readonly supportService: SupportRequestService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список обращений для менеджера' })
  @ApiResponse({ status: 200, description: 'Список обращений' })
  async getSupportRequests(
    @Query('isActive') isActive?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    
    const requests = await this.supportService.getManagerChats(isActiveBool);

    // Добавляем информацию о клиенте
    const requestsWithClient = requests.map(request => ({
      ...request,
      client: {
        id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        contactPhone: request.user.contactPhone,
      },
    }));

    // Применяем пагинацию
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return {
      items: requestsWithClient.slice(offsetNum, offsetNum + limitNum),
      total: requests.length,
      limit: limitNum,
      offset: offsetNum,
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Получить историю сообщений из обращения (для менеджера)' })
  @ApiResponse({ status: 200, description: 'История сообщений' })
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.supportService.getMessages(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Отправить сообщение в обращение (от менеджера)' })
  @ApiResponse({ status: 201, description: 'Сообщение отправлено' })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.supportService.sendMessage({
      author: req.user._id,
      supportRequest: id,
      text: sendMessageDto.text,
    });
  }

  @Post(':id/messages/read')
  @ApiOperation({ summary: 'Отметить сообщения как прочитанные (для менеджера)' })
  @ApiResponse({ status: 200, description: 'Сообщения отмечены как прочитанные' })
  async markMessagesAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body('createdBefore') createdBefore: Date,
  ) {
    await this.supportService.markMessagesAsRead({
      user: req.user._id,
      supportRequest: id,
      createdBefore: createdBefore || new Date(),
    });

    return { success: true };
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Закрыть обращение' })
  @ApiResponse({ status: 200, description: 'Обращение закрыто' })
  async closeRequest(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.supportService.closeRequest(id);
    return { success: true };
  }

  @Get(':id/unread-count')
  @ApiOperation({ summary: 'Получить количество непрочитанных сообщений (для менеджера)' })
  @ApiResponse({ status: 200, description: 'Количество непрочитанных сообщений' })
  async getUnreadCount(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return { count: await this.supportService.getUnreadCount(id) };
  }
}
