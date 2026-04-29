import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { AuthState, User } from '../types/auth'

const AuthContext = createContext<AuthState>({ user: null, loading: true, updateUnit: () => { } })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUnit = async (unit: 'celsius' | 'fahrenheit') => {
    if (!user) return
    await supabase.from('profiles').update({ preferred_unit: unit }).eq('id', user.id)
    setUser({ ...user, preferred_unit: unit })
  }

  useEffect(() => {
    // Récupérer la session active au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Profil pas encore créé, on attend pas
      console.warn('Profil introuvable:', error.message)
      setLoading(false)
      return
    }

    if (data) setUser(data)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, updateUnit }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)