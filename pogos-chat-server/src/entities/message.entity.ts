import { User } from "./user.entity";
import { Chat } from "./chat.entity";
import { randomBytes } from 'crypto';
import { send } from "process";

interface IMessage {
  id: string;
  content: string;
  senderUsername: string;
  dateCreated: Date;
  seenBy: Array<string>;
  setSeenBy(username: string): boolean;
}

export class Message implements IMessage {
  id: string;
  content: string;
  senderUsername: string;
  dateCreated: Date;
  seenBy: Array<string> = new Array<string>();

  constructor(content: string, senderUsername: string) {
    this.id = randomBytes(16).toString('hex');
    this.content = content;
    this.senderUsername = senderUsername;
    this.dateCreated = new Date();
  }

  setSeenBy(username: string): boolean {
    this.seenBy.push(username);
    return true;
  }
}
