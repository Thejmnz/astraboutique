import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.user_metadata?.role
        if (role === 'customer') {
          const meta = session.user.user_metadata || {}
          setCustomer({
            id: session.user.id,
            firstName: meta.first_name || '',
            lastName: meta.last_name || '',
            email: session.user.email,
            phone: meta.phone || '',
            emailConfirmed: session.user.email_confirmed_at,
          })
        } else {
          setUser(session.user)
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.user_metadata?.role
        if (role === 'customer') {
          const meta = session.user.user_metadata || {}
          setCustomer({
            id: session.user.id,
            firstName: meta.first_name || '',
            lastName: meta.last_name || '',
            email: session.user.email,
            phone: meta.phone || '',
            emailConfirmed: session.user.email_confirmed_at,
          })
          setUser(null)
        } else {
          setUser(session.user)
          setCustomer(null)
        }
      } else {
        setUser(null)
        setCustomer(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { data, error }
    const role = data.user.user_metadata?.role
    if (role === 'customer') {
      await supabase.auth.signOut()
      return { error: { message: 'Email o contrasena incorrectos' } }
    }
    setUser(data.user)
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCustomer(null)
  }

  const signUp = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: 'customer',
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) return { error: { message: error.message } }

    if (data.user && !data.session) {
      return { data: { needsConfirmation: true }, error: null }
    }

    return { data: data.user, error: null }
  }

  const loginCustomer = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: { message: 'Email o contrasena incorrectos' } }

    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      return { error: { message: 'Por favor confirma tu email antes de iniciar sesion. Revisa tu bandeja de entrada.' } }
    }

    const meta = data.user.user_metadata || {}
    if (meta.role !== 'customer') {
      await supabase.auth.signOut()
      return { error: { message: 'Email o contrasena incorrectos' } }
    }

    const customerData = {
      id: data.user.id,
      firstName: meta.first_name || '',
      lastName: meta.last_name || '',
      email: data.user.email,
      phone: meta.phone || '',
      emailConfirmed: data.user.email_confirmed_at,
    }
    setCustomer(customerData)
    return { data: customerData, error: null }
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
    }}>
      {children}
    </AuthContext.Provider>
  )
}
