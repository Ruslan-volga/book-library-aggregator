import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    
    try {
      const token = client.handshake.auth.token || 
                   client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw new WsException('Токен не предоставлен');
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      
      return true;
    } catch (error) {
      throw new WsException('Невалидный токен');
    }
  }
}
