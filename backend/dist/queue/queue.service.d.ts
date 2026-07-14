import { OnModuleInit } from '@nestjs/common';
import { LinkedinService } from '../linkedin/linkedin.service';
import { AiService } from '../ai/ai.service';
export interface QueueItem {
    id: string;
    post_id: string;
    user_id: string;
    status: string;
    whatsapp_notification_sent: number;
    scheduledTime?: string;
    publishedAt?: string;
    rejectionFeedback?: string;
    title: string;
    linkedin_post_content: string;
    createdAt: string;
}
export declare class QueueService implements OnModuleInit {
    private readonly linkedinService;
    private readonly aiService;
    private db;
    private readonly dbPath;
    constructor(linkedinService: LinkedinService, aiService: AiService);
    onModuleInit(): void;
    private verifySchema;
    private processScheduledPublishing;
    private sendTwilioSms;
    findOrganizationByPhoneNumber(phone: string): Promise<any | null>;
    getLatestPendingQueueItem(userId: string): Promise<QueueItem | null>;
    getLatestRejectedQueueItem(userId: string): Promise<QueueItem | null>;
    updateQueueStatus(queueId: string, status: string, options?: {
        scheduledTime?: Date;
        rejectionFeedback?: string;
    }): Promise<any>;
    appendRejectionFeedback(queueId: string, feedback: string): Promise<void>;
    private checkDailyPostGeneration;
    generateDailyPostDraft(userId: string): Promise<void>;
}
