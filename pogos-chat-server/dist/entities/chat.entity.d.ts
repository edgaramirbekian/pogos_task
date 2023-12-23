import { Message } from "./message.entity";
interface IChat {
    id: string;
    messages: Array<Message>;
    owner: string;
    dateCreated: Date;
    peers: Array<string>;
    addMessage(content: Message): boolean;
    addPeer(peerUsername: string): boolean;
    swapOwner(username: string): boolean;
}
export declare class Chat implements IChat {
    id: string;
    messages: Array<Message>;
    owner: string;
    dateCreated: Date;
    peers: Array<string>;
    constructor(ownerUsername: string);
    addMessage(content: Message): boolean;
    addPeer(peerUsername: string): boolean;
    swapOwner(username: string): boolean;
}
export {};
