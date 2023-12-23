import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
export declare class ChatService {
    createChat(chat: Chat): string;
    findAllChats(): string;
    findOneChat(id: string): string;
    updateChat(id: string, chat: Chat): string;
    removeChat(id: string): string;
    createMessage(message: Message): string;
    findAllMessages(): string;
    findOneMessage(id: string): string;
    updateMessage(id: string, message: Message): string;
    removeMessage(id: string): string;
}
