"use client"

import { Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/lib/auth-context"
import { getTopRatedMovies, formatRatingCount } from "@/lib/mock-data"

function TopRatedPage() {
  const topMovies = getTopRatedMovies(12)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Star className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Top Rated Movies</h1>
                <p className="text-muted-foreground">
                  The highest rated movies based on user ratings
                </p>
              </div>
            </div>
          </div>

          {/* Top 3 Showcase */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {topMovies.slice(0, 3).map((movie, index) => (
              <a
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="aspect-[2/3]">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-1 rounded bg-background/80 px-2 py-0.5 backdrop-blur-sm">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-bold text-foreground">{movie.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {movie.year} · {formatRatingCount(movie.ratingCount)} ratings
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Rest of the list */}
          <h2 className="mb-6 text-xl font-semibold text-foreground">More Top Rated</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {topMovies.slice(3).map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} showRank={index + 4} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <TopRatedPage />
    </AuthProvider>
  )
}
