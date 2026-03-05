import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" />
  }

  return children
}
