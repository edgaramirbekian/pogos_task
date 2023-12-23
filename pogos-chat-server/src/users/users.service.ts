import { Injectable } from '@nestjs/common';
import { User, userFactory, allUsers } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  async create(username: string, password: string) {
    if (allUsers.has(username)) {
      const user: User = allUsers.get(username);
      user.isLoggedIn = true;
      return user;
    } else {
      const newUser: User = await userFactory(username, password);
      return newUser;
    }
  }

  findAll() {
    return allUsers;
  }

  findOne(username: string) {
    return allUsers.get(username);
  }

  // update(username: string, newUsername: string) {
  //   const user: User = allUsers.get(username);
  //   allUsers.delete(username);
  //   allUsers.set(newUsername, user);
  //   return allUsers[newUsername];
  // }

  remove(username: string) {
    return allUsers.delete(username);
  }
}
