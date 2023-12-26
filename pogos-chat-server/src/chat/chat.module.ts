import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsGuard } from 'src/auth/auth.guard';

@Module({
  providers: [ChatGateway, ChatService, WsGuard],
  exports: [ChatService],
})
export class ChatModule {}
