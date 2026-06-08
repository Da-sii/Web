import { Star } from "lucide-react";

interface ReviewStarProps {
  rating: number;
  size?: number;
}

export function ReviewStar({ rating, size = 12 }: ReviewStarProps) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= Math.round(rating)
              ? "fill-green600 text-green600"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}
