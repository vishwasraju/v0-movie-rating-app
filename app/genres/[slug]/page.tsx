"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/lib/auth-context"
import { genres, getMoviesByGenre } from "@/lib/mock-data"

function GenreDetailPage({ slug }: { slug: string }) {
  const genreName = genres.find(g => g.toLowerCase() === slug) || slug
  const genreMovies = getMoviesByGenre(genreName)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/genres">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Genres
            </Link>
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{genreName} Movies</h1>
            <p className="mt-1 text-muted-foreground">
              {genreMovies.length} {genreMovies.length === 1 ? "movie" : "movies"} in this genre
            </p>
          </div>

          {/* Movies Grid */}
          {genreMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {genreMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No movies found in this genre.</p>
              <Button asChild className="mt-4">
                <Link href="/genres">Browse Other Genres</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  return (
    <AuthProvider>
      <GenreDetailPage slug={slug} />
    </AuthProvider>
  )
}
