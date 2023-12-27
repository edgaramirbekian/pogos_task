import { IsNotEmpty, IsPositive, IsString } from '@nestjs/class-validator';

export class CreateChatDTO {
  @IsNotEmpty()
  @IsString()
  ownerUsername: string;
}

export class UpdateChatDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  ownerUsername: string;
}

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  senderUsername: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  chatId?: string;
}

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  // @IsNotEmpty()
  @IsString()
  chatId: string;
}

export class GetMessagesRangeDTO {
  @IsNotEmpty()
  @IsPositive()
  from: number;

  @IsPositive()
  next: number = 50;
}

export class SetSeenByDTO {
  @IsNotEmpty()
  @IsString()
  messageId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}

export class KickOutDTO {
  @IsNotEmpty()
  @IsString()
  kickUsername: string;

  @IsNotEmpty()
  @IsString()
  ownerAuth: string;
}
