import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password?: string;
        fullName?: string;
        phoneNumber?: string;
    }): Promise<any>;
    login(body: {
        email?: string;
        password?: string;
    }): Promise<any>;
    sendOtp(body: {
        phoneNumber: string;
    }): Promise<any>;
    verifyOtp(body: {
        phoneNumber: string;
        code: string;
    }): Promise<any>;
    getProfile(req: any): Promise<{
        statusCode: HttpStatus;
        user: import("./auth.service").User;
    }>;
    logout(): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    resetPassword(body: {
        email: string;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    exportCsv(res: Response): Promise<Response<any, Record<string, any>>>;
    downloadDatabase(res: Response): void;
}
