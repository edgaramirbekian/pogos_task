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
} from '@nestjs/websockets';
import { WsGuard } from 'src/auth/auth.guard';
import {
  // CreateChatDTO,
  CreateMessageDTO,
  GetMessagesRangeDTO,
  SetSeenByDTO,
  // JoinChatDTO,
  // KickOutFromChatDTO,
  // UpdateChatDTO,
} from './chat.dto';
import { WsAuthData } from 'src/auth/auth.dto';
import { ChatService } from './chat.service';
import { getChat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';

dotenv.config();

@WebSocketGateway(parseInt(process.env.WS_PORT, 10), {
  cors: {
    origin: [process.env.ORIGIN],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() wsServer: Server;

  afterInit() {
    console.log('Initialized');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('connected')
  handleConnection(
    @MessageBody() payload: WsAuthData,
    @ConnectedSocket() client: Socket,
  ): string {
    const { sockets } = this.wsServer.sockets;

    console.log(`sockets: ${sockets}`);
    console.log(`payload: ${payload}`);
    console.log(`connected socket: ${client}`);
    console.log(`payload.auth: ${payload.auth}`);

    console.log(
      `Client username: ${payload.auth.username} jwt: ${payload.auth.jwtToken} connected`,
    );
    console.log(`Number of connected clients: ${sockets.size}`);
    // this.wsServer.emit('connected', payload.auth.username);
    return this.chatService.joinChat(payload.auth.username);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('disconnected')
  handleDisconnect(payload: WsAuthData): string {
    console.log(
      `Client username: ${payload.auth.username} jwt: ${payload.auth.jwtToken} disconnected`,
    );
    // this.wsServer.emit('disconnected', payload.auth.username);
    return this.chatService.kickOut(payload.auth.username);
  }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('findChat')
  // findOneChat(@ConnectedSocket() client: Socket) {
  //   client.emit('findChat', this.chatService.findChat());
  //   return this.chatService.findChat();
  // }

  // @UseGuards(WsGuard)
  @SubscribeMessage('sendMessage')
  createMessage(@MessageBody() message: CreateMessageDTO): Message {
    // this.wsServer.emit('sendMessage', message);
    return this.chatService.sendMessage(
      message.senderUsername,
      message.content,
      message.chatId ? message.chatId : getChat().id,
    );
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('getMessages')
  findAllMessages(
    @MessageBody() nextN: GetMessagesRangeDTO,
    @ConnectedSocket() client: Socket,
  ): void {
    client.emit(
      'getMessages',
      this.chatService.getMessages(nextN.from, nextN.next),
    );
    // return this.chatService.getMessages(nextN.from, nextN.next);
  }

  @SubscribeMessage('seenBy')
  setSeenBy(@MessageBody() seenBy: SetSeenByDTO): boolean {
    // this.wsServer.emit('seenBy', {seenBy.messageId, seenBy.username});
    return this.chatService.setSeen(seenBy.messageId, seenBy.username);
  }
}
