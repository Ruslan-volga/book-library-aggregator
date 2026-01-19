import { 
  Controller, 
  Get, 
  Param, 
  UseGuards,
  Request,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SupportRequestService } from '../services/support-request.service';

@ApiTags('support-common')
@Controller('common/support-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupportCommonController {
  constructor(private readonly supportService: SupportRequestService) {}

  @Get(':id/messages')
  @ApiOperation({ summary: 'Получить историю сообщений из обращения (общий доступ)' })
  @ApiResponse({ status: 200, description: 'История сообщений' })
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    // Проверяем доступ
    await this.supportService.checkChatAccess(id, req.user._id);
    return this.supportService.getMessages(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Отправить сообщение в обращение (общий доступ)' })
  @ApiResponse({ status: 201, description: 'Сообщение отправлено' })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() body: { text: string },
  ) {
    // Проверяем доступ
    await this.supportService.checkChatAccess(id, req.user._id);
    
    return this.supportService.sendMessage({
      author: req.user._id,
      supportRequest: id,
      text: body.text,
    });
  }

  @Post(':id/messages/read')
  @ApiOperation({ summary: 'Отметить сообщения как прочитанные (общий доступ)' })
  @ApiResponse({ status: 200, description: 'Сообщения отмечены как прочитанные' })
  async markMessagesAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body('createdBefore') createdBefore: Date,
  ) {
    // Проверяем доступ
    await this.supportService.checkChatAccess(id, req.user._id);
    
    await this.supportService.markMessagesAsRead({
      user: req.user._id,
      supportRequest: id,
      createdBefore: createdBefore || new Date(),
    });

    return { success: true };
  }
}
