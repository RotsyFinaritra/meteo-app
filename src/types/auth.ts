export interface User {
  id: string
  email: string
  username?: string
  preferred_unit: 'celsius' | 'fahrenheit'
}

export interface AuthState {
  user: User | null
  loading: boolean
  updateUnit: (unit: 'celsius' | 'fahrenheit') => void
}