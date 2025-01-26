import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import ProjectListing from "./pages/ProjectListing"
import ProjectDetails from "./pages/ProjectDetails"
import UserProfile from "./pages/UserProfile"
import Messaging from "./pages/Messaging"
import AdminDashboard from "./pages/AdminDashboard"
import PrivateRoute from "./components/PrivateRoute"

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectListing />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/profile/:id" element={<UserProfile />} />
                <Route
                  path="/messages"
                  element={
                    <PrivateRoute>
                      <Messaging />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

