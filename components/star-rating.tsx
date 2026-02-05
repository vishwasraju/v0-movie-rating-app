"use client"

import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating?: number
  maxRating?: number
  onRate?: (rating: number) => void
  interactive?: boolean
  size?: "sm" | "md" | "lg"
  showValue?: boolean
}

export function StarRating({
  rating = 0,
  maxRating = 10,
  onRate,
  interactive = false,
  size = "md",
  showValue = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const displayRating = hoverRating ?? rating

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(value)}
            onMouseEnter={() => interactive && setHoverRating(value)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                value <= displayRating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {displayRating > 0 ? displayRating : "-"}/{maxRating}
        </span>
      )}
    </div>
  )
}
