import { ChatService } from './chat.service';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
export declare class ChatGateway {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChat(chat: Chat): string;
    findAllChats(): string;
    findOneChat(id: string): string;
    updateChat(chat: Chat): string;
    removeChat(id: string): string;
    createMessage(message: Message): string;
    findAllMessages(): string;
    findOneMessage(id: string): string;
    updateMessage(message: Message): string;
    removeMessage(id: string): string;
}
