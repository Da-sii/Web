import { cn } from "@/lib/utils";

interface PlaceholderProps {
  className?: string;
  label?: string;
}

export function Placeholder({ className, label }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center bg-gray-200 text-xs text-gray-500",
        className,
      )}
    >
      {label}
    </div>
  );
}
