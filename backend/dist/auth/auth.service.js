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
const jwt_1 = require("@nestjs/jwt");
const sqlite3 = require("sqlite3");
const path = require("path");
const crypto = require("crypto");
const https = require("https");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.dbPath = path.resolve(process.cwd(), '../database.sqlite');
        this.activeOtps = new Map();
    }
    onModuleInit() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Failed to connect to SQLite database:', err.message);
            }
            else {
                console.log('[SQLite Database] Connected successfully at:', this.dbPath);
                this.createTables();
            }
        });
    }
    createTables() {
        const userTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        fullName TEXT NOT NULL,
        phoneNumber TEXT,
        role TEXT NOT NULL DEFAULT 'end_user',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;
        const blogPostsQuery = `
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        linkedin_post_content TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;
        const queueQuery = `
      CREATE TABLE IF NOT EXISTS publishing_queue (
        id TEXT PRIMARY KEY,
        post_id TEXT REFERENCES blog_posts(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending_approval',
        whatsapp_notification_sent INTEGER DEFAULT 0,
        scheduledTime TEXT,
        publishedAt TEXT,
        rejectionFeedback TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;
        this.db.run(userTableQuery, (err) => {
            if (err) {
                console.error('Failed to create users table:', err.message);
            }
            else {
                console.log('[SQLite Database] Users schema verified.');
                this.db.run(blogPostsQuery, (err) => {
                    if (err)
                        console.error('Failed to create blog_posts table:', err.message);
                });
                this.db.run(queueQuery, (err) => {
                    if (err)
                        console.error('Failed to create publishing_queue table:', err.message);
                });
                this.seedDefaultAdmin();
            }
        });
    }
    seedDefaultAdmin() {
        const adminEmail = 'admin@autopilot-ai.com';
        this.findUserByEmail(adminEmail).then((user) => {
            if (!user) {
                const hashedPassword = this.hashPassword('admin1234');
                const insertQuery = `
          INSERT INTO users (id, email, password_hash, fullName, phoneNumber, role)
          VALUES (?, ?, ?, ?, ?, ?);
        `;
                this.db.run(insertQuery, [
                    crypto.randomUUID(),
                    adminEmail,
                    hashedPassword,
                    'Super Admin',
                    '+919893854811',
                    'super_admin'
                ], (err) => {
                    if (err) {
                        console.error('Failed to seed default admin user:', err.message);
                    }
                    else {
                        console.log('[SQLite Database] Seeded default Admin user (admin@autopilot-ai.com / admin1234).');
                    }
                });
            }
        });
    }
    findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const selectQuery = `SELECT * FROM users WHERE email = ? LIMIT 1;`;
            this.db.get(selectQuery, [email.toLowerCase().trim()], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    findUserByPhoneNumber(phoneNumber) {
        let cleanPhone = phoneNumber.replace(/\s+/g, '');
        if (!cleanPhone.startsWith('+')) {
            if (cleanPhone.length === 10) {
                cleanPhone = '+91' + cleanPhone;
            }
            else {
                cleanPhone = '+' + cleanPhone;
            }
        }
        return new Promise((resolve, reject) => {
            const selectQuery = `SELECT * FROM users WHERE phoneNumber = ? LIMIT 1;`;
            this.db.get(selectQuery, [cleanPhone], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    findUserById(id) {
        return new Promise((resolve, reject) => {
            const selectQuery = `SELECT id, email, fullName, phoneNumber, role, createdAt FROM users WHERE id = ? LIMIT 1;`;
            this.db.get(selectQuery, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row || null);
                }
            });
        });
    }
    findAllUsers() {
        return new Promise((resolve, reject) => {
            const selectQuery = `SELECT id, email, fullName, phoneNumber, role, createdAt FROM users ORDER BY createdAt DESC;`;
            this.db.all(selectQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows || []);
                }
            });
        });
    }
    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }
    verifyPassword(password, storedHash) {
        try {
            const [salt, hash] = storedHash.split(':');
            if (!salt || !hash)
                return false;
            const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            return hash === verifyHash;
        }
        catch {
            return false;
        }
    }
    async register(email, password, fullName, phoneNumber) {
        const existing = await this.findUserByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('A user with this email address already exists.');
        }
        if (phoneNumber) {
            const existingPhone = await this.findUserByPhoneNumber(phoneNumber);
            if (existingPhone) {
                throw new common_1.ConflictException('A user with this phone number already exists.');
            }
        }
        let cleanPhone = phoneNumber ? phoneNumber.replace(/\s+/g, '') : null;
        if (cleanPhone && !cleanPhone.startsWith('+')) {
            if (cleanPhone.length === 10) {
                cleanPhone = '+91' + cleanPhone;
            }
            else {
                cleanPhone = '+' + cleanPhone;
            }
        }
        const userId = crypto.randomUUID();
        const hashedPassword = this.hashPassword(password);
        const role = 'end_user';
        const insertQuery = `
      INSERT INTO users (id, email, password_hash, fullName, phoneNumber, role)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
        return new Promise((resolve, reject) => {
            this.db.run(insertQuery, [
                userId,
                email.toLowerCase().trim(),
                hashedPassword,
                fullName.trim(),
                cleanPhone,
                role
            ], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    const postId = crypto.randomUUID();
                    const queueId = crypto.randomUUID();
                    const title = 'Leveraging Generative AI in Enterprise SaaS';
                    const postContent = `🚀 Telemetry loops and agentic AI represent the future of SaaS scaling! By utilizing autonomous draft validation pipelines, modern companies reduce deployment overhead from weeks to minutes.\n\nRead more on our engineering blog: http://autopilot-ai.com/scaling-pipelines #SaaS #AI #Scaling`;
                    this.db.run('INSERT INTO blog_posts (id, user_id, title, linkedin_post_content) VALUES (?, ?, ?, ?);', [postId, userId, title, postContent]);
                    this.db.run('INSERT INTO publishing_queue (id, post_id, user_id, status, whatsapp_notification_sent) VALUES (?, ?, ?, ?, 0);', [queueId, postId, userId, 'pending_approval']);
                    resolve({
                        id: userId,
                        email,
                        fullName,
                        phoneNumber,
                        role,
                        message: 'User registered successfully!'
                    });
                }
            });
        });
    }
    async login(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid login credentials.');
        }
        const isMatch = this.verifyPassword(password, user.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid login credentials.');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                createdAt: user.createdAt
            }
        };
    }
    sendTwilioSms(to, body) {
        return new Promise((resolve, reject) => {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
            if (!sid || !token || sid.startsWith('your_') || token.startsWith('your_')) {
                console.log('[Auth Service] Twilio credentials are not configured inside the .env file. Outbound WhatsApp message bypassed.');
                return resolve(null);
            }
            const cleanTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
            const cleanFrom = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;
            const postData = new URLSearchParams({
                To: cleanTo,
                From: cleanFrom,
                Body: body
            }).toString();
            const authHeaderValue = Buffer.from(`${sid}:${token}`).toString('base64');
            const options = {
                hostname: 'api.twilio.com',
                path: `/2010-04-01/Accounts/${sid}/Messages.json`,
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authHeaderValue}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(responseBody));
                    }
                    else {
                        reject(new Error(`Twilio API status ${res.statusCode}: ${responseBody}`));
                    }
                });
            });
            req.on('error', (e) => {
                reject(e);
            });
            req.write(postData);
            req.end();
        });
    }
    async sendOtp(phoneNumber) {
        let cleanPhone = phoneNumber.replace(/\s+/g, '');
        if (!cleanPhone.startsWith('+')) {
            if (cleanPhone.length === 10) {
                cleanPhone = '+91' + cleanPhone;
            }
            else {
                cleanPhone = '+' + cleanPhone;
            }
        }
        let user = await this.findUserByPhoneNumber(cleanPhone);
        if (!user) {
            const crypto = require('crypto');
            const userId = crypto.randomUUID();
            const email = `otp_${cleanPhone.substring(1)}@autopilot-ai.com`;
            const fullName = 'OTP Sandbox User';
            const hashedPassword = this.hashPassword('otp_bypass_password');
            const role = 'end_user';
            const insertQuery = `
        INSERT INTO users (id, email, password_hash, fullName, phoneNumber, role)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
            await new Promise((resolve, reject) => {
                this.db.run(insertQuery, [
                    userId,
                    email,
                    hashedPassword,
                    fullName,
                    cleanPhone,
                    role
                ], (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const postId = crypto.randomUUID();
                        const queueId = crypto.randomUUID();
                        const title = 'Leveraging Generative AI in Enterprise SaaS';
                        const postContent = `🚀 Telemetry loops and agentic AI represent the future of SaaS scaling! By utilizing autonomous draft validation pipelines, modern companies reduce deployment overhead from weeks to minutes.\n\nRead more on our engineering blog: http://autopilot-ai.com/scaling-pipelines #SaaS #AI #Scaling`;
                        this.db.run('INSERT INTO blog_posts (id, user_id, title, linkedin_post_content) VALUES (?, ?, ?, ?);', [postId, userId, title, postContent]);
                        this.db.run('INSERT INTO publishing_queue (id, post_id, user_id, status, whatsapp_notification_sent) VALUES (?, ?, ?, ?, 0);', [queueId, postId, userId, 'pending_approval']);
                        resolve(true);
                    }
                });
            });
            user = await this.findUserByPhoneNumber(cleanPhone);
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;
        this.activeOtps.set(cleanPhone, { code: otpCode, expiresAt });
        console.log(`\n🔑 [OTP CODE SERVICE] Generated verification code for ${cleanPhone}: "${otpCode}" (Valid for 5 minutes)\n`);
        return {
            message: 'Verification code sent successfully! (View code on your screen)',
            phoneNumber: cleanPhone,
            debugOtpCode: otpCode
        };
    }
    async verifyOtp(phoneNumber, code) {
        let cleanPhone = phoneNumber.replace(/\s+/g, '');
        if (!cleanPhone.startsWith('+')) {
            if (cleanPhone.length === 10) {
                cleanPhone = '+91' + cleanPhone;
            }
            else {
                cleanPhone = '+' + cleanPhone;
            }
        }
        const record = this.activeOtps.get(cleanPhone);
        if (!record) {
            throw new common_1.UnauthorizedException('No active OTP verification request found for this phone number.');
        }
        if (Date.now() > record.expiresAt) {
            this.activeOtps.delete(cleanPhone);
            throw new common_1.UnauthorizedException('The verification code has expired. Please request a new one.');
        }
        if (record.code !== code.trim()) {
            throw new common_1.UnauthorizedException('Invalid verification code.');
        }
        const user = await this.findUserByPhoneNumber(cleanPhone);
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication credentials expired.');
        }
        this.activeOtps.delete(cleanPhone);
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                createdAt: user.createdAt
            }
        };
    }
    async exportUsersToCSV() {
        const users = await this.findAllUsers();
        let csv = 'ID,Email,Full Name,Phone Number,Role,Created At\n';
        for (const u of users) {
            const escapedName = `"${u.fullName.replace(/"/g, '""')}"`;
            csv += `${u.id},${u.email},${escapedName},${u.phoneNumber || 'N/A'},${u.role},${u.createdAt}\n`;
        }
        return csv;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map