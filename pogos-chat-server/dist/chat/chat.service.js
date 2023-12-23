"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
let ChatService = class ChatService {
    createChat(chat) {
        return 'This action adds a new chat';
    }
    findAllChats() {
        return `This action returns all chat`;
    }
    findOneChat(id) {
        return `This action returns a #${id} chat`;
    }
    updateChat(id, chat) {
        return `This action updates a #${id} chat`;
    }
    removeChat(id) {
        return `This action removes a #${id} chat`;
    }
    createMessage(message) {
        return 'This action adds a new chat';
    }
    findAllMessages() {
        return `This action returns all chat`;
    }
    findOneMessage(id) {
        return `This action returns a #${id} chat`;
    }
    updateMessage(id, message) {
        return `This action updates a #${id} chat`;
    }
    removeMessage(id) {
        return `This action removes a #${id} chat`;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map