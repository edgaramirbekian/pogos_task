import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':username')
  findOne(@Param('username') username: string): any {
    const user: User = this.usersService.findOne(username);
    return { id: user.id, username: user.username };
  }

  @UseGuards(AuthGuard)
  @Delete(':username')
  remove(@Param('username') username: string): boolean {
    return this.usersService.remove(username);
  }
}
