"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
let QueueService = class QueueService {
    constructor() {
        this.mockOrganizations = [
            { id: 'org-123', name: 'Innovate Agency', phoneNumber: '+919074224287' }
        ];
        this.mockQueueItems = [
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
    }
    async findOrganizationByPhoneNumber(phone) {
        return this.mockOrganizations.find(org => org.phoneNumber === phone) || null;
    }
    async getLatestPendingQueueItem(organizationId) {
        return this.mockQueueItems.find(item => item.organization_id === organizationId && item.status === 'pending_approval') || null;
    }
    async getLatestRejectedQueueItem(organizationId) {
        return this.mockQueueItems.find(item => item.organization_id === organizationId && item.status === 'rejected') || null;
    }
    async updateQueueStatus(queueId, status, options) {
        const item = this.mockQueueItems.find(i => i.id === queueId);
        if (!item) {
            throw new common_1.NotFoundException(`Queue item ${queueId} not found.`);
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
    async appendRejectionFeedback(queueId, feedback) {
        const item = this.mockQueueItems.find(i => i.id === queueId);
        if (item) {
            item.rejectionFeedback = item.rejectionFeedback
                ? `${item.rejectionFeedback} | ${feedback}`
                : feedback;
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)()
], QueueService);
//# sourceMappingURL=queue.service.js.map