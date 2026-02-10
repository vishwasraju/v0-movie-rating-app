"use client"

import { use, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Calendar, Bookmark, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReviewCard } from "@/components/review-card"
import { StarRating } from "@/components/star-rating"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { getMovieById, formatRatingCount, formatRuntime } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
// import { supabase } from "@/lib/supabase" // Direct import not strictly needed if we just fetch in useEffect
import { supabase } from "@/lib/supabase"
import { ReviewFormDialog } from "@/components/review-form-dialog"

// Extended Review Interface to match Supabase structure
interface SupabaseReview {
  id: string
  movie_id: string
  user_id: string
  user_name: string
  rating: number
  title: string
  content: string
  helpful: number
  created_at: string
}

function MovieDetailPage({ id }: { id: string }) {
  const movie = getMovieById(id)
  const { user, addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, rateMovie, getUserRating } = useAuth()

  const [reviews, setReviews] = useState<SupabaseReview[]>([])
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoadingReviews(false)
    }
  }, [id])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
            <p className="mt-2 text-muted-foreground">The movie you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild className="mt-4">
              <Link href="/movies">Browse Movies</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isInWatchlist = user?.watchlist.includes(movie.id)
  const isInFavorites = user?.favorites.includes(movie.id)
  const userRating = getUserRating(movie.id)

  const handleRate = (rating: number) => {
    rateMovie(movie.id, rating)
    setShowRatingModal(false)
    fetchReviews() // Refresh to show updated rating if it adds a review entry
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Backdrop */}
        <section className="relative">
          <div className="absolute inset-0 h-[500px]">
            <img
              src={movie.backdrop || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-4">
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild className="mb-8">
              <Link href="/movies">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Movies
              </Link>
            </Button>

            <div className="flex flex-col gap-8 md:flex-row">
              {/* Poster */}
              <div className="shrink-0">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="mx-auto h-auto w-64 rounded-lg shadow-2xl md:mx-0"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">
                  {movie.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRuntime(movie.runtime)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genres/${genre.toLowerCase()}`}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Rating Display */}
                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
                      <Star className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{movie.rating}</p>
                      <p className="text-xs text-muted-foreground">{formatRatingCount(movie.ratingCount)} ratings</p>
                    </div>
                  </div>

                  {user && (
                    <div className="border-l border-border pl-6">
                      <p className="text-xs text-muted-foreground mb-1">Your rating</p>
                      {userRating ? (
                        <button
                          onClick={() => setShowRatingModal(true)}
                          className="flex items-center gap-1 text-primary hover:opacity-80"
                        >
                          <Star className="h-5 w-5 fill-primary" />
                          <span className="text-xl font-bold">{userRating}</span>
                        </button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setShowRatingModal(true)}>
                          Rate this
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {user && (
                    <>
                      <Button
                        variant={isInWatchlist ? "default" : "outline"}
                        onClick={() => isInWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie.id)}
                      >
                        <Bookmark className={cn("mr-2 h-4 w-4", isInWatchlist && "fill-current")} />
                        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </Button>
                      <Button
                        variant={isInFavorites ? "default" : "outline"}
                        onClick={() => isInFavorites ? removeFromFavorites(movie.id) : addToFavorites(movie.id)}
                      >
                        <Heart className={cn("mr-2 h-4 w-4", isInFavorites && "fill-current")} />
                        {isInFavorites ? "Favorited" : "Add to Favorites"}
                      </Button>
                    </>
                  )}
                </div>

                {/* Plot */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-foreground">Plot</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{movie.plot}</p>
                </div>

                {/* Cast & Crew */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Director</h3>
                    <p className="mt-1 text-muted-foreground">{movie.director}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Cast</h3>
                    <p className="mt-1 text-muted-foreground">{movie.cast.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">User Reviews</h2>
              {user && (
                <Button variant="outline" onClick={() => setShowReviewDialog(true)}>
                  Write a Review
                </Button>
              )}
            </div>

            {isLoadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  // Map Supabase snake_case to camelCase expected by ReviewCard
                  <ReviewCard
                    key={review.id}
                    review={{
                      id: review.id,
                      movieId: review.movie_id,
                      userId: review.user_id,
                      userName: review.user_name || 'Anonymous',
                      rating: review.rating,
                      title: review.title,
                      content: review.content,
                      helpful: review.helpful,
                      createdAt: review.created_at
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-background p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Review Dialog */}
      <ReviewFormDialog
        movie={movie}
        isOpen={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        onSuccess={fetchReviews}
      />

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">Rate this movie</h3>
            <p className="mt-1 text-sm text-muted-foreground">{movie.title}</p>
            <div className="mt-6 flex justify-center">
              <StarRating
                rating={userRating || 0}
                maxRating={10}
                interactive
                onRate={handleRate}
                size="lg"
                showValue
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowRatingModal(false)}>
                Cancel
              </Button>
              {userRating && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    rateMovie(movie.id, 0)
                    setShowRatingModal(false)
                    fetchReviews()
                  }}
                >
                  Remove Rating
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <AuthProvider>
      <MovieDetailPage id={id} />
    </AuthProvider>
  )
}
