import { Card, CardContent } from '~/components/ui/card';

interface YouTubeEmbedProps {
  url: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // https://www.youtube.com/watch?v=VIDEO_ID 형식
    if (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com'
    ) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // https://youtu.be/VIDEO_ID 형식
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // '/' 제거
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
          <iframe
            src={embedUrl}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            className='absolute inset-0 h-full w-full'
          />
        </div>
      </CardContent>
    </Card>
  );
}
