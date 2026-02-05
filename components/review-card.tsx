"use client"

import { ThumbsUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/mock-data"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-bold text-primary">{review.rating}</span>
        </div>
      </div>
      
      <h4 className="mt-3 font-medium text-foreground">{review.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
      
      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <ThumbsUp className="mr-1.5 h-4 w-4" />
          Helpful ({review.helpful.toLocaleString()})
        </Button>
      </div>
    </div>
  )
}
