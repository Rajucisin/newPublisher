import { OnModuleInit } from '@nestjs/common';
export declare class LinkedinService implements OnModuleInit {
    private readonly logger;
    private db;
    private readonly dbPath;
    publishShare(accessToken: string, authorUrn: string, text: string, mediaUrl?: string): Promise<{
        shareUrn: string;
    }>;
    getProfileDetails(accessToken: string): Promise<unknown>;
    onModuleInit(): void;
    private seedDefaultAccount;
    getActiveCredentials(): Promise<{
        token: string;
        urn: string;
    }>;
    getAccounts(): Promise<any[]>;
    addAccount(body: any): Promise<any>;
    deleteAccount(id: string): Promise<any>;
    setActiveAccount(id: string): Promise<any>;
}
