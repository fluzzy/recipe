'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '~/constants/adsense';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type GoogleAdBannerProps = {
  /** 광고 슬롯 ID (AdSense에서 생성) */
  slot: string;
  /** 광고 형식 */
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  /** 전체 너비 반응형 여부 */
  fullWidthResponsive?: boolean;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * Google AdSense 광고 배너 컴포넌트
 *
 * @example
 * // 자동 크기 조절 광고
 * <GoogleAdBanner slot="1234567890" />
 *
 * // 사이드바용 세로 광고
 * <GoogleAdBanner slot="1234567890" format="vertical" style={{ width: 160, height: 600 }} />
 */
export function GoogleAdBanner({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  style,
  className,
}: GoogleAdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (!adRef.current || isAdPushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isAdPushed.current = true;
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
