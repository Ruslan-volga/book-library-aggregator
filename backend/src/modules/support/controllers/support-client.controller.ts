import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SupportRequestService } from '../services/support-request.service';
import { CreateSupportRequestDto } from '../dto/create-support-request.dto';
import { SendMessageDto } from '../dto/send-message.dto';

@ApiTags('support-client')
@Controller('client/support-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('client')
@ApiBearerAuth()
export class SupportClientController {
  constructor(private readonly supportService: SupportRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Создать обращение в поддержку' })
  @ApiResponse({ status: 201, description: 'Обращение создано' })
  async createSupportRequest(
    @Request() req,
    @Body() createDto: CreateSupportRequestDto,
  ) {
    return this.supportService.createSupportRequest({
      user: req.user._id,
      text: createDto.text,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Получить список обращений для клиента' })
  @ApiResponse({ status: 200, description: 'Список обращений' })
  async getSupportRequests(
    @Request() req,
    @Query('isActive') isActive?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    
    const requests = await this.supportService.getUserChats(
      req.user._id,
      isActiveBool,
    );

    // Применяем пагинацию
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    
    return {
      items: requests.slice(offsetNum, offsetNum + limitNum),
      total: requests.length,
      limit: limitNum,
      offset: offsetNum,
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Получить историю сообщений из обращения' })
  @ApiResponse({ status: 200, description: 'История сообщений' })
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.supportService.checkChatAccess(id, req.user._id);
    return this.supportService.getMessages(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Отправить сообщение в обращение' })
  @ApiResponse({ status: 201, description: 'Сообщение отправлено' })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    await this.supportService.checkChatAccess(id, req.user._id);
    
    return this.supportService.sendMessage({
      author: req.user._id,
      supportRequest: id,
      text: sendMessageDto.text,
    });
  }

  @Post(':id/messages/read')
  @ApiOperation({ summary: 'Отметить сообщения как прочитанные' })
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

  @Get(':id/unread-count')
  @ApiOperation({ summary: 'Получить количество непрочитанных сообщений' })
  @ApiResponse({ status: 200, description: 'Количество непрочитанных сообщений' })
  async getUnreadCount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.supportService.checkChatAccess(id, req.user._id);
    return { count: await this.supportService.getUnreadCount(id) };
  }
}
