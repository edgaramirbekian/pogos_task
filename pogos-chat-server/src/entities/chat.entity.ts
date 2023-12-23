import { User } from "./user.entity";
import { Message } from "./message.entity";
import { randomBytes } from 'crypto';

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

export class Chat implements IChat {
  id: string;
  messages: Array<Message> = new Array<Message>();
  owner: string;
  dateCreated: Date;
  peers: Array<string> = new Array<string>();
  constructor(ownerUsername: string) {
    this.id = randomBytes(16).toString('hex');
    this.dateCreated = new Date();
    this.peers.push(ownerUsername);
  }

  addMessage(content: Message): boolean {
    this.messages.push(content);
    return true;
  }

  addPeer(peerUsername: string): boolean {
    this.peers.push(peerUsername);
    return true;
  }

  swapOwner(username: string): boolean {
    this.owner = username;
    return true;
  }
}
