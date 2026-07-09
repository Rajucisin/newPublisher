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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./auth.guard");
const path = require("path");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        if (!body.email || !body.password || !body.fullName) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please provide all required fields: email, password, and fullName.',
            };
        }
        return this.authService.register(body.email, body.password, body.fullName, body.phoneNumber);
    }
    async login(body) {
        if (!body.email || !body.password) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please provide both email and password.',
            };
        }
        return this.authService.login(body.email, body.password);
    }
    async sendOtp(body) {
        if (!body.phoneNumber) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please provide a registered phone number.',
            };
        }
        return this.authService.sendOtp(body.phoneNumber);
    }
    async verifyOtp(body) {
        if (!body.phoneNumber || !body.code) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please provide both your phone number and the 6-digit verification code.',
            };
        }
        return this.authService.verifyOtp(body.phoneNumber, body.code);
    }
    async getProfile(req) {
        const userPayload = req.user;
        const profile = await this.authService.findUserById(userPayload.sub);
        return {
            statusCode: common_1.HttpStatus.OK,
            user: profile,
        };
    }
    async logout() {
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Logged out successfully. Clear your token client-side.',
        };
    }
    async resetPassword(body) {
        if (!body.email) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please provide your email address.',
            };
        }
        console.log(`[Auth Service] Simulating password reset email request for: ${body.email}`);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: `If the email exists, a password reset link has been dispatched to ${body.email}.`,
        };
    }
    async exportCsv(res) {
        try {
            const csvData = await this.authService.exportUsersToCSV();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
            return res.status(common_1.HttpStatus.OK).send(csvData);
        }
        catch (e) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to generate CSV export.',
                error: e.message,
            });
        }
    }
    downloadDatabase(res) {
        const dbPath = path.resolve(process.cwd(), '../database.sqlite');
        return res.sendFile(dbPath);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('otp/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('otp/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('export-csv'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('database-download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "downloadDatabase", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map