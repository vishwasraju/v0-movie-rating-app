"use client"

import Link from "next/link"
import { ArrowRight, Star, TrendingUp, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/lib/auth-context"
import { getTopRatedMovies, movies, genres } from "@/lib/mock-data"

function HomePage() {
  const topRatedMovies = getTopRatedMovies(6)
  const featuredMovie = movies[0]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdrop || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded bg-primary px-2 py-1">
                  <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                  <span className="text-sm font-bold text-primary-foreground">{featuredMovie.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">Top Rated</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                {featuredMovie.title}
              </h1>
              
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                {featuredMovie.plot}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{featuredMovie.year}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{featuredMovie.genres.join(", ")}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>Directed by {featuredMovie.director}</span>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href={`/movie/${featuredMovie.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/movies">
                    Browse All Movies
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Top Rated</h2>
                  <p className="text-sm text-muted-foreground">Highest rated movies of all time</p>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/top-rated">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {topRatedMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} showRank={index + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Genre */}
        <section className="border-t border-border bg-card py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Browse by Genre</h2>
                <p className="text-sm text-muted-foreground">Find movies by your favorite genres</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {genres.slice(0, 12).map((genre) => (
                <Button key={genre} variant="secondary" asChild>
                  <Link href={`/genres/${genre.toLowerCase()}`}>
                    {genre}
                  </Link>
                </Button>
              ))}
              <Button variant="outline" asChild>
                <Link href="/genres">
                  View All Genres
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl bg-secondary p-8 text-center md:p-12">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Join the Community
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Create an account to rate movies, write reviews, and build your personal watchlist.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Create Account
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
