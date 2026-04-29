import { useAuth } from '../../contexts/AuthContext'
import { useAuthActions } from '../../hooks/useAuthActions'
import './Navbar.css'

const Navbar = () => {
  const { user } = useAuth()
  const { signOut } = useAuthActions()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🌤️</span>
        <span className="navbar-title">Météo</span>
      </div>

      <div className="navbar-user">
        <span className="navbar-username">👤 {user?.username}</span>
        <button className="navbar-signout" onClick={signOut}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default Navbar