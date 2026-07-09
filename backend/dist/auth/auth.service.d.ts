import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export interface User {
    id: string;
    email: string;
    password_hash: string;
    fullName: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
}
export declare class AuthService implements OnModuleInit {
    private readonly jwtService;
    private db;
    private readonly dbPath;
    private activeOtps;
    constructor(jwtService: JwtService);
    onModuleInit(): void;
    private createTables;
    private seedDefaultAdmin;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByPhoneNumber(phoneNumber: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
    private hashPassword;
    private verifyPassword;
    register(email: string, password: string, fullName: string, phoneNumber?: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
    private sendTwilioSms;
    sendOtp(phoneNumber: string): Promise<any>;
    verifyOtp(phoneNumber: string, code: string): Promise<any>;
    exportUsersToCSV(): Promise<string>;
}
