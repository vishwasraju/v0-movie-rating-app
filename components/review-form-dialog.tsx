"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ReviewFormDialogProps {
    movie: {
        id: string
        title: string
    }
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function ReviewFormDialog({ movie, isOpen, onClose, onSuccess }: ReviewFormDialogProps) {
    const { user } = useAuth()
    const [rating, setRating] = useState(0)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        if (rating === 0) {
            setError("Please select a rating")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            // Check for existing review to upsert
            const { data: existingReview } = await supabase
                .from('reviews')
                .select('id')
                .match({ user_id: user.id, movie_id: movie.id })
                .single()

            const reviewData = {
                user_id: user.id,
                movie_id: movie.id,
                user_name: user.name,
                rating,
                title,
                content,
                created_at: new Date().toISOString()
            }

            if (existingReview) {
                const { error } = await supabase
                    .from('reviews')
                    .update(reviewData)
                    .eq('id', existingReview.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('reviews')
                    .insert(reviewData)
                if (error) throw error
            }

            onSuccess()
            onClose()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to submit review")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your thoughts on {movie.title} with the community.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2 flex flex-col items-center">
                        <Label>Your Rating</Label>
                        <StarRating
                            rating={rating}
                            maxRating={10}
                            onRate={setRating}
                            size="lg"
                            interactive
                            showValue
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Review Title</Label>
                        <Input
                            id="title"
                            placeholder="Sum up your thoughts in a headline"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Review</Label>
                        <Textarea
                            id="content"
                            placeholder="Tell us what you liked or disliked..."
                            className="min-h-[100px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
