/**
 * YouTube 동영상 관련 함수
 */
import { YOUTUBE_API_BASE } from './config';
import type { VideoDetails, VideoDetailsWithComments } from './types';

/**
 * 동영상 ID로부터 channelId를 가져옵니다
 */
export async function getChannelIdFromVideo(
  videoId: string,
  apiKey: string,
): Promise<string> {
  const params = new URLSearchParams({
    part: 'snippet',
    id: videoId,
    key: apiKey,
  });

  const response = await fetch(
    `${YOUTUBE_API_BASE}/videos?${params.toString()}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `YouTube API 오류: ${response.status} - ${JSON.stringify(error)}`,
    );
  }

  const data = await response.json();
  const video = data.items?.[0];

  if (!video) {
    throw new Error('동영상을 찾을 수 없습니다.');
  }

  return video.snippet.channelId;
}

/**
 * 동영상 ID 목록으로부터 상세 정보(본문 포함)를 가져옵니다
 */
export async function getVideoDetails(
  videoIds: string[],
  apiKey: string,
): Promise<VideoDetails[]> {
  const results: VideoDetails[] = [];

  // YouTube API는 한 번에 최대 50개의 동영상 ID를 받을 수 있습니다
  const batchSize = 50;

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);

    const params = new URLSearchParams({
      part: 'snippet',
      id: batch.join(','),
      key: apiKey,
    });

    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?${params.toString()}`,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        `YouTube API 오류: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = await response.json();
    const items = data.items || [];

    for (const item of items) {
      results.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      });
    }

    // API 할당량을 고려한 딜레이
    if (i + batchSize < videoIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * 동영상의 고정 댓글을 가져옵니다
 * 고정 댓글은 일반적으로 채널 소유자가 작성한 댓글이거나 상단에 위치한 댓글입니다
 */
export async function getPinnedComment(
  videoId: string,
  channelId: string,
  apiKey: string,
): Promise<string | undefined> {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      videoId: videoId,
      order: 'relevance', // 관련성 순으로 정렬 (고정 댓글이 상단에 올 가능성)
      maxResults: '10', // 상위 10개만 확인
      key: apiKey,
    });

    const response = await fetch(
      `${YOUTUBE_API_BASE}/commentThreads?${params.toString()}`,
    );

    if (!response.ok) {
      // 댓글이 비활성화되었거나 오류가 발생한 경우 무시
      return undefined;
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      return undefined;
    }

    // 채널 소유자가 작성한 댓글을 우선적으로 찾음
    for (const item of items) {
      const comment = item.snippet.topLevelComment.snippet;
      const authorChannelId =
        comment.authorChannelId?.value || comment.authorChannelId;

      // 채널 소유자가 작성한 댓글인 경우
      if (authorChannelId === channelId) {
        return comment.textDisplay;
      }
    }

    // 채널 소유자 댓글이 없으면 첫 번째 댓글을 고정 댓글로 간주
    const firstComment = items[0].snippet.topLevelComment.snippet;
    return firstComment.textDisplay;
  } catch {
    // 오류 발생 시 무시하고 undefined 반환
    return undefined;
  }
}

/**
 * 동영상 ID 목록으로부터 상세 정보(본문 + 고정댓글 포함)를 가져옵니다
 */
export async function getVideoDetailsWithComments(
  videoIds: string[],
  channelId: string,
  apiKey: string,
): Promise<VideoDetailsWithComments[]> {
  const results: VideoDetailsWithComments[] = [];

  // YouTube API는 한 번에 최대 50개의 동영상 ID를 받을 수 있습니다
  const batchSize = 50;

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);

    const params = new URLSearchParams({
      part: 'snippet',
      id: batch.join(','),
      key: apiKey,
    });

    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?${params.toString()}`,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        `YouTube API 오류: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = await response.json();
    const items = data.items || [];

    // 각 동영상에 대해 댓글도 가져오기
    for (const item of items) {
      const videoId = item.id;
      const pinnedComment = await getPinnedComment(videoId, channelId, apiKey);

      results.push({
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        pinnedComment: pinnedComment,
      });

      // API 할당량을 고려한 딜레이 (댓글 API 호출이 추가되므로)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // API 할당량을 고려한 딜레이
    if (i + batchSize < videoIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}
