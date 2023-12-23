import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/entities/user.entity';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    let user: User = this.usersService.findOne(username);
    if (!user) {
      user = await this.usersService.create(username, pass);
    }
    const hashedPass: string = await hashPassword(pass);
    if (await bcrypt.compare(hashedPass, user.passwordHash)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    user.isLoggedIn = true;
    const jwtToken: string = await this.jwtService.signAsync(payload);
    user.jwt = jwtToken;
    return {
      access_token: jwtToken,
    };
  }

  validateUser(username: string, payload: string): any {
    const user: User = this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.jwt == payload;
  }

  logOut(username: string): boolean {
    const user: User = this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.isLoggedIn = false;
    console.log(this.usersService.findAll());
    return true;
  }
}
