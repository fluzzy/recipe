/**
 * YouTube API 관련 타입 정의
 */

export interface PlaylistItem {
  contentDetails: {
    videoId: string;
  };
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  url: string;
}

export interface VideoDetailsWithComments extends VideoDetails {
  pinnedComment?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorChannelId?: string;
  publishedAt: string;
  likeCount: number;
}
