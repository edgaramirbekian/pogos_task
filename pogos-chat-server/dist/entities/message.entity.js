"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const crypto_1 = require("crypto");
class Message {
    constructor(content, senderUsername) {
        this.seenBy = new Array();
        this.id = (0, crypto_1.randomBytes)(16).toString('hex');
        this.content = content;
        this.senderUsername = senderUsername;
        this.dateCreated = new Date();
    }
    setSeenBy(username) {
        this.seenBy.push(username);
        return true;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map