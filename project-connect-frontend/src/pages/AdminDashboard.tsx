import type React from "react"
import { useState, useEffect } from "react"
import { fetchUsers, fetchProjects, deleteUser, deleteProject } from "../api"
import { useAuth } from "../contexts/AuthContext"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Project {
  id: string
  title: string
  creator: {
    id: string
    name: string
  }
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([fetchUsers(), fetchProjects()])
        setUsers(usersResponse.data)
        setProjects(projectsResponse.data)
      } catch (err) {
        setError("Failed to fetch data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.role === "admin") {
      fetchData()
    } else {
      setError("You do not have permission to access this page.")
      setIsLoading(false)
    }
  }, [user])

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      setError("Failed to delete user. Please try again.")
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      setProjects(projects.filter((p) => p.id !== projectId))
    } catch (err) {
      setError("Failed to delete project. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading dashboard...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Title</th>
              <th className="text-left">Creator</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.creator.name}</td>
                <td>
                  <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminDashboard

