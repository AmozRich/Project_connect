import type React from "react"
import { useState, useEffect } from "react"
import { fetchConversations, sendMessage } from "../api"
import { useAuth } from "../contexts/AuthContext"

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
  }[]
  lastMessage: {
    content: string
    createdAt: string
  }
}

interface Message {
  id: string
  sender: {
    id: string
    name: string
  }
  content: string
  createdAt: string
}

const Messaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetchConversations()
        setConversations(response.data)
      } catch (err) {
        setError("Failed to fetch conversations. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Fetch messages for the selected conversation
      // This is a placeholder and should be replaced with an actual API call
      setMessages([])
    }
  }, [selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim()) return

    try {
      const response = await sendMessage(selectedConversation, newMessage)
      setMessages([...messages, response.data])
      setNewMessage("")
    } catch (err) {
      setError("Failed to send message. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading conversations...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <h2 className="text-2xl font-bold p-4">Conversations</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedConversation === conversation.id ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
          >
            <p className="font-semibold">{conversation.participants.find((p) => p.id !== user?.id)?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{conversation.lastMessage.content}</p>
          </div>
        ))}
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender.id === user?.id ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.sender.id === user?.id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messaging

