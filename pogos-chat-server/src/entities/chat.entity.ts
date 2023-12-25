import { Message } from './message.entity';
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

let chatObject: Chat = null;

export class Chat implements IChat {
  id: string;
  messages: Array<Message> = new Array<Message>();
  owner: string;
  dateCreated: Date;
  peers: Array<string> = new Array<string>();
  constructor(ownerUsername: string) {
    if (chatObject) {
      return chatObject;
    }
    this.id = randomBytes(16).toString('hex');
    this.dateCreated = new Date();
    this.peers.push(ownerUsername);
    chatObject = this;
  }

  addMessage(content: Message): boolean {
    this.messages.push(content);
    return true;
  }

  addPeer(peerUsername: string): boolean {
    this.peers.push(peerUsername);
    return true;
  }

  removePeer(peerUsername: string): boolean {
    this.peers.filter((item) => {
      return item !== peerUsername;
    });
    return true;
  }

  swapOwner(newUsername: string): boolean {
    this.owner = newUsername;
    return true;
  }
}

export const getChat = (): Chat => {
  return chatObject;
};
