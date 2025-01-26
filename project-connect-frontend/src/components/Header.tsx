import type React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Project Connect
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400">
                Projects
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/messages" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link to={`/profile/${user.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-blue-600 dark:hover:text-blue-400">
                    Logout
                  </button>
                </li>
              </>
            )}
            {!user && (
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  )
}

export default Header

