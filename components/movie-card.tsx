"use client"

import React from "react"

import Link from "next/link"
import { Star, Bookmark, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { Movie } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: Movie
  showRank?: number
  size?: "sm" | "md" | "lg"
}

export function MovieCard({ movie, showRank, size = "md" }: MovieCardProps) {
  const { user, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites } = useAuth()
  
  const isInWatchlist = user?.watchlist.includes(movie.id)
  const isInFavorites = user?.favorites.includes(movie.id)

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (isInWatchlist) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie.id)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (isInFavorites) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movie.id)
    }
  }

  const sizeClasses = {
    sm: "w-32",
    md: "w-40",
    lg: "w-48"
  }

  const posterHeights = {
    sm: "h-48",
    md: "h-60",
    lg: "h-72"
  }

  return (
    <Link href={`/movie/${movie.id}`} className={cn("group flex flex-col", sizeClasses[size])}>
      <div className={cn("relative overflow-hidden rounded-lg bg-secondary", posterHeights[size])}>
        {/* Rank Badge */}
        {showRank && (
          <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
            {showRank}
          </div>
        )}

        {/* Action Buttons */}
        {user && (
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={handleWatchlistClick}
            >
              <Bookmark className={cn("h-4 w-4", isInWatchlist && "fill-current text-primary")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-4 w-4", isInFavorites && "fill-current text-red-500")} />
            </Button>
          </div>
        )}

        {/* Poster Image */}
        <img
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Movie Info */}
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {movie.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}
