import Link from "next/link"
import { Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Star className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CineRate</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Discover movies, read reviews, and share your ratings with the community.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground">Browse</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground">
                  All Movies
                </Link>
              </li>
              <li>
                <Link href="/top-rated" className="text-sm text-muted-foreground hover:text-foreground">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-sm text-muted-foreground hover:text-foreground">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Cookie Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>Demo Application - Data does not persist between sessions</p>
        </div>
      </div>
    </footer>
  )
}
