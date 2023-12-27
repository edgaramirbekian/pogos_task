import { Socket } from 'socket.io';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsAuthData } from './auth.dto';
import { User, allUsers } from 'src/entities/user.entity';
import { getChat } from 'src/entities/chat.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('AuthGuard');
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
  constructor(private jwtService: JwtService) {
    console.log('WsGuard constructor');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('WsGuard');
      // const wsReq: WsAuthData = context.switchToWs().getData<WsAuthData>();
      const client: Socket = context.switchToWs().getClient<Socket>();
      const jwtToken: string = client.handshake.headers.authorization;
      // const username: string | string[] = client.handshake.headers.username;
      // const event: string | string[] = client.handshake.headers.event;

      // const query = client.handshake.query;
      // const token: string | string[] = client.handshake.query.token;

      // const jwtToken: string = wsReq.auth.jwtToken;
      // const clientUsername: string = wsReq.auth.username;

      console.log('WsGuard jwtToken:', jwtToken);
      // const chatId: string = wsReq.chatId;
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_KEY,
      });
      if (allUsers.has(payload.username)) {
        const user: User = allUsers.get(payload.username);
        if (user) {
          // if (
          //   event &&
          //   event == 'kickOut' &&
          //   username &&
          //   allUsers.has(username) &&
          //   getChat() &&
          //   getChat().owner == user.username
          // ) {
          //   return true;
          // }
          return true;
        }
        // if (user.username == clientUsername) {
        //   return true;
        // } else if (
        //   wsReq.auth.event &&
        //   wsReq.auth.event == 'disconnect' &&
        //   getChat() &&
        //   getChat().owner == user.username
        // ) {
        //   return true;
        // }
      }
      throw new UnauthorizedException();
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  async canActivateWs(
    client: Socket,
    jwtAuth: string = '',
    event: string = '',
  ): Promise<boolean> {
    try {
      // const wsReq: WsAuthData = context.switchToWs().getData<WsAuthData>();
      // const client: Socket = context.switchToWs().getClient<Socket>();
      const jwtToken: string = client
        ? client.handshake.headers.authorization
        : jwtAuth
          ? jwtAuth
          : '';
      // const username: string | string[] = client.handshake.headers.username;
      // const event: string | string[] = client.handshake.headers.event;

      // const query = client.handshake.query;
      // const token: string | string[] = client.handshake.query.token;

      // const jwtToken: string = wsReq.auth.jwtToken;
      // const clientUsername: string = wsReq.auth.username;

      console.log('WsGuard ws jwtToken:', jwtToken);
      // const chatId: string = wsReq.chatId;
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_KEY,
      });
      if (allUsers.has(payload.username)) {
        const user: User = allUsers.get(payload.username);
        if (user) {
          if (
            event &&
            event == 'kickOut' &&
            getChat() &&
            getChat().owner == user.username
          ) {
            return true;
          }
          return true;
        }
        // if (user.username == clientUsername) {
        //   return true;
        // } else if (
        //   wsReq.auth.event &&
        //   wsReq.auth.event == 'disconnect' &&
        //   getChat() &&
        //   getChat().owner == user.username
        // ) {
        //   return true;
        // }
      }
      throw new WsException('Unauthorized');
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
