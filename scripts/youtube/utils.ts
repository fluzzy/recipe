/**
 * YouTube URL 유틸리티 함수
 */

/**
 * YouTube URL에서 videoId를 추출합니다
 */
export function extractVideoId(url: string): string | null {
  // 다양한 YouTube URL 형식 지원
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
