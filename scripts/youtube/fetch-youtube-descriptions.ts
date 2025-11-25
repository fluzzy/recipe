/**
 * YouTube 채널의 모든 동영상 본문(설명)을 가져오는 스크립트
 *
 * 사용법:
 *   yarn tsx scripts/youtube/fetch-youtube-descriptions.ts [동영상_URL_또는_채널_ID] [--with-comments]
 *
 * 예시:
 *   yarn tsx scripts/youtube/fetch-youtube-descriptions.ts https://www.youtube.com/watch?v=VIDEO_ID
 *   yarn tsx scripts/youtube/fetch-youtube-descriptions.ts UCcNUpInQt1tI3JC_oTPQ20w
 *   yarn tsx scripts/youtube/fetch-youtube-descriptions.ts UCcNUpInQt1tI3JC_oTPQ20w --with-comments
 *
 * 옵션:
 *   --with-comments: 본문과 함께 고정 댓글도 가져옵니다
 */
import { getAllVideoIds, getChannelInfo } from './channel';
import { YOUTUBE_API_KEY } from './config';
import { extractVideoId } from './utils';
import {
  getChannelIdFromVideo,
  getVideoDetails,
  getVideoDetailsWithComments,
} from './video';

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 명령줄 인자에서 URL 또는 채널 ID 가져오기
    const input = process.argv[2];
    const withComments = process.argv.includes('--with-comments');

    let channelId: string;

    if (!input) {
      console.error(
        '❌ 사용법: yarn tsx scripts/youtube/fetch-youtube-descriptions.ts [동영상_URL_또는_채널_ID] [--with-comments]',
      );
      console.error(
        '예시: yarn tsx scripts/youtube/fetch-youtube-descriptions.ts https://www.youtube.com/watch?v=VIDEO_ID',
      );
      console.error(
        '      yarn tsx scripts/youtube/fetch-youtube-descriptions.ts UCcNUpInQt1tI3JC_oTPQ20w --with-comments',
      );
      process.exit(1);
    }

    // URL인지 채널 ID인지 확인
    const videoId = extractVideoId(input);

    if (videoId) {
      // 동영상 URL인 경우, channelId를 가져옴
      console.log(`🎬 동영상 URL에서 channelId를 찾는 중...`);
      console.log(`   동영상 ID: ${videoId}\n`);
      channelId = await getChannelIdFromVideo(videoId, YOUTUBE_API_KEY);
      console.log(`✅ 채널 ID를 찾았습니다: ${channelId}\n`);
    } else {
      // 채널 ID로 간주
      channelId = input;
      console.log(`📺 채널 ID: ${channelId}`);
    }

    // 채널 정보 가져오기
    console.log('🔍 채널 정보를 가져오는 중...\n');
    const channelInfo = await getChannelInfo(channelId, YOUTUBE_API_KEY);
    console.log(`📺 채널명: ${channelInfo.title}\n`);

    console.log('🔍 동영상 목록을 가져오는 중...\n');

    // 1. 모든 동영상 ID 가져오기
    const videoIds = await getAllVideoIds(channelId, YOUTUBE_API_KEY);
    console.log(`\n✅ 총 ${videoIds.length}개의 동영상 ID를 찾았습니다.\n`);

    if (videoIds.length === 0) {
      console.log('❌ 동영상을 찾을 수 없습니다.');
      return;
    }

    if (withComments) {
      console.log('📝 동영상 본문과 고정 댓글을 가져오는 중...\n');
    } else {
      console.log('📝 동영상 본문을 가져오는 중...\n');
    }

    // 2. 각 동영상의 상세 정보 가져오기
    const videoDetails = withComments
      ? await getVideoDetailsWithComments(videoIds, channelId, YOUTUBE_API_KEY)
      : await getVideoDetails(videoIds, YOUTUBE_API_KEY);

    // 3. 결과 출력
    console.log('='.repeat(80));
    console.log(`총 ${videoDetails.length}개의 동영상 본문\n`);
    console.log('='.repeat(80));

    videoDetails.forEach((video, index) => {
      console.log(`\n[${index + 1}] ${video.title}`);
      console.log(`URL: ${video.url}`);
      console.log(
        `업로드일: ${new Date(video.publishedAt).toLocaleDateString('ko-KR')}`,
      );
      console.log(`\n본문:\n${video.description}`);

      if (withComments && 'pinnedComment' in video && video.pinnedComment) {
        console.log(`\n고정 댓글:\n${video.pinnedComment}`);
      }

      console.log('\n' + '-'.repeat(80));
    });

    // 4. JSON 파일로 저장 (채널명-채널id.json 형식)
    const fs = await import('fs/promises');
    const path = await import('path');

    // 파일명에 사용할 수 없는 문자 제거 및 대체
    const sanitizedChannelName = channelInfo.title
      .replace(/[<>:"/\\|?*]/g, '_') // 파일명에 사용할 수 없는 문자를 _로 대체
      .replace(/\s+/g, '_') // 공백을 _로 대체
      .trim();

    const fileName = `${sanitizedChannelName}-${channelId}.json`;
    const outputPath = path.join(__dirname, fileName);

    await fs.writeFile(
      outputPath,
      JSON.stringify(videoDetails, null, 2),
      'utf-8',
    );
    console.log(`\n💾 결과가 ${outputPath}에 저장되었습니다.`);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
