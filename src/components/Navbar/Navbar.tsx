import { useAuth } from '../../contexts/AuthContext'
import { useAuthActions } from '../../hooks/useAuthActions'
import './Navbar.css'

const Navbar = () => {
  const { user, updateUnit } = useAuth()
  const { signOut } = useAuthActions()
  const toggleUnit = async () => {
    const newUnit = user?.preferred_unit === 'celsius' ? 'fahrenheit' : 'celsius'
    await updateUnit(newUnit)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🌤️</span>
        <span className="navbar-title">Météo</span>
      </div>

      <div className="navbar-user">
        <span className="navbar-username">👤 {user?.username}</span>
        <button
          className="navbar-unit-toggle"
          onClick={toggleUnit}
          title="Changer l'unité de température"
        >
          <span className={user?.preferred_unit === 'celsius' ? 'unit-active' : ''}>°C</span>
          <span className="unit-separator">|</span>
          <span className={user?.preferred_unit === 'fahrenheit' ? 'unit-active' : ''}>°F</span>
        </button><button className="navbar-signout" onClick={signOut}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default Navbar