import {
  MinLength,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from '@nestjs/class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

// export class LogOutDTO {
//   @IsNotEmpty()
//   @IsString()
//   username: string;
// }

export class WsData {
  @IsNotEmpty()
  @IsString()
  jwtToken: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  event?: string;

  // @IsNotEmpty()
  // @IsString()
  // chatId: string;
}

export class WsAuthData {
  @IsNotEmpty()
  auth: WsData;
}
