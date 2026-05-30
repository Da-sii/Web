"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { formatNumber, toMicrograms, type IngredientStatus } from "@/lib/format";

interface IngredientDonutProps {
  amount: string;
  maxRecommended: string;
  status: IngredientStatus;
}

const STATUS_GRADIENT_END: Record<IngredientStatus, string> = {
  초과: "#FF0000",
  적정: "#9DD716",
  미만: "#FFA600",
};

const STATUS_TEXT: Record<IngredientStatus, string> = {
  초과: "text-[#FF3A4A]",
  적정: "text-[#25A762]",
  미만: "text-[#FFA600]",
};

export function IngredientDonut({
  amount,
  maxRecommended,
  status,
}: IngredientDonutProps) {
  const gradientId = useId();
  const SIZE = 74;
  const RADIUS = 30;
  const CENTER = SIZE / 2;
  const STROKE_WIDTH = 11;
  const CIRC = 2 * Math.PI * RADIUS;

  const ratio =
    status === "초과"
      ? 1
      : Math.min(toMicrograms(amount) / (toMicrograms(maxRecommended) || 1), 1);
  const dashOffset = CIRC * (1 - ratio);

  return (
    <div className="relative flex h-[74px] w-[74px] items-center justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDDF02" />
            <stop offset="100%" stopColor={STATUS_GRADIENT_END[status]} />
          </linearGradient>
        </defs>
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#E4E6E7"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke={`url(#${gradientId})`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            fill="none"
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] leading-tight">
        <span className={cn("font-bold", STATUS_TEXT[status])}>
          {formatNumber(amount)}
        </span>
        <span className="my-0.5 h-px w-4 bg-gray-300" />
        <span className="text-gray-400">/{formatNumber(maxRecommended)}</span>
      </div>
    </div>
  );
}
