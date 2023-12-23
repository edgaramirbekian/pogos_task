"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
let UsersService = class UsersService {
    async create(username, password) {
        if (user_entity_1.allUsers.has(username)) {
            const user = user_entity_1.allUsers.get(username);
            user.isLoggedIn = true;
            return user;
        }
        else {
            const newUser = await (0, user_entity_1.userFactory)(username, password);
            return newUser;
        }
    }
    findAll() {
        return user_entity_1.allUsers;
    }
    findOne(username) {
        return user_entity_1.allUsers.get(username);
    }
    remove(username) {
        return user_entity_1.allUsers.delete(username);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map