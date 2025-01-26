import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Project Connect</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Connect with senior students, explore past projects, and get implementation guidance for your college projects.
      </p>
      {user ? (
        <div className="space-y-4">
          <Link to="/projects" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Explore Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
            Register
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home

