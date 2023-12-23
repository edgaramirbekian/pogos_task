import { Injectable } from '@nestjs/common';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class ChatService {
  createChat(chat: Chat) {
    return 'This action adds a new chat';
  }

  findAllChats() {
    return `This action returns all chat`;
  }

  findOneChat(id: string) {
    return `This action returns a #${id} chat`;
  }

  updateChat(id: string, chat: Chat) {
    return `This action updates a #${id} chat`;
  }

  removeChat(id: string) {
    return `This action removes a #${id} chat`;
  }

  createMessage(message: Message) {
    return 'This action adds a new chat';
  }

  findAllMessages() {
    return `This action returns all chat`;
  }

  findOneMessage(id: string) {
    return `This action returns a #${id} chat`;
  }

  updateMessage(id: string, message: Message) {
    return `This action updates a #${id} chat`;
  }

  removeMessage(id: string) {
    return `This action removes a #${id} chat`;
  }
}
