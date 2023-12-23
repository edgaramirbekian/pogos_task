"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFactory = exports.User = exports.hashPassword = exports.allUsers = void 0;
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
exports.allUsers = new Map();
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
exports.hashPassword = hashPassword;
class User {
    constructor(username, passwordHash) {
        this.id = (0, crypto_1.randomBytes)(16).toString('hex');
        this.username = username;
        this.passwordHash = passwordHash;
    }
    logInOut(isIn) {
        this.isLoggedIn = isIn;
    }
}
exports.User = User;
const userFactory = async (username, password) => {
    if (!exports.allUsers.has(username)) {
        const passHash = await (0, exports.hashPassword)(password);
        const newUser = new User(username, passHash);
        exports.allUsers.set(newUser.username, newUser);
        return exports.allUsers.get(newUser.username);
    }
    return null;
};
exports.userFactory = userFactory;
//# sourceMappingURL=user.entity.js.map