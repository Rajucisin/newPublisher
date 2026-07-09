"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async generateBlogAndLinkedInPost(params) {
        return {
            title: `The Future of ${params.category}: Navigating Opportunities in 2026`,
            bodyContent: `As we look ahead, the landscape of ${params.category} is undergoing rapid transformation. Leveraging advanced paradigms offers organizations a distinct competitive edge...`,
            linkedinPostContent: `Are you ready for the next wave of innovation in #${params.category}? 🚀\n\nHere is how teams are scaling workflows and capturing value. Read the full insights below!`,
            hashtags: [params.category.replace(/\s+/g, ''), 'SaaS', 'AI', 'Innovation'],
            summary: `A forward-looking analysis of modern trends and operational frameworks inside the ${params.category} sector.`,
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        };
    }
    async rewriteWithAI(text, action) {
        switch (action) {
            case 'shorten':
                return `${text.substring(0, Math.min(text.length, 100))}...`;
            case 'expand':
                return `${text} This represents a critical pivot point that leading companies are integrating into their standard operating procedures.`;
            case 'add_emojis':
                return `💡 ${text} ✨ 🚀`;
            case 'rewrite':
            default:
                return `Refined Draft: ${text}`;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map