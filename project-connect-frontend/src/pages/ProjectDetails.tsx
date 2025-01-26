import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { fetchProjectById } from "../api"
import CommentSection from "../components/CommentSection"
import RatingSystem from "../components/RatingSystem"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  creator: {
    id: string
    name: string
  }
  implementationDetails: string
  resources: { title: string; url: string }[]
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await fetchProjectById(id!)
        setProject(response.data)
      } catch (err) {
        setError("Failed to fetch project details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getProject()
  }, [id])

  if (isLoading) {
    return <div className="text-center">Loading project details...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!project) {
    return <div className="text-center">Project not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Implementation Details</h2>
        <p>{project.implementationDetails}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Resources</h2>
        <ul className="list-disc list-inside">
          {project.resources.map((resource, index) => (
            <li key={index}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <RatingSystem projectId={project.id} />
      <CommentSection projectId={project.id} />
    </div>
  )
}

export default ProjectDetails

