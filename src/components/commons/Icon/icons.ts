import IC_ArrowLeft from '@/assets/icons/ic_arrow_left.svg';
import IC_ArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IC_Category from '@/assets/icons/ic_category.svg';
import IC_Home from '@/assets/icons/ic_home.svg';
import IC_Mypage from '@/assets/icons/ic_mypage.svg';
import IC_Search from '@/assets/icons/ic_search.svg';
import IC_Share from '@/assets/icons/ic_share.svg';
import IC_ArrowBottom from '@/assets/icons/ic_arrow_bottom.svg';

export const IconMap = {
  IC_ArrowLeft,
  IC_ArrowRight,
  IC_Category,
  IC_Home,
  IC_Mypage,
  IC_Search,
  IC_Share,
  IC_ArrowBottom,
} as const;

export type IconMapTypes = keyof typeof IconMap;

export const IconSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

export type IconSizeTypes = keyof typeof IconSizes;

export const buttonSizeMap = {
  sm: 'sm',
  md: 'lg',
  lg: 'xl',
} as const;
