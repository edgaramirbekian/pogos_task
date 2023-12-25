import { ForbiddenException, Injectable } from '@nestjs/common';
import { Chat, getChat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class ChatService {
  createChat(ownerUsername: string) {
    const chat: Chat = new Chat(ownerUsername);
    return chat;
  }

  joinChat(peerUsername: string) {
    const chat: Chat = getChat();
    if (!chat) {
      throw new ForbiddenException('Cant join a Chat that dont exist');
    }
    chat.addPeer(peerUsername);
    return chat;
  }

  kickOut(peerUsername: string) {
    const chat: Chat = getChat();
    if (!chat) {
      throw new ForbiddenException('Cant kick out from a Chat that dont exist');
    }
    chat.removePeer(peerUsername);
    return chat;
  }

  // findAllChats() {
  //   return `This action returns all chat`;
  // }

  findChat() {
    return getChat();
  }

  updateChat(ownerUsername: string) {
    const chat: Chat = getChat();
    if (chat) {
      chat.swapOwner(ownerUsername);
    }
    return chat;
  }

  // removeChat(id: string) {
  //   return `This action removes a #${id} chat`;
  // }

  sendMessage(senderUsername: string, content: string, chatId: string) {
    const chat: Chat = getChat();
    if (!chat) {
      throw new ForbiddenException('There is no Chat');
    }
    const message: Message = new Message(content, senderUsername, chatId);
    chat.addMessage(message);
    return message;
  }

  findMessages(from: number, next: number) {
    const chat: Chat = getChat();
    if (!chat) {
      throw new ForbiddenException('There is no Chat');
    }
    chat.messages.slice(from, from + next);
    return `This action returns all chat`;
  }

  // findOneMessage(id: string) {
  //   return `This action returns a #${id} chat`;
  // }

  // updateMessage(id: string, message: Message) {
  //   return `This action updates a #${id} chat`;
  // }

  // removeMessage(id: string) {
  //   return `This action removes a #${id} chat`;
  // }
}
