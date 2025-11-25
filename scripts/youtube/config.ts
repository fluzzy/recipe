/**
 * YouTube API 설정
 */
import { loadEnvConfig } from '@next/env';

// 환경 변수 로드
loadEnvConfig(process.cwd());

const apiKey = process.env.YOUTUBE_API_KEY || process.env.YOUTUBE;

if (!apiKey) {
  throw new Error(
    'YOUTUBE_API_KEY 또는 YOUTUBE 환경 변수가 설정되지 않았습니다.',
  );
}

export const YOUTUBE_API_KEY = apiKey;
export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
