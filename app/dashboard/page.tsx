"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Star, Bookmark, Heart, Film, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { getMovieById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const activeTab = searchParams.get("tab") || "overview"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const watchlistMovies = user.watchlist.map(id => getMovieById(id)).filter(Boolean)
  const favoriteMovies = user.favorites.map(id => getMovieById(id)).filter(Boolean)
  const ratedMovies = user.ratings.map(r => ({
    movie: getMovieById(r.movieId),
    rating: r.rating
  })).filter(r => r.movie)

  const tabs = [
    { id: "overview", label: "Overview", icon: Film },
    { id: "ratings", label: "My Ratings", icon: Star, count: ratedMovies.length },
    { id: "watchlist", label: "Watchlist", icon: Bookmark, count: watchlistMovies.length },
    { id: "favorites", label: "Favorites", icon: Heart, count: favoriteMovies.length },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* User Header */}
          <div className="mb-8 flex items-center gap-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Link
                  key={tab.id}
                  href={`/dashboard?tab=${tab.id}`}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid gap-8">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{ratedMovies.length}</p>
                      <p className="text-sm text-muted-foreground">Movies Rated</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bookmark className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{watchlistMovies.length}</p>
                      <p className="text-sm text-muted-foreground">In Watchlist</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{favoriteMovies.length}</p>
                      <p className="text-sm text-muted-foreground">Favorites</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Get Started</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore movies, rate them, and build your personal collection.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/movies">
                      Browse Movies
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/top-rated">View Top Rated</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ratings" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Your Ratings</h2>
              {ratedMovies.length > 0 ? (
                <div className="grid gap-4">
                  {ratedMovies.map(({ movie, rating }) => movie && (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
                    >
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="h-20 w-14 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-lg font-bold text-primary">{rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Star}
                  title="No ratings yet"
                  description="Start rating movies to track your opinions."
                  action={{ label: "Browse Movies", href: "/movies" }}
                />
              )}
            </div>
          )}

          {activeTab === "watchlist" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Your Watchlist</h2>
              {watchlistMovies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {watchlistMovies.map((movie) => movie && (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Bookmark}
                  title="Watchlist is empty"
                  description="Add movies you want to watch later."
                  action={{ label: "Browse Movies", href: "/movies" }}
                />
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Your Favorites</h2>
              {favoriteMovies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {favoriteMovies.map((movie) => movie && (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Heart}
                  title="No favorites yet"
                  description="Mark your favorite movies to find them easily."
                  action={{ label: "Browse Movies", href: "/movies" }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: typeof Star
  title: string
  description: string
  action: { label: string; href: string }
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-muted-foreground">{description}</p>
      <Button asChild className="mt-4">
        <Link href={action.href}>{action.label}</Link>
      </Button>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AuthProvider>
  )
}
