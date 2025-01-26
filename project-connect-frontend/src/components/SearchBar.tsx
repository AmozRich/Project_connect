import type React from "react"
import { useState } from "react"

interface SearchBarProps {
  onSearch: (searchTerm: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search projects or technologies..."
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchBar

