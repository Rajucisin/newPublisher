export declare class LinkedinService {
    private readonly logger;
    publishShare(accessToken: string, authorUrn: string, text: string, mediaUrl?: string): Promise<{
        shareUrn: string;
    }>;
    getProfileDetails(accessToken: string): Promise<{
        id: string;
        localizedFirstName: string;
        localizedLastName: string;
        profilePicture: string;
    }>;
}
