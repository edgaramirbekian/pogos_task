import {
  Body,
  Req,
  Controller,
  Get,
  Post,
  Request,
  // Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDTO): Promise<any> {
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      null,
    );
  }

  @Post('signup')
  signUp(@Body() signInDto: SignInDTO): Promise<any> {
    return this.authService.signUp(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logOut(@Req() request: Request): boolean {
    return this.authService.logOut(request['user'].username);
  }
}
