import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SupportRequest } from './entities/support-request.entity';
import { Message } from './entities/message.entity';
import { SupportRequestService } from './services/support-request.service';
import { SupportGateway } from './support.gateway';
import { SupportClientController } from './controllers/support-client.controller';
import { SupportManagerController } from './controllers/support-manager.controller';
import { SupportCommonController } from './controllers/support-common.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportRequest, Message]),
    EventEmitterModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  controllers: [
    SupportClientController,
    SupportManagerController,
    SupportCommonController,
  ],
  providers: [
    SupportRequestService,
    SupportGateway,
  ],
  exports: [
    SupportRequestService,
    SupportGateway,
  ],
})
export class SupportModule {}
