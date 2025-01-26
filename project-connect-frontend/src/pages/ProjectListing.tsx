import type React from "react"
import { useState, useEffect } from "react"
import { fetchProjects } from "../api"
import ProjectCard from "../components/ProjectCard"
import SearchBar from "../components/SearchBar"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  creator: {
    id: string
    name: string
  }
}

const ProjectListing: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetchProjects()
        setProjects(response.data)
        setFilteredProjects(response.data)
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getProjects()
  }, [])

  const handleSearch = (searchTerm: string) => {
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredProjects(filtered)
  }

  if (isLoading) {
    return <div className="text-center">Loading projects...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}

export default ProjectListing

