"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type User } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCard } from "@/components/movie-card"
import { ReviewCard } from "@/components/review-card"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Settings, User as UserIcon, Star, Heart, MessageSquare } from "lucide-react"

// Define interfaces for data we fetch
interface Movie {
    id: string
    title: string
    year: number
    poster: string
    rating: number
    genres: string[]
}

interface ReviewWithMovie {
    id: string
    rating: number
    content: string
    created_at: string
    movie: Movie
}

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("favorites")
    const [ratedMovies, setRatedMovies] = useState<Movie[]>([])
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const [userReviews, setUserReviews] = useState<ReviewWithMovie[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    // Settings state
    const [isUploading, setIsUploading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")

    useEffect(() => {
        if (!user) {
            router.push("/auth/login")
            return
        }

        const fetchData = async () => {
            setIsLoadingData(true)
            try {
                // Fetch Favorites
                if (user.favorites.length > 0) {
                    const { data: favs } = await supabase
                        .from('movies')
                        .select('*')
                        .in('id', user.favorites)
                    if (favs) setFavoriteMovies(favs)
                } else {
                    setFavoriteMovies([])
                }

                // Fetch Rated Movies
                const ratedIds = user.ratings.map(r => r.movieId)
                if (ratedIds.length > 0) {
                    const { data: rated } = await supabase
                        .from('movies')
                        .select('*')
                        .in('id', ratedIds)
                    if (rated) setRatedMovies(rated)
                } else {
                    setRatedMovies([])
                }

                // Fetch Reviews with Movie Data
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('*, movie:movies(*)')
                    .eq('user_id', user.id)

                if (reviews) {
                    // Map to match ReviewCard expected format slightly or use a custom card
                    // For now, let's just use the data as is or adapt it
                    setUserReviews(reviews as any)
                }

            } catch (error) {
                console.error("Error fetching profile data:", error)
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchData()
    }, [user, router])

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordMessage("")
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error
            setPasswordMessage("Password updated successfully!")
            setNewPassword("")
        } catch (error: any) {
            setPasswordMessage(`Error: ${error.message}`)
        }
    }

    // Placeholder for Avatar Upload (requires Storage setup)
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        // Logic would go here: upload to storage bucket 'avatars', get public URL, update profile
        alert("Avatar upload requires Supabase Storage bucket 'avatars' to be configured.")
    }

    if (!user) return null // or loading spinner

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container flex-1 py-10">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Sidebar / User Info */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-20 rounded-lg border bg-card p-6 text-center shadow-sm">
                            <Avatar className="mx-auto h-24 w-24 mb-4">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-2">Member since {new Date(user.joinedAt).toLocaleDateString()}</p>

                            <Button variant="destructive" className="mt-6 w-full" onClick={() => logout()}>
                                Log Out
                            </Button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Tabs defaultValue="favorites" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                                <TabsTrigger value="favorites"><Heart className="mr-2 h-4 w-4" />Favorites</TabsTrigger>
                                <TabsTrigger value="ratings"><Star className="mr-2 h-4 w-4" />Ratings</TabsTrigger>
                                <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4" />Reviews</TabsTrigger>
                                <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
                            </TabsList>

                            {isLoadingData ? (
                                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
                            ) : (
                                <>
                                    <TabsContent value="favorites" className="mt-6">
                                        <h3 className="text-2xl font-bold mb-6">My Favorites</h3>
                                        {favoriteMovies.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                {favoriteMovies.map(movie => (
                                                    <MovieCard key={movie.id} movie={movie as any} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No favorites yet.</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="ratings" className="mt-6">
                                        <h3 className="text-2xl font-bold mb-6">My Ratings</h3>
                                        {ratedMovies.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                {ratedMovies.map(movie => (
                                                    <MovieCard key={movie.id} movie={movie as any} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No ratings yet.</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="reviews" className="mt-6">
                                        <h3 className="text-2xl font-bold mb-6">My Reviews</h3>
                                        {userReviews.length > 0 ? (
                                            <div className="grid gap-4">
                                                {userReviews.map(review => (
                                                    <div key={review.id} className="border rounded-lg p-4 bg-card">
                                                        <div className="flex gap-4">
                                                            <img src={review.movie.poster} alt={review.movie.title} className="w-16 h-24 object-cover rounded" />
                                                            <div>
                                                                <h4 className="font-bold">{review.movie.title}</h4>
                                                                <div className="flex items-center text-yellow-500 my-1">
                                                                    <Star className="h-4 w-4 fill-current" />
                                                                    <span className="ml-1 text-sm font-medium">{review.rating}/10</span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-2">{review.content}</p>
                                                                <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No reviews yet.</p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="settings" className="mt-6">
                                        <div className="max-w-md space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium">Profile Picture</h3>
                                                <div className="mt-2 flex items-center gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <Input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, GIF</p>
                                            </div>

                                            <div className="border-t pt-6">
                                                <h3 className="text-lg font-medium">Change Password</h3>
                                                <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="new-password">New Password</Label>
                                                        <Input
                                                            id="new-password"
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="Enter new password"
                                                            minLength={6}
                                                            required
                                                        />
                                                    </div>
                                                    <Button type="submit">Update Password</Button>
                                                    {passwordMessage && <p className="text-sm text-blue-500">{passwordMessage}</p>}
                                                </form>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </>
                            )}
                        </Tabs>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
