import { 
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody 
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  createChat(@MessageBody() chat: Chat) {
    return this.chatService.createChat(chat);
  }

  @SubscribeMessage('findAllChats')
  findAllChats() {
    return this.chatService.findAllChats();
  }

  @SubscribeMessage('findOneChat')
  findOneChat(@MessageBody() id: string) {
    return this.chatService.findOneChat(id);
  }

  @SubscribeMessage('updateChat')
  updateChat(@MessageBody() chat: Chat) {
    return this.chatService.updateChat(chat.id, chat);
  }

  @SubscribeMessage('removeChat')
  removeChat(@MessageBody() id: string) {
    return this.chatService.removeChat(id);
  }

  @SubscribeMessage('createMessage')
  createMessage(@MessageBody() message: Message) {
    return this.chatService.createMessage(message);
  }

  @SubscribeMessage('findAllMessages')
  findAllMessages() {
    return this.chatService.findAllMessages();
  }

  @SubscribeMessage('findOneMessage')
  findOneMessage(@MessageBody() id: string) {
    return this.chatService.findOneMessage(id);
  }

  @SubscribeMessage('updateMessage')
  updateMessage(@MessageBody() message: Message) {
    return this.chatService.updateMessage(message.id, message);
  }

  @SubscribeMessage('removeMessage')
  removeMessage(@MessageBody() id: string) {
    return this.chatService.removeMessage(id);
  }
}
