import * as dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { WsGuard } from 'src/auth/auth.guard';
import {
  // CreateChatDTO,
  CreateMessageDTO,
  GetMessagesRangeDTO,
  KickOutDTO,
  SetSeenByDTO,
  // JoinChatDTO,
  // KickOutFromChatDTO,
  // UpdateChatDTO,
} from './chat.dto';
import { WsAuthData } from 'src/auth/auth.dto';
import { ChatService } from './chat.service';
import { getChat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@WebSocketGateway(parseInt(process.env.WS_PORT, 10), {
  cors: {
    origin: [process.env.ORIGIN],
  },
})
// @UseGuards(WsGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() wsServer: Server;
  private readonly wsGuard: WsGuard = new WsGuard(
    new JwtService({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  );

  afterInit() {
    console.log('Initialized ws Server');
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('connect')
  async handleConnection(client: Socket): Promise<any> {
    try {
      if (!(await this.wsGuard.canActivateWs(client))) {
        throw new WsException('Connection Refused: Authorization Failed');
      }
      const username: string =
        typeof client.handshake.headers.username === 'string'
          ? client.handshake.headers.username
          : client.handshake.headers.username[0];

      console.log(`username: ${username}`);
      // const username = client.handshake.headers.username;
      this.wsServer.emit('connected', this.chatService.joinChat(username));
      // return this.chatService.joinChat(username);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket): any {
    try {
      console.log(
        `Client token: ${client.handshake.headers.authorization} disconnect`,
      );
      if (!this.wsGuard.canActivateWs(client)) {
        throw new WsException('Connection Refused: Unauthorized');
      }
      const username: string =
        typeof client.handshake.headers.username === 'string'
          ? client.handshake.headers.username
          : client.handshake.headers.username[0];
      this.wsServer.emit('disconnected', this.chatService.kickOut(username));
      // return this.chatService.kickOut(username);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // @SubscribeMessage('findChat')
  // findOneChat(@ConnectedSocket() client: Socket) {
  //   client.emit('findChat', this.chatService.findChat());
  //   return this.chatService.findChat();
  // }

  @SubscribeMessage('sendMessage')
  createMessage(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: Socket,
  ): any {
    try {
      console.log(
        `Received sendMessage from client ${client.id} | data: ${message}`,
      );
      console.log(`senderUsername: ${message.senderUsername}`);
      console.log(`content: ${message.content}`);
      console.log(`chatId: ${message.chatId ? message.chatId : getChat().id}`);
      this.wsServer.emit(
        'sendMessage',
        this.chatService.sendMessage(
          message.senderUsername,
          message.content,
          message.chatId ? message.chatId : getChat().id,
        ),
      );
      // return this.chatService.sendMessage(
      //   message.senderUsername,
      //   message.content,
      //   message.chatId ? message.chatId : getChat().id,
      // );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @SubscribeMessage('getMessages')
  findAllMessages(
    @MessageBody() messageRange: GetMessagesRangeDTO,
    @ConnectedSocket() client: Socket,
  ): void {
    try {
      console.log(
        `Received getMessages from client: ${client} | data: ${messageRange}`,
      );
      console.log(`from: ${messageRange.from}`);
      console.log(`next: ${messageRange.next}`);
      client.emit(
        'getMessages',
        this.chatService.getMessages(messageRange.from, messageRange.next),
      );
      // return this.chatService.getMessages(nextN.from, nextN.next);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('seenBy')
  setSeenBy(@MessageBody() seenBy: SetSeenByDTO): any {
    try {
      console.log(`Received seenBy from client | data: ${seenBy}`);
      this.wsServer.emit(
        'seenBy',
        this.chatService.setSeen(seenBy.messageId, seenBy.username),
      );
      // return this.chatService.setSeen(seenBy.messageId, seenBy.username);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @SubscribeMessage('kickOut')
  async kickOut(
    client: Socket,
    @MessageBody() kickOutData: KickOutDTO,
  ): Promise<any> {
    try {
      console.log(
        `Received kickOut from client: ${client} | data: ${kickOutData}`,
      );
      if (
        !(await this.wsGuard.canActivateWs(
          null,
          kickOutData.ownerAuth,
          'kickOut',
        ))
      ) {
        throw new WsException('Connection Refused: Authorization Failed');
      }
      const username: string = kickOutData.kickOutUsername;
      this.wsServer.emit('kickOut', this.chatService.kickOut(username));
      // return this.chatService.kickOut(username);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
