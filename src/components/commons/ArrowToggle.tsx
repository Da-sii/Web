'use client';

import { useState, type ReactNode } from 'react';

import Icon from '@/components/commons/Icon/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ArrowToggleVariant = 'bordered' | 'gray';

interface ArrowToggleProps {
  label: string;
  children: ReactNode;
  variant?: ArrowToggleVariant;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
}

const contentVariantClass: Record<ArrowToggleVariant, string> = {
  bordered: 'border border-gray-200 bg-white',
  gray: 'bg-gray-100',
};

export function ArrowToggle({
  label,
  children,
  variant = 'bordered',
  defaultOpen = false,
  className,
  contentClassName,
}: ArrowToggleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="self-start px-0 text-gray-500"
      >
        <span>{label}</span>
        <Icon
          icon="IC_ArrowBottom"
          size="xs"
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </Button>
      {open && (
        <div
          className={cn(
            'rounded-[12px] p-4',
            contentVariantClass[variant],
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
