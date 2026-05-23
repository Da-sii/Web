import React from 'react';

import { IconMap, IconMapTypes, IconSizeTypes, IconSizes } from './icons';

export interface IconProps {
  icon: IconMapTypes;
  size?: IconSizeTypes;
  className?: string;
}

type IconModule =
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | {
      default: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    };

const Icon: React.FC<IconProps> = ({ icon, size = 'lg', className }) => {
  const iconModule = IconMap[icon] as IconModule | unknown;

  if (!iconModule) return null;

  const IconComponent =
    typeof iconModule === 'object' && iconModule !== null && 'default' in iconModule
      ? iconModule.default
      : iconModule;

  if (typeof IconComponent !== 'function') {
    console.error(`Icon ${icon} is not a valid component:`, IconComponent);
    return null;
  }

  const SVGComponent = IconComponent as React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  return (
    <SVGComponent
      width={IconSizes[size]}
      height={IconSizes[size]}
      className={className}
    />
  );
};

export default Icon;
