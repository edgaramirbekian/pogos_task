import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/entities/user.entity';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, chat: Chat): Promise<any> {
    try {
      const user: User = await this.validateUser(username, pass);
      if (!user) {
        throw new UnauthorizedException();
      }
      if (!chat) {
        chat = this.usersService.findAll().size
          ? this.chatService.createChat(user.username)
          : this.chatService.findChat();
      }
      const chatWithNoMessages = {};
      for (const key in chat) {
        if (key !== 'messages') {
          chatWithNoMessages[key] = chat[key];
        } else {
          chatWithNoMessages[key] = chat[key].slice(-10);
        }
      }
      const payload = { id: user.id, username: user.username };
      user.isLoggedIn = true;
      const jwtToken: string = await this.jwtService.signAsync(payload);
      return {
        access_token: jwtToken,
        chat: chatWithNoMessages,
      };
    } catch (error) {
      throw error;
    }
  }

  async signUp(username: string, pass: string): Promise<any> {
    try {
      if (!this.usersService.findOne(username)) {
        const user: User = await this.usersService.create(username, pass);
        const chat: Chat = !this.usersService.findAll().size
          ? this.chatService.createChat(user.username)
          : this.chatService.findChat();
        return await this.signIn(user.username, pass, chat);
      } else {
        throw new ForbiddenException('Username is busy');
      }
    } catch (error) {
      throw error;
    }
  }

  async validateUser(username: string, pass: string): Promise<User> {
    const user: User = this.usersService.findOne(username);
    if (!user) {
      return null;
    }
    const isMatch: boolean = await bcrypt.compare(pass, user.passwordHash);
    if (isMatch) {
      return user;
    }
    return null;
  }

  logOut(username: string): boolean {
    const user: User = this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.isLoggedIn = false;
    return true;
  }
}
