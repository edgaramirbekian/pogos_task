import {
  MinLength,
  IsNotEmpty,
  IsString,
  Matches,
} from '@nestjs/class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export class LogOutDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}