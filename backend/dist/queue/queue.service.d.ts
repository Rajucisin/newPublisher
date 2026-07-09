export declare class QueueService {
    private mockOrganizations;
    private mockQueueItems;
    findOrganizationByPhoneNumber(phone: string): Promise<{
        id: string;
        name: string;
        phoneNumber: string;
    }>;
    getLatestPendingQueueItem(organizationId: string): Promise<{
        id: string;
        post_id: string;
        organization_id: string;
        title: string;
        status: string;
        rejectionFeedback: string;
        scheduledTime: any;
    }>;
    getLatestRejectedQueueItem(organizationId: string): Promise<{
        id: string;
        post_id: string;
        organization_id: string;
        title: string;
        status: string;
        rejectionFeedback: string;
        scheduledTime: any;
    }>;
    updateQueueStatus(queueId: string, status: string, options?: {
        scheduledTime?: Date;
        rejectionFeedback?: string;
    }): Promise<{
        id: string;
        post_id: string;
        organization_id: string;
        title: string;
        status: string;
        rejectionFeedback: string;
        scheduledTime: any;
    }>;
    appendRejectionFeedback(queueId: string, feedback: string): Promise<void>;
}
