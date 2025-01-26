import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { fetchUserProfile, updateUserProfile } from "../api"
import { useAuth } from "../contexts/AuthContext"

interface UserProfile {
  id: string
  name: string
  email: string
  department: string
  graduationYear: number
  skills: string[]
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchUserProfile(id!)
        setProfile(response.data)
      } catch (err) {
        setError("Failed to fetch user profile. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    try {
      const response = await updateUserProfile(profile.id, profile)
      setProfile(response.data)
      setIsEditing(false)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!profile) {
    return <div className="text-center">User not found.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="department" className="block mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="graduationYear" className="block mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              id="graduationYear"
              value={profile.graduationYear}
              onChange={(e) => setProfile({ ...profile, graduationYear: Number.parseInt(e.target.value) })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              value={profile.skills.join(", ")}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value.split(",").map((skill) => skill.trim()) })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Department:</strong> {profile.department}
          </p>
          <p>
            <strong>Graduation Year:</strong> {profile.graduationYear}
          </p>
          <p>
            <strong>Skills:</strong> {profile.skills.join(", ")}
          </p>
          {user && user.id === profile.id && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserProfile

