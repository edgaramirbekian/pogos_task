import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, userFactory, allUsers } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  async create(username: string, password: string): Promise<User> {
    if (allUsers.has(username)) {
      throw new ForbiddenException();
    } else {
      const newUser: User = await userFactory(username, password);
      return newUser;
    }
  }

  findAll() {
    return allUsers;
  }

  findOne(username: string): User {
    return allUsers.get(username);
  }

  remove(username: string): boolean {
    return allUsers.delete(username);
  }
}
