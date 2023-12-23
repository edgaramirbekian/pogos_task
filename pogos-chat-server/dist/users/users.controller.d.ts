import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(username: string): import("../entities/user.entity").User;
    remove(username: string): boolean;
}
