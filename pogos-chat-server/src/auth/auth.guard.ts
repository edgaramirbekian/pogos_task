import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
import { Request } from 'express';
import { User, allUsers } from 'src/entities/user.entity';
import { WsAuthData } from './auth.dto';
import { getChat } from 'src/entities/chat.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      if (allUsers.has(payload.username)) {
        if (
          request.params.username &&
          request.params.username !== payload.username
        ) {
          throw new UnauthorizedException();
        }
        request['user'] = payload;
        return true;
      }
      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const wsReq = context.switchToWs().getData<WsAuthData>();
      const jwtToken: string = wsReq.jwtToken;
      const clientUsername: string = wsReq.username;
      const clientId: string = wsReq.id;
      // const chatId: string = wsReq.chatId;
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_KEY,
      });
      if (allUsers.has(payload.username)) {
        const user: User = allUsers.get(payload.username);
        if (user.id == clientId && user.username == clientUsername) {
          return true;
        } else if (
          wsReq.event == 'disconnect' &&
          getChat() &&
          getChat().owner == user.username
        ) {
          return true;
        }
      }
      throw new UnauthorizedException();
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
