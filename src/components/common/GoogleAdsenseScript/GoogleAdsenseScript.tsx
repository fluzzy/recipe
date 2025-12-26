import Script from 'next/script';
import { ADSENSE_CLIENT_ID } from '~/constants/adsense';

/**
 * Google AdSense 스크립트를 로드하는 컴포넌트
 * layout.tsx의 <head> 또는 <body>에 한 번만 포함시키면 됩니다.
 */
export function GoogleAdsenseScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  );
}
