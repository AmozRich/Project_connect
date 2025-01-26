import type React from "react"
import { Link } from "react-router-dom"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  technologies: string[]
  creator: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, technologies, creator }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <Link to={`/projects/${id}`}>
        <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{title}</h3>
      </Link>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
            {tech}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Created by: {creator}</p>
    </div>
  )
}

export default ProjectCard

