export declare class AiService {
    generateBlogAndLinkedInPost(params: {
        category: string;
        sourceType: string;
        sourceUrl?: string;
        tone: string;
        length: string;
    }): Promise<{
        title: string;
        bodyContent: string;
        linkedinPostContent: string;
        hashtags: string[];
        summary: string;
        imageUrl: string;
    }>;
    rewriteWithAI(text: string, action: 'rewrite' | 'shorten' | 'expand' | 'add_emojis'): Promise<string>;
}
