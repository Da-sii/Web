// GA 상폼 상세 조회 이벤트

'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Props {
  productId: number;
  productName: string;
}

export function ProductViewTracker({
  productId,
  productName,
}: Props) {
  const trackedId = useRef<number | null>(null);

  useEffect(() => {
    if (trackedId.current === productId) return;

    trackEvent('view_item', {
      items: [
        {
          item_id: String(productId),
          item_name: productName,
        },
      ],
    });

    trackedId.current = productId;
  }, [productId, productName]);

  return null;
}