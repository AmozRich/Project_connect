import axios from "axios"

const API = axios.create({ baseURL: "http://localhost:5000/api" })

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("profile")
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`
  }
  return req
})

// Auth
export const signIn = (formData: { email: string; password: string }) => API.post("/auth/login", formData)
export const signUp = (formData: { name: string; email: string; password: string }) =>
  API.post("/auth/register", formData)

// Projects
export const fetchProjects = () => API.get("/projects")
export const fetchProjectById = (id: string) => API.get(`/projects/${id}`)
export const createProject = (projectData: any) => API.post("/projects", projectData)
export const updateProject = (id: string, projectData: any) => API.put(`/projects/${id}`, projectData)
export const deleteProject = (id: string) => API.delete(`/projects/${id}`)

// Users
export const fetchUserProfile = (id: string) => API.get(`/users/${id}`)
export const updateUserProfile = (id: string, userData: any) => API.put(`/users/${id}`, userData)
export const fetchUsers = () => API.get("/users")
export const deleteUser = (id: string) => API.delete(`/users/${id}`)

// Comments
export const fetchComments = (projectId: string) => API.get(`/projects/${projectId}/comments`)
export const addComment = (projectId: string, content: string) =>
  API.post(`/projects/${projectId}/comments`, { content })

// Ratings
export const fetchRating = (projectId: string) => API.get(`/projects/${projectId}/rating`)
export const submitRating = (projectId: string, rating: number) => API.post(`/projects/${projectId}/rating`, { rating })

// Messages
export const fetchConversations = () => API.get("/messages/conversations")
export const sendMessage = (conversationId: string, content: string) =>
  API.post(`/messages/${conversationId}`, { content })

