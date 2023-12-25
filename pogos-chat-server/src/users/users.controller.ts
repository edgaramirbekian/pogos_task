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
import { UsersService } from './users.service';
// import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDTO) {
  //   return this.usersService.create(
  //     createUserDto.username,
  //     createUserDto.password,
  //   );
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  // @UseGuards(AuthGuard)
  // @Patch(':username')
  // update(
  //   @Param('username') username: string,
  //   @Body() updateUserDto: UpdateUserDTO,
  // ) {
  //   return this.usersService.update(username, updateUserDto.username);
  // }

  @UseGuards(AuthGuard)
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
