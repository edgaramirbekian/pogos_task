import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Chat, getChat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { allUsers } from 'src/entities/user.entity';

@Injectable()
export class ChatService {
  createChat(ownerUsername: string): Chat {
    const chat: Chat = new Chat(ownerUsername);
    return chat;
  }

  findChat() {
    return getChat();
  }

  updateChat(ownerUsername: string): Chat {
    const chat: Chat = getChat();
    if (chat) {
      chat.swapOwner(ownerUsername);
    }
    return chat;
  }

  sendMessage(
    senderUsername: string,
    content: string,
    chatId: string,
  ): Message {
    const chat: Chat = getChat();
    if (!chat) {
      throw new WsException('There is no Chat');
    }
    const message: Message = new Message(content, senderUsername, chatId);
    chat.addMessage(message);
    return message;
  }

  getMessages(from: number, next: number): Array<Message> {
    const chat: Chat = getChat();
    if (!chat) {
      throw new WsException('There is no Chat');
    }
    const messagesSlice: Array<Message> = chat.messages.slice(
      from,
      from + next,
    );
    return messagesSlice;
  }

  joinChat(peerUsername: string): string {
    const chat: Chat = getChat();
    if (!chat) {
      throw new WsException('Cant join a Chat that dont exist');
    }
    if (!chat.peers.includes(peerUsername)) {
      chat.addPeer(peerUsername);
    }
    console.log('all peers in chat', chat.peers);
    return peerUsername;
  }

  kickOut(peerUsername: string): string {
    const chat: Chat = getChat();
    if (!chat || allUsers.has(peerUsername)) {
      throw new WsException(
        'Cant kick out a User that dont exists or from a Chat that dont exist',
      );
    }
    chat.removePeer(peerUsername);
    return peerUsername;
  }

  setSeen(messageId: string, username: string): any {
    const chat: Chat = getChat();
    if (!chat) {
      throw new WsException('No chat to find message in');
    }
    chat.messages.map((aMessage) => {
      if (aMessage.id === messageId) {
        return aMessage.setSeenBy(username);
      }
    });
    return { username, messageId };
  }
}
