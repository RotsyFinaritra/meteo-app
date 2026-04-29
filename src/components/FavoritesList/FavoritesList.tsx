import './FavoritesList.css'

interface Favorite {
  id: string
  city_name: string
  country_code: string
}

interface FavoritesListProps {
  favorites: Favorite[]
  onSelect: (city: string) => void
  onRemove: (id: string) => void
}

const FavoritesList = ({ favorites, onSelect, onRemove }: FavoritesListProps) => {
  if (favorites.length === 0) return null

  return (
    <div className="favorites-card">
      <h3 className="favorites-title">⭐ Mes favoris</h3>
      <div className="favorites-list">
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-item">
            <button className="favorite-city-btn" onClick={() => onSelect(fav.city_name)}>
              <span className="fav-city">{fav.city_name}</span>
              <span className="fav-country">{fav.country_code}</span>
            </button>
            <button className="fav-remove-btn" onClick={() => onRemove(fav.id)} title="Retirer">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesList
export type { Favorite }