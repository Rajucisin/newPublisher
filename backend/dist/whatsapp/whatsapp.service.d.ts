import { OnModuleInit } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { LinkedinService } from '../linkedin/linkedin.service';
export interface Contact {
    name: string;
    phoneNumber: string;
}
export declare class WhatsappService implements OnModuleInit {
    private readonly queueService;
    private readonly linkedinService;
    private readonly logger;
    private db;
    private readonly dbPath;
    private mockContacts;
    constructor(queueService: QueueService, linkedinService: LinkedinService);
    onModuleInit(): void;
    private checkAndSendPendingDrafts;
    private sendTwilioSms;
    getSyncedContacts(): Promise<Contact[]>;
    private fetchContactsFromWhapi;
    triggerContactSync(phoneNumber: string): Promise<number>;
    sendBulkBroadcast(message: string, targetPhones?: string[]): Promise<{
        total: number;
        sent: number;
        failed: number;
    }>;
    processUserResponse(senderNumber: string, messageBody: string): Promise<string>;
}
