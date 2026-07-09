import { Response } from 'express';
import { WhatsappService, Contact } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    handleIncomingWebhook(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getContacts(): Promise<Contact[]>;
    syncContacts(body: {
        phoneNumber: string;
    }): Promise<{
        message: string;
        syncedCount: number;
    }>;
    broadcast(body: {
        message: string;
    }): Promise<{
        message: string;
        details: {
            total: number;
            sent: number;
            failed: number;
        };
    }>;
}
