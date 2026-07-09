import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LinkedinService {
  private readonly logger = new Logger(LinkedinService.name);

  /**
   * Publishes content to the LinkedIn API (supports URN projection for Profiles and Company Pages)
   */
  async publishShare(
    accessToken: string,
    authorUrn: string, // e.g. 'urn:li:person:12345' or 'urn:li:organization:67890'
    text: string,
    mediaUrl?: string,
  ): Promise<{ shareUrn: string }> {
    this.logger.log(`Publishing share to LinkedIn for author ${authorUrn}`);

    // Sandbox Mock/Production HTTP Request template
    // Endpoint: POST https://api.linkedin.com/v2/ugcPosts
    // Headers: Authorization: Bearer ${accessToken}
    // Body:
    // {
    //   "author": authorUrn,
    //   "lifecycleState": "PUBLISHED",
    //   "specificContent": {
    //     "com.linkedin.ugc.ShareContent": {
    //       "shareCommentary": { "text": text },
    //       "shareMediaCategory": mediaUrl ? "IMAGE" : "NONE",
    //       "media": mediaUrl ? [{ "status": "READY", "originalUrl": mediaUrl }] : []
    //     }
    //   },
    //   "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    // }

    const mockPostId = Math.random().toString(36).substring(7);
    return {
      shareUrn: `urn:li:share:${mockPostId}`,
    };
  }

  async getProfileDetails(accessToken: string) {
    // GET https://api.linkedin.com/v2/me
    return {
      id: 'person-abc',
      localizedFirstName: 'Jane',
      localizedLastName: 'Doe',
      profilePicture: 'https://media.licdn.com/dms/image/mock-avatar.jpg',
    };
  }
}
