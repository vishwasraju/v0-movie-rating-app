"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Session, AuthChangeEvent } from "@supabase/supabase-js"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinedAt: string
  ratings: { movieId: string; rating: number }[]
  watchlist: string[]
  favorites: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  addToWatchlist: (movieId: string) => Promise<void>
  removeFromWatchlist: (movieId: string) => Promise<void>
  addToFavorites: (movieId: string) => Promise<void>
  removeFromFavorites: (movieId: string) => Promise<void>
  rateMovie: (movieId: string, rating: number) => Promise<void>
  getUserRating: (movieId: string) => number | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // Fetch ratings (reviews)
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('movie_id, rating')
        .eq('user_id', userId)

      if (reviewsError) throw reviewsError

      // Fetch watchlist
      const { data: watchlist, error: watchlistError } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', userId)

      if (watchlistError) throw watchlistError

      // Fetch favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('movie_id')
        .eq('user_id', userId)

      if (favoritesError) throw favoritesError

      const userData: User = {
        id: profile.id,
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        avatar: profile.avatar,
        joinedAt: profile.joined_at,
        ratings: reviews.map((r: any) => ({ movieId: r.movie_id, rating: r.rating })),
        watchlist: watchlist.map((w: any) => w.movie_id),
        favorites: favorites.map((f: any) => f.movie_id)
      }

      setUser(userData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })
      if (error) throw error

      if (data.user) {
        // Create profile entry using SQL trigger would be better, but doing it manually for now if trigger doesn't exist
        // Note: We should ideally have a trigger on auth.users for this.
        // Assuming the explicit insert here for robust client-side handling if triggers aren't set up.
        // Check if profile exists first (trigger might have created it)
        const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', data.user.id).single()

        if (!existingProfile) {
          await supabase.from('profiles').insert({
            id: data.user.id, // Explicitly linking auth.uid()
            name,
            email,
            joined_at: new Date().toISOString()
          })
        }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const addToWatchlist = async (movieId: string) => {
    if (!user) return
    const { error } = await supabase.from('watchlist').insert({ user_id: user.id, movie_id: movieId })
    if (error) {
      console.error("Error adding to watchlist:", error)
      return
    }
    await fetchUserData(user.id) // Refresh local state
  }

  const removeFromWatchlist = async (movieId: string) => {
    if (!user) return
    const { error } = await supabase.from('watchlist').delete().match({ user_id: user.id, movie_id: movieId })
    if (error) {
      console.error("Error removing from watchlist:", error)
      return
    }
    await fetchUserData(user.id)
  }

  const addToFavorites = async (movieId: string) => {
    if (!user) return
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, movie_id: movieId })
    if (error) {
      console.error("Error adding to favorites:", error)
      return
    }
    await fetchUserData(user.id)
  }

  const removeFromFavorites = async (movieId: string) => {
    if (!user) return
    const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, movie_id: movieId })
    if (error) {
      console.error("Error removing from favorites:", error)
      return
    }
    await fetchUserData(user.id)
  }

  const rateMovie = async (movieId: string, rating: number) => {
    if (!user) return

    // Check if review exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .match({ user_id: user.id, movie_id: movieId })
      .single()

    let error;
    if (existingReview) {
      if (rating === 0) {
        // Delete review if rating is 0 (removed)
        const { error: delError } = await supabase.from('reviews').delete().eq('id', existingReview.id)
        error = delError
      } else {
        // Update existing
        const { error: upError } = await supabase.from('reviews').update({ rating }).eq('id', existingReview.id)
        error = upError
      }
    } else if (rating > 0) {
      // Insert new partial review (rating only)
      const { error: insError } = await supabase.from('reviews').insert({
        user_id: user.id,
        movie_id: movieId,
        user_name: user.name,
        rating
      })
      error = insError
    }

    if (error) {
      console.error("Error updating rating:", error)
      return
    }
    await fetchUserData(user.id)
  }

  const getUserRating = (movieId: string): number | null => {
    if (!user) return null
    const rating = user.ratings.find(r => r.movieId === movieId)
    return rating?.rating ?? null
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      addToWatchlist,
      removeFromWatchlist,
      addToFavorites,
      removeFromFavorites,
      rateMovie,
      getUserRating
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
