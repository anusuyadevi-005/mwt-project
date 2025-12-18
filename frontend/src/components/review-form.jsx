"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"

/**
 * @typedef {Object} ReviewFormProps
 * @property {string} packageId
 * @property {(review: { userName: string, rating: number, comment: string, date: string }) => void} [onReviewSubmitted]
 */

/**
 * @param {ReviewFormProps} props
 */
export function ReviewForm({ packageId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [review, setReview] = useState("")
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your first and last name",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (review.trim().length < 10) {
      toast({
        title: "Error",
        description: "Please write a review with at least 10 characters",
        variant: "destructive",
      })
      return
    }

    const newReview = {
      userName: `${firstName} ${lastName}`,
      rating,
      comment: review,
      date: new Date().toISOString(),
    }

    console.log({ packageId, ...newReview })

    toast({
      title: "Success",
      description: "Your review has been submitted successfully",
    })

    onReviewSubmitted?.(newReview)

    setRating(0)
    setFirstName("")
    setLastName("")
    setReview("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("writeReview")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                Last Name
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t("yourRating")}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review" className="text-sm font-medium mb-2 block">
              {t("yourReview")}
            </label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full">
            {t("submitReview")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
