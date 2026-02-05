"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { AuthProvider } from "@/lib/auth-context"
import { searchMovies } from "@/lib/mock-data"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const results = searchMovies(query)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Search Results</h1>
            <p className="text-muted-foreground">
              {query ? (
                <>
                  {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
                </>
              ) : (
                "Enter a search term to find movies"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : query ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">No results found</h2>
          <p className="mt-2 text-muted-foreground">
            Try searching for a different movie, director, or actor.
          </p>
          <Button asChild className="mt-4">
            <Link href="/movies">Browse All Movies</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Start searching</h2>
          <p className="mt-2 text-muted-foreground">
            Search for movies by title, director, or actor.
          </p>
        </div>
      )}
    </div>
  )
}

function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 rounded bg-secondary" />
              <div className="mt-2 h-4 w-64 rounded bg-secondary" />
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <SearchPage />
    </AuthProvider>
  )
}
