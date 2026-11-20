import React from 'react';

/** sm: 목록/카드용, lg: 제품 상세 상단용 */
type DaisoBadgeSize = 'sm' | 'lg';

interface Props {
  size?: DaisoBadgeSize;
  className?: string; // 웹 환경에서는 style 대신 className을 받는 것이 유연합니다.
  style?: React.CSSProperties;
}

const SIZES: Record<
  DaisoBadgeSize,
  { offset: string; container: string; text: string }
> = {
  sm: {
    offset: 'top-1.5 right-1.5',
    container: 'rounded-sm px-1 py-[2px] border-[0.5px]',
    text: 'text-[6px] leading-[10px]',
  },
  lg: {
    offset: 'top-4 right-4',
    container: 'rounded-lg py-2 px-3',
    text: 'text-base font-medium', 
  },
};

export default function DaisoBadge({ size = 'sm', className = '', style }: Props) {
  const { offset, container, text } = SIZES[size];

  return (
    <div
      className={`absolute z-10 flex items-center justify-center border border-blue-400 bg-blue-50 ${offset} ${container} ${className}`}
      style={style}
    >
      <span className={`font-bold text-blue-500 ${text}`}>다이소 판매</span>
    </div>
  );
}
