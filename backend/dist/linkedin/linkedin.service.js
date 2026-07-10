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
const https = require("https");
let LinkedinService = LinkedinService_1 = class LinkedinService {
    constructor() {
        this.logger = new common_1.Logger(LinkedinService_1.name);
    }
    async publishShare(accessToken, authorUrn, text, mediaUrl) {
        this.logger.log(`Publishing share to LinkedIn for author ${authorUrn}`);
        if (!accessToken ||
            accessToken.startsWith('your_') ||
            accessToken.trim() === '' ||
            !authorUrn ||
            authorUrn.startsWith('urn:li:person:your_') ||
            authorUrn.trim() === '') {
            this.logger.log('[LinkedIn Service] Credentials not configured in .env. Falling back to Sandbox Mock.');
            const mockPostId = Math.random().toString(36).substring(7);
            return {
                shareUrn: `urn:li:share:${mockPostId}`,
            };
        }
        const postData = {
            author: authorUrn.trim(),
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text },
                    shareMediaCategory: mediaUrl ? 'IMAGE' : 'NONE',
                    media: mediaUrl ? [{ status: 'READY', originalUrl: mediaUrl }] : []
                }
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
        };
        const bodyString = JSON.stringify(postData);
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.linkedin.com',
                path: '/v2/ugcPosts',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.trim()}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyString),
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            };
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const json = JSON.parse(responseBody);
                            resolve({ shareUrn: json.id || `urn:li:share:${Math.random().toString(36).substring(7)}` });
                        }
                        catch {
                            resolve({ shareUrn: `urn:li:share:${Math.random().toString(36).substring(7)}` });
                        }
                    }
                    else {
                        reject(new Error(`LinkedIn API returned status ${res.statusCode}: ${responseBody}`));
                    }
                });
            });
            req.on('error', (e) => {
                reject(e);
            });
            req.write(bodyString);
            req.end();
        });
    }
    async getProfileDetails(accessToken) {
        if (!accessToken || accessToken.startsWith('your_') || accessToken.trim() === '') {
            return {
                id: 'person-abc',
                localizedFirstName: 'Jane',
                localizedLastName: 'Doe',
                profilePicture: 'https://media.licdn.com/dms/image/mock-avatar.jpg',
            };
        }
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.linkedin.com',
                path: '/v2/me',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken.trim()}`,
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            };
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(responseBody));
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    else {
                        reject(new Error(`LinkedIn API returned status ${res.statusCode}: ${responseBody}`));
                    }
                });
            });
            req.on('error', (e) => reject(e));
            req.end();
        });
    }
};
exports.LinkedinService = LinkedinService;
exports.LinkedinService = LinkedinService = LinkedinService_1 = __decorate([
    (0, common_1.Injectable)()
], LinkedinService);
//# sourceMappingURL=linkedin.service.js.map