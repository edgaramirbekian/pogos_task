import { User } from 'src/entities/user.entity';
export declare class UsersService {
    create(username: string, password: string): Promise<User>;
    findAll(): Map<string, User>;
    findOne(username: string): User;
    remove(username: string): boolean;
}
