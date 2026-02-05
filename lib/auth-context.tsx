"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  logout: () => void
  addToWatchlist: (movieId: string) => void
  removeFromWatchlist: (movieId: string) => void
  addToFavorites: (movieId: string) => void
  removeFromFavorites: (movieId: string) => void
  rateMovie: (movieId: string, rating: number) => void
  getUserRating: (movieId: string) => number | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER: User = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@cinerate.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  joinedAt: "2024-01-01",
  ratings: [],
  watchlist: [],
  favorites: []
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session (demo only - uses sessionStorage)
    const storedUser = sessionStorage.getItem("cinerate-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const saveUser = (userData: User) => {
    sessionStorage.setItem("cinerate-user", JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // Demo login - accepts any email/password
    await new Promise(resolve => setTimeout(resolve, 500))
    const userData = { ...DEMO_USER, email, name: email.split("@")[0] }
    saveUser(userData)
    return { success: true }
  }

  const signup = async (name: string, email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // Demo signup
    await new Promise(resolve => setTimeout(resolve, 500))
    const userData = { ...DEMO_USER, id: `user-${Date.now()}`, name, email }
    saveUser(userData)
    return { success: true }
  }

  const logout = () => {
    sessionStorage.removeItem("cinerate-user")
    setUser(null)
  }

  const addToWatchlist = (movieId: string) => {
    if (!user) return
    const updated = { ...user, watchlist: [...user.watchlist, movieId] }
    saveUser(updated)
  }

  const removeFromWatchlist = (movieId: string) => {
    if (!user) return
    const updated = { ...user, watchlist: user.watchlist.filter(id => id !== movieId) }
    saveUser(updated)
  }

  const addToFavorites = (movieId: string) => {
    if (!user) return
    const updated = { ...user, favorites: [...user.favorites, movieId] }
    saveUser(updated)
  }

  const removeFromFavorites = (movieId: string) => {
    if (!user) return
    const updated = { ...user, favorites: user.favorites.filter(id => id !== movieId) }
    saveUser(updated)
  }

  const rateMovie = (movieId: string, rating: number) => {
    if (!user) return
    const existingIndex = user.ratings.findIndex(r => r.movieId === movieId)
    const newRatings = [...user.ratings]
    if (existingIndex >= 0) {
      newRatings[existingIndex] = { movieId, rating }
    } else {
      newRatings.push({ movieId, rating })
    }
    const updated = { ...user, ratings: newRatings }
    saveUser(updated)
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
