import { IsNotEmpty, IsPositive, IsString } from '@nestjs/class-validator';

export class CreateChatDTO {
  @IsNotEmpty()
  @IsString()
  ownerUsername: string;
}

// export class JoinChatDTO {
//   @IsNotEmpty()
//   @IsString()
//   peerUsername: string;
// }

// export class KickOutFromChatDTO {
//   @IsNotEmpty()
//   @IsString()
//   peerUsername: string;
// }

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

  @IsNotEmpty()
  @IsString()
  chatId: string;
}

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  // @IsNotEmpty()
  @IsString()
  chatId: string;
}

export class FindMessagesRangeDTO {
  @IsNotEmpty()
  @IsPositive()
  from: number;

  @IsNotEmpty()
  @IsPositive()
  next: number;
}
