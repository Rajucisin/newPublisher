import { QueueService } from '../queue/queue.service';
export interface Contact {
    name: string;
    phoneNumber: string;
}
export declare class WhatsappService {
    private readonly queueService;
    private readonly logger;
    private mockContacts;
    constructor(queueService: QueueService);
    getSyncedContacts(): Promise<Contact[]>;
    private fetchContactsFromWhapi;
    triggerContactSync(phoneNumber: string): Promise<number>;
    sendBulkBroadcast(message: string): Promise<{
        total: number;
        sent: number;
        failed: number;
    }>;
    processUserResponse(senderNumber: string, messageBody: string): Promise<string>;
}
