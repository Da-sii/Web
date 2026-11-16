//GA 앱스토어 클릭 이벤트

'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Props {
  href: string;
  platform: 'ios' | 'android';
  children: ReactNode;
}

export function TrackedStoreLink({
  href,
  platform,
  children,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent('click_app_store', { platform })
      }
    >
      {children}
    </a>
  );
}