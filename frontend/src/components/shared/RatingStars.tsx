import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showText?: boolean;
  count?: number;
}

export function RatingStars({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onRate,
  showText = false,
  count,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentRating;
          const isHalf = !isFilled && starValue - 0.5 <= currentRating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform p-0.5" : "cursor-default"}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? "text-amber-400 fill-amber-400"
                    : isHalf
                    ? "text-amber-400 fill-amber-200"
                    : "text-slate-200 fill-slate-100"
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-slate-400 font-normal"> ({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
