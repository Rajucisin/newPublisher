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
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
let WhatsappController = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async handleIncomingWebhook(body, res) {
        const sender = body.From;
        const textContent = body.Body?.trim();
        if (!sender || !textContent) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: 'Invalid webhook payload parameters.',
            });
        }
        try {
            const replyMessage = await this.whatsappService.processUserResponse(sender, textContent);
            res.set('Content-Type', 'text/xml');
            const twiml = `
        <Response>
          <Message>${replyMessage}</Message>
        </Response>
      `.trim();
            return res.status(common_1.HttpStatus.OK).send(twiml);
        }
        catch (error) {
            res.set('Content-Type', 'text/xml');
            const errorTwiml = `
        <Response>
          <Message>An error occurred processing your request. Please try again later.</Message>
        </Response>
      `;
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send(errorTwiml);
        }
    }
    async getContacts() {
        return this.whatsappService.getSyncedContacts();
    }
    async syncContacts(body) {
        const count = await this.whatsappService.triggerContactSync(body.phoneNumber);
        return {
            message: 'Contacts synced successfully',
            syncedCount: count,
        };
    }
    async broadcast(body) {
        const result = await this.whatsappService.sendBulkBroadcast(body.message, body.targetPhones);
        return {
            message: 'Broadcast dispatched successfully',
            details: result,
        };
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Post)('webhooks/whatsapp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "handleIncomingWebhook", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('contacts/sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "syncContacts", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "broadcast", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, common_1.Controller)('api/v1/whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map