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
import { ChatService } from './chat.service';
import {
  // CreateChatDTO,
  CreateMessageDTO,
  FindMessagesRangeDTO,
  // JoinChatDTO,
  // KickOutFromChatDTO,
  UpdateChatDTO,
} from './chat.dto';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/auth.guard';
import { WsAuthData } from 'src/auth/auth.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@WebSocketGateway(parseInt(process.env.WS_PORT, 10), {
  cors: {
    origin: [process.env.ORIGIN],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() wsServer: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  @UseGuards(WsGuard)
  handleConnection(
    @MessageBody() payload: WsAuthData,
    @ConnectedSocket() client: Socket,
  ) {
    const { sockets } = this.wsServer.sockets;

    console.log('connected socket', client);
    console.log('sockets', sockets);

    this.logger.log(
      `Client username: ${payload.username} id: ${payload.id} jwt: ${payload.jwtToken} connected`,
    );
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    this.wsServer.emit('connected', payload.username);
    return this.chatService.joinChat(payload.username);
  }

  @UseGuards(WsGuard)
  handleDisconnect(payload: WsAuthData) {
    this.logger.log(
      `Client username: ${payload.username} id: ${payload.id} jwt: ${payload.jwtToken} disconnected`,
    );
    this.wsServer.emit('disconnected', payload.username);
    return this.chatService.kickOut(payload.username);
  }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('createChat')
  // createChat(
  //   @MessageBody() chat: CreateChatDTO,
  //   // @ConnectedSocket() client: Socket,
  // ) {
  //   this.wsServer.emit('createChat', chat);
  //   return this.chatService.createChat(chat.ownerUsername);
  // }

  // @SubscribeMessage('joinChat')
  // joinChat(@MessageBody() joinPayload: JoinChatDTO) {
  //   return this.chatService.joinChat(joinPayload.peerUsername);
  // }

  // @SubscribeMessage('kickOut')
  // kickOutFromChat(@MessageBody() kickPayload: KickOutFromChatDTO) {
  //   return this.chatService.kickOut(kickPayload.peerUsername);
  // }

  // @SubscribeMessage('findAllChats')
  // findAllChats() {
  //   return this.chatService.findAllChats();
  // }

  @UseGuards(WsGuard)
  @SubscribeMessage('findChat')
  findOneChat() {
    return this.chatService.findChat();
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('updateChat')
  updateChat(
    @MessageBody() chat: UpdateChatDTO,
    // @ConnectedSocket() client: Socket,
  ) {
    this.wsServer.emit('updateChat', chat);
    return this.chatService.updateChat(chat.ownerUsername);
  }

  // @SubscribeMessage('removeChat')
  // removeChat(@MessageBody() id: string) {
  //   return this.chatService.removeChat(id);
  // }

  @UseGuards(WsGuard)
  @SubscribeMessage('sendMessage')
  createMessage(
    @MessageBody() message: CreateMessageDTO,
    // @ConnectedSocket() client: Socket,
  ) {
    this.wsServer.emit('sendMessage', message);
    return this.chatService.sendMessage(
      message.senderUsername,
      message.content,
      message.chatId,
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('findMessages')
  findAllMessages(@MessageBody() nextN: FindMessagesRangeDTO) {
    return this.chatService.findMessages(nextN.from, nextN.next);
  }

  // @SubscribeMessage('findOneMessage')
  // findOneMessage(@MessageBody() id: string) {
  //   return this.chatService.findOneMessage(id);
  // }

  // @SubscribeMessage('updateMessage')
  // updateMessage(@MessageBody() message: Message) {
  //   return this.chatService.updateMessage(message.id, message);
  // }

  // @SubscribeMessage('removeMessage')
  // removeMessage(@MessageBody() id: string) {
  //   return this.chatService.removeMessage(id);
  // }
}
