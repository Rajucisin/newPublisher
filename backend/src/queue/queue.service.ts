import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class QueueService {
  private mockOrganizations = [
    { id: 'org-123', name: 'Innovate Agency', phoneNumber: '+919074224287' }
  ];

  private mockQueueItems = [
    {
      id: 'queue-abc',
      post_id: 'post-987',
      organization_id: 'org-123',
      title: 'Leveraging Generative AI in Enterprise SaaS',
      status: 'pending_approval',
      rejectionFeedback: '',
      scheduledTime: null,
    }
  ];

  async findOrganizationByPhoneNumber(phone: string) {
    return this.mockOrganizations.find(org => org.phoneNumber === phone) || null;
  }

  async getLatestPendingQueueItem(organizationId: string) {
    return this.mockQueueItems.find(
      item => item.organization_id === organizationId && item.status === 'pending_approval'
    ) || null;
  }

  async getLatestRejectedQueueItem(organizationId: string) {
    return this.mockQueueItems.find(
      item => item.organization_id === organizationId && item.status === 'rejected'
    ) || null;
  }

  async updateQueueStatus(queueId: string, status: string, options?: { scheduledTime?: Date; rejectionFeedback?: string }) {
    const item = this.mockQueueItems.find(i => i.id === queueId);
    if (!item) {
      throw new NotFoundException(`Queue item ${queueId} not found.`);
    }

    item.status = status;
    if (options?.scheduledTime) {
      item.scheduledTime = options.scheduledTime;
    }
    if (options?.rejectionFeedback) {
      item.rejectionFeedback = options.rejectionFeedback;
    }

    return item;
  }

  async appendRejectionFeedback(queueId: string, feedback: string) {
    const item = this.mockQueueItems.find(i => i.id === queueId);
    if (item) {
      item.rejectionFeedback = item.rejectionFeedback 
        ? `${item.rejectionFeedback} | ${feedback}`
        : feedback;
    }
  }
}
