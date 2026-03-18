import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

function getInitialCustomer() {
  try {
    const saved = localStorage.getItem('customer')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(getInitialCustomer)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (customer) {
      localStorage.setItem('customer', JSON.stringify(customer))
    } else {
      localStorage.removeItem('customer')
    }
  }, [customer])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCustomer(null)
  }

  const signUp = async (userData) => {
    const existingUsers = JSON.parse(localStorage.getItem('customers') || '[]')
    const exists = existingUsers.find(u => u.email === userData.email)
    if (exists) {
      return { error: { message: 'Este email ya está registrado' } }
    }
    const newUser = {
      id: 'CUS-' + Date.now().toString(36).toUpperCase(),
      ...userData,
      createdAt: new Date().toISOString(),
    }
    existingUsers.push(newUser)
    localStorage.setItem('customers', JSON.stringify(existingUsers))
    setCustomer(newUser)
    return { data: newUser, error: null }
  }

  const loginCustomer = async (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('customers') || '[]')
    const user = existingUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      return { error: { message: 'Email o contraseña incorrectos' } }
    }
    setCustomer(user)
    return { data: user, error: null }
  }

  const updateCustomer = (updates) => {
    const updated = { ...customer, ...updates }
    setCustomer(updated)
    const existingUsers = JSON.parse(localStorage.getItem('customers') || '[]')
    const index = existingUsers.findIndex(u => u.id === customer.id)
    if (index > -1) {
      existingUsers[index] = updated
      localStorage.setItem('customers', JSON.stringify(existingUsers))
    }
    return updated
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      customer,
      loading, 
      signIn, 
      signOut,
      signUp,
      loginCustomer,
      updateCustomer,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
