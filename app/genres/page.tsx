"use client"

import Link from "next/link"
import { Film } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { genres, getMoviesByGenre } from "@/lib/mock-data"

const genreColors: Record<string, string> = {
  "Action": "from-red-500/20 to-orange-500/20",
  "Adventure": "from-emerald-500/20 to-teal-500/20",
  "Animation": "from-pink-500/20 to-rose-500/20",
  "Biography": "from-amber-500/20 to-yellow-500/20",
  "Comedy": "from-yellow-500/20 to-lime-500/20",
  "Crime": "from-slate-500/20 to-zinc-500/20",
  "Documentary": "from-blue-500/20 to-cyan-500/20",
  "Drama": "from-indigo-500/20 to-violet-500/20",
  "Family": "from-green-500/20 to-emerald-500/20",
  "Fantasy": "from-purple-500/20 to-fuchsia-500/20",
  "History": "from-stone-500/20 to-amber-500/20",
  "Horror": "from-red-900/20 to-rose-900/20",
  "Music": "from-fuchsia-500/20 to-pink-500/20",
  "Mystery": "from-slate-600/20 to-gray-600/20",
  "Romance": "from-rose-500/20 to-pink-500/20",
  "Sci-Fi": "from-cyan-500/20 to-blue-500/20",
  "Sport": "from-lime-500/20 to-green-500/20",
  "Thriller": "from-gray-600/20 to-slate-600/20",
  "War": "from-stone-600/20 to-zinc-600/20",
  "Western": "from-orange-600/20 to-amber-600/20",
}

function GenresPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Browse by Genre</h1>
                <p className="text-muted-foreground">
                  Explore movies by category
                </p>
              </div>
            </div>
          </div>

          {/* Genre Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {genres.map((genre) => {
              const movieCount = getMoviesByGenre(genre).length
              const gradientClass = genreColors[genre] || "from-primary/20 to-accent/20"
              
              return (
                <Link
                  key={genre}
                  href={`/genres/${genre.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-50 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    <h3 className="text-xl font-bold text-foreground">{genre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {movieCount} {movieCount === 1 ? "movie" : "movies"}
                    </p>
                  </div>
                </Link>
              )
            })}
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
      <GenresPage />
    </AuthProvider>
  )
}
