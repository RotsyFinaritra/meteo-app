import { useState } from 'react'
import './SearchBar.css'

interface SearchBarProps {
  onSearch: (city: string) => void
  loading: boolean
}

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <form className="searchbar-form" onSubmit={handleSubmit}>
      <div className="searchbar-wrapper">
        <span className="searchbar-icon">🔍</span>
        <input
          className="searchbar-input"
          type="text"
          placeholder="Rechercher une ville..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button className="searchbar-btn" type="submit" disabled={loading || !query.trim()}>
          {loading ? '...' : 'Chercher'}
        </button>
      </div>
    </form>
  )
}

export default SearchBar