export interface Chat {
    id: string;
    messages: Array<Message>;
    owner: string;
    dateCreated: Date;
    peers: Array<string>;
}

export interface Message {
    id: string;
    content: string;
    senderUsername: string;
    chatID: string;
    dateCreated: Date;
    seenBy: Array<string>;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface WsData {
  jwtToken: string;
  username: string;
  event?: string;
}

export interface WsAuthData {
  auth: WsData;
}

export interface SignInResponseData {
  access_token: string;
  chat: Chat
}

export interface MessageData {
  senderUsername: string;
  content: string;
  chatId: string;
}

export interface GetMessagesRangeData {
  from: number;
  next: number;
}
