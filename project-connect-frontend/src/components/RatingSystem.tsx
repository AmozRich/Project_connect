import type React from "react"
import { useState, useEffect } from "react"
import { fetchRating, submitRating } from "../api"
import { useAuth } from "../contexts/AuthContext"

interface RatingSystemProps {
  projectId: string
}

const RatingSystem: React.FC<RatingSystemProps> = ({ projectId }) => {
  const [rating, setRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const getRating = async () => {
      try {
        const response = await fetchRating(projectId)
        setRating(response.data.userRating)
        setAverageRating(response.data.averageRating)
      } catch (err) {
        setError("Failed to fetch rating. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getRating()
  }, [projectId])

  const handleRating = async (newRating: number) => {
    if (!user) {
      setError("You must be logged in to rate.")
      return
    }
    try {
      const response = await submitRating(projectId, newRating)
      setRating(newRating)
      setAverageRating(response.data.averageRating)
    } catch (err) {
      setError("Failed to submit rating. Please try again.")
    }
  }

  if (isLoading) {
    return <div>Loading rating...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Rate this project</h3>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-2xl ${rating && star <= rating ? "text-yellow-500" : "text-gray-300"} focus:outline-none`}
          >
            ★
          </button>
        ))}
        {averageRating !== null && (
          <span className="ml-4 text-gray-600 dark:text-gray-400">Average: {averageRating.toFixed(1)}</span>
        )}
      </div>
    </div>
  )
}

export default RatingSystem

