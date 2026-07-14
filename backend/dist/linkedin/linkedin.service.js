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
const sqlite3 = require("sqlite3");
const path = require("path");
let LinkedinService = LinkedinService_1 = class LinkedinService {
    constructor() {
        this.logger = new common_1.Logger(LinkedinService_1.name);
        this.dbPath = path.resolve(process.cwd(), '../database.sqlite');
    }
    async publishShare(accessToken, authorUrn, text, mediaUrl) {
        this.logger.log(`Publishing share to LinkedIn for author ${authorUrn}`);
        let cleanAuthor = authorUrn.trim();
        if (cleanAuthor.startsWith('urn:li:member:')) {
            cleanAuthor = cleanAuthor.replace('urn:li:member:', 'urn:li:person:');
        }
        if (!accessToken ||
            accessToken.startsWith('your_') ||
            accessToken.trim() === '' ||
            !cleanAuthor ||
            cleanAuthor.startsWith('urn:li:person:your_') ||
            cleanAuthor.trim() === '') {
            this.logger.log('[LinkedIn Service] Credentials not configured in .env. Falling back to Sandbox Mock.');
            const mockPostId = Math.random().toString(36).substring(7);
            return {
                shareUrn: `urn:li:share:${mockPostId}`,
            };
        }
        const postData = {
            author: cleanAuthor,
            commentary: text,
            visibility: 'PUBLIC',
            distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: []
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false
        };
        const bodyString = JSON.stringify(postData);
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.linkedin.com',
                path: '/rest/posts',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken.trim()}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyString),
                    'X-Restli-Protocol-Version': '2.0.0',
                    'LinkedIn-Version': '202605'
                }
            };
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const postUrn = res.headers['x-restli-id'] || `urn:li:share:${Math.random().toString(36).substring(7)}`;
                        resolve({ shareUrn: String(postUrn) });
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
    onModuleInit() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                this.logger.error(`Failed to connect to database: ${err.message}`);
                return;
            }
            const query = `
        CREATE TABLE IF NOT EXISTS linkedin_accounts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          login_id TEXT NOT NULL,
          password TEXT,
          auth_method TEXT NOT NULL,
          access_token TEXT,
          member_urn TEXT,
          is_active INTEGER DEFAULT 0,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `;
            this.db.run(query, (err2) => {
                if (err2) {
                    this.logger.error(`Failed to create linkedin_accounts table: ${err2.message}`);
                }
                else {
                    this.seedDefaultAccount();
                }
            });
        });
    }
    seedDefaultAccount() {
        this.db.get("SELECT COUNT(*) as count FROM linkedin_accounts", [], (err, row) => {
            if (!err && row && row.count === 0) {
                const token = process.env.LINKEDIN_ACCESS_TOKEN || '';
                const urn = process.env.LINKEDIN_MEMBER_URN || '';
                const query = `
          INSERT INTO linkedin_accounts (id, user_id, name, login_id, password, auth_method, access_token, member_urn, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
                this.db.run(query, [
                    'acc-sandy',
                    'default_user',
                    'Sandy Sharma (Personal Profile)',
                    'sandeep.s@cisinlabs.com',
                    '********',
                    'oauth_token',
                    token,
                    urn,
                    1
                ], (err3) => {
                    if (err3) {
                        this.logger.error(`Failed to seed default LinkedIn account: ${err3.message}`);
                    }
                    else {
                        this.logger.log('Seeded default Sandy Sharma LinkedIn account successfully.');
                    }
                });
            }
        });
    }
    async getActiveCredentials() {
        return new Promise((resolve) => {
            this.db.get("SELECT access_token, member_urn FROM linkedin_accounts WHERE is_active = 1", [], (err, row) => {
                if (!err && row) {
                    resolve({
                        token: row.access_token || process.env.LINKEDIN_ACCESS_TOKEN || '',
                        urn: row.member_urn || process.env.LINKEDIN_MEMBER_URN || ''
                    });
                }
                else {
                    resolve({
                        token: process.env.LINKEDIN_ACCESS_TOKEN || '',
                        urn: process.env.LINKEDIN_MEMBER_URN || ''
                    });
                }
            });
        });
    }
    async getAccounts() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM linkedin_accounts ORDER BY createdAt DESC", [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows || []);
                }
            });
        });
    }
    async addAccount(body) {
        const { name, login_id, password, auth_method, access_token, member_urn } = body;
        const crypto = require('crypto');
        const id = crypto.randomUUID();
        const query = `
      INSERT INTO linkedin_accounts (id, user_id, name, login_id, password, auth_method, access_token, member_urn, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
        return new Promise((resolve, reject) => {
            this.db.run(query, [
                id,
                'default_user',
                name || 'LinkedIn Account',
                login_id || '',
                password || '',
                auth_method || 'password_passkey',
                access_token || '',
                member_urn || '',
                0
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ id, success: true });
                }
            });
        });
    }
    async deleteAccount(id) {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM linkedin_accounts WHERE id = ?", [id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ success: true });
                }
            });
        });
    }
    async setActiveAccount(id) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("UPDATE linkedin_accounts SET is_active = 0", [], (err) => {
                    if (err)
                        return reject(err);
                    this.db.run("UPDATE linkedin_accounts SET is_active = 1 WHERE id = ?", [id], (err2) => {
                        if (err2)
                            return reject(err2);
                        resolve({ success: true });
                    });
                });
            });
        });
    }
};
exports.LinkedinService = LinkedinService;
exports.LinkedinService = LinkedinService = LinkedinService_1 = __decorate([
    (0, common_1.Injectable)()
], LinkedinService);
//# sourceMappingURL=linkedin.service.js.map