/**
 * YouTube 채널 관련 함수
 */
import { YOUTUBE_API_BASE } from './config';
import type { PlaylistItem } from './types';

/**
 * 채널 정보를 가져옵니다
 */
export async function getChannelInfo(
  channelId: string,
  apiKey: string,
): Promise<{ title: string; uploadsPlaylistId: string }> {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: channelId,
    key: apiKey,
  });

  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?${params.toString()}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `YouTube API 오류: ${response.status} - ${JSON.stringify(error)}`,
    );
  }

  const data = await response.json();
  const channel = data.items?.[0];

  if (!channel) {
    throw new Error('채널을 찾을 수 없습니다.');
  }

  return {
    title: channel.snippet.title,
    uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
  };
}

/**
 * 채널의 업로드 재생목록 ID를 가져옵니다
 */
export async function getUploadsPlaylistId(
  channelId: string,
  apiKey: string,
): Promise<string> {
  const { uploadsPlaylistId } = await getChannelInfo(channelId, apiKey);
  return uploadsPlaylistId;
}

/**
 * 재생목록의 모든 동영상 ID를 가져옵니다 (페이지네이션 처리)
 * 이 방법은 search.list의 500개 제한을 우회하여 모든 동영상을 가져올 수 있습니다
 */
export async function getAllVideoIdsFromPlaylist(
  playlistId: string,
  apiKey: string,
): Promise<string[]> {
  const videoIds: string[] = [];
  let nextPageToken: string | undefined = undefined;
  let pageCount = 0;

  do {
    pageCount++;
    const params = new URLSearchParams({
      part: 'contentDetails',
      playlistId: playlistId,
      maxResults: '50', // 최대 50개씩 가져오기
      key: apiKey,
    });

    if (nextPageToken) {
      params.append('pageToken', nextPageToken);
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?${params.toString()}`,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        `YouTube API 오류: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = await response.json();
    const items: PlaylistItem[] = data.items || [];
    const currentPageCount = items.length;

    videoIds.push(...items.map((item) => item.contentDetails.videoId));

    console.log(
      `  📄 페이지 ${pageCount}: ${currentPageCount}개 동영상 발견 (누적: ${videoIds.length}개)`,
    );

    nextPageToken = data.nextPageToken;

    // API 할당량을 고려한 딜레이 (초당 요청 제한 방지)
    if (nextPageToken) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } while (nextPageToken);

  return videoIds;
}

/**
 * 채널의 모든 동영상 ID를 가져옵니다 (업로드 재생목록 사용)
 */
export async function getAllVideoIds(
  channelId: string,
  apiKey: string,
): Promise<string[]> {
  console.log('  🔍 채널의 업로드 재생목록 ID를 가져오는 중...');
  const uploadsPlaylistId = await getUploadsPlaylistId(channelId, apiKey);
  console.log(`  ✅ 업로드 재생목록 ID: ${uploadsPlaylistId}\n`);

  console.log('  🔍 재생목록에서 모든 동영상 ID를 가져오는 중...');
  const videoIds = await getAllVideoIdsFromPlaylist(uploadsPlaylistId, apiKey);

  return videoIds;
}
