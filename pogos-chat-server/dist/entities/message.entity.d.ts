interface IMessage {
    id: string;
    content: string;
    senderUsername: string;
    dateCreated: Date;
    seenBy: Array<string>;
    setSeenBy(username: string): boolean;
}
export declare class Message implements IMessage {
    id: string;
    content: string;
    senderUsername: string;
    dateCreated: Date;
    seenBy: Array<string>;
    constructor(content: string, senderUsername: string);
    setSeenBy(username: string): boolean;
}
export {};
