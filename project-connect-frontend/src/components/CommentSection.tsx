import type React from "react"
import { useState, useEffect } from "react"
import { fetchComments, addComment } from "../api"
import { useAuth } from "../contexts/AuthContext"

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name: string
  }
  createdAt: string
}

interface CommentSectionProps {
  projectId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetchComments(projectId)
        setComments(response.data)
      } catch (err) {
        setError("Failed to fetch comments. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getComments()
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("You must be logged in to comment.")
      return
    }
    try {
      const response = await addComment(projectId, newComment)
      setComments([...comments, response.data])
      setNewComment("")
    } catch (err) {
      setError("Failed to add comment. Please try again.")
    }
  }

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="mb-2">{comment.content}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By {comment.user.name} on {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      {user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder="Add a comment..."
            rows={3}
          />
          <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Post Comment
          </button>
        </form>
      )}
    </div>
  )
}

export default CommentSection

