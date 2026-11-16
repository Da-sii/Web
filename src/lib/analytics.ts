// GA4 이벤트 전송 공통 유틸

import { sendGAEvent } from '@next/third-parties/google';

type AnalyticsParams = Record<string, unknown>;

export const trackEvent = (
  name: string,
  params: AnalyticsParams = {}
) => {
  if (process.env.NODE_ENV !== 'production') return;

  sendGAEvent('event', name, params);
};