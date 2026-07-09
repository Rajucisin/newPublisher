"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LinkedinService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinService = void 0;
const common_1 = require("@nestjs/common");
let LinkedinService = LinkedinService_1 = class LinkedinService {
    constructor() {
        this.logger = new common_1.Logger(LinkedinService_1.name);
    }
    async publishShare(accessToken, authorUrn, text, mediaUrl) {
        this.logger.log(`Publishing share to LinkedIn for author ${authorUrn}`);
        const mockPostId = Math.random().toString(36).substring(7);
        return {
            shareUrn: `urn:li:share:${mockPostId}`,
        };
    }
    async getProfileDetails(accessToken) {
        return {
            id: 'person-abc',
            localizedFirstName: 'Jane',
            localizedLastName: 'Doe',
            profilePicture: 'https://media.licdn.com/dms/image/mock-avatar.jpg',
        };
    }
};
exports.LinkedinService = LinkedinService;
exports.LinkedinService = LinkedinService = LinkedinService_1 = __decorate([
    (0, common_1.Injectable)()
], LinkedinService);
//# sourceMappingURL=linkedin.service.js.map