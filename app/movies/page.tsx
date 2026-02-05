"use client"

import { useState } from "react"
import { Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/lib/auth-context"
import { movies, genres } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"rating" | "year" | "title">("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredMovies = selectedGenre
    ? movies.filter(m => m.genres.includes(selectedGenre))
    : movies

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "year") return b.year - a.year
    return a.title.localeCompare(b.title)
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">All Movies</h1>
            <p className="mt-1 text-muted-foreground">
              Explore our collection of {movies.length} movies
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Genre:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGenre === null ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedGenre(null)}
              >
                All
              </Button>
              {genres.slice(0, 8).map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort & View Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {sortedMovies.length} movies
          </p>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedMovies.map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function MovieListItem({ movie }: { movie: typeof movies[0] }) {
  return (
    <a
      href={`/movie/${movie.id}`}
      className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
    >
      <img
        src={movie.poster || "/placeholder.svg"}
        alt={movie.title}
        className="h-32 w-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{movie.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {movie.year} · {movie.genres.join(", ")}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {movie.plot}
        </p>
        <div className="mt-2 flex items-center gap-1 text-sm">
          <span className="font-bold text-primary">{movie.rating}</span>
          <span className="text-muted-foreground">/ 10</span>
        </div>
      </div>
    </a>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <MoviesPage />
    </AuthProvider>
  )
}
