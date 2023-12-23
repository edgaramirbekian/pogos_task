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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const chat_entity_1 = require("../entities/chat.entity");
const message_entity_1 = require("../entities/message.entity");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    createChat(chat) {
        return this.chatService.createChat(chat);
    }
    findAllChats() {
        return this.chatService.findAllChats();
    }
    findOneChat(id) {
        return this.chatService.findOneChat(id);
    }
    updateChat(chat) {
        return this.chatService.updateChat(chat.id, chat);
    }
    removeChat(id) {
        return this.chatService.removeChat(id);
    }
    createMessage(message) {
        return this.chatService.createMessage(message);
    }
    findAllMessages() {
        return this.chatService.findAllMessages();
    }
    findOneMessage(id) {
        return this.chatService.findOneMessage(id);
    }
    updateMessage(message) {
        return this.chatService.updateMessage(message.id, message);
    }
    removeMessage(id) {
        return this.chatService.removeMessage(id);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('createChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_entity_1.Chat]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "createChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllChats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findAllChats", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findOneChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_entity_1.Chat]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "updateChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "removeChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_entity_1.Message]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "createMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllMessages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findAllMessages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findOneMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_entity_1.Message]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "updateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "removeMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map