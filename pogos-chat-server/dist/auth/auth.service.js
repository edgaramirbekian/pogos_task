"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signIn(username, pass) {
        let user = this.usersService.findOne(username);
        if (!user) {
            user = await this.usersService.create(username, pass);
        }
        const hashedPass = await (0, user_entity_1.hashPassword)(pass);
        if (await bcrypt.compare(hashedPass, user.passwordHash)) {
            throw new common_1.UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        user.isLoggedIn = true;
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    logOut(username) {
        const user = this.usersService.findOne(username);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        user.isLoggedIn = false;
        console.log(this.usersService.findAll());
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map