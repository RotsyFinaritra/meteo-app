import { useState } from 'react'
import { useAuthActions } from '../hooks/useAuthActions'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/auth.css'

const RegisterPage = () => {
  const { signUp } = useAuthActions()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = (): string | null => {
    if (!username.trim()) return "Le nom d'utilisateur est requis"
    if (username.trim().length < 3) return "Le nom d'utilisateur doit contenir au moins 3 caractères"
    if (!email.trim()) return "L'email est requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "L'email n'est pas valide"
    if (password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères"
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation avant tout appel API
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return // ← on n'appelle jamais Supabase si invalide
    }

    setLoading(true)
    try {
      await signUp(email, password, username)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🌈</span>
          <h1>Inscription</h1>
          <p>Créez votre compte météo</p>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage