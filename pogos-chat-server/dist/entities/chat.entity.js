"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const crypto_1 = require("crypto");
class Chat {
    constructor(ownerUsername) {
        this.messages = new Array();
        this.peers = new Array();
        this.id = (0, crypto_1.randomBytes)(16).toString('hex');
        this.dateCreated = new Date();
        this.peers.push(ownerUsername);
    }
    addMessage(content) {
        this.messages.push(content);
        return true;
    }
    addPeer(peerUsername) {
        this.peers.push(peerUsername);
        return true;
    }
    swapOwner(username) {
        this.owner = username;
        return true;
    }
}
exports.Chat = Chat;
//# sourceMappingURL=chat.entity.js.map