import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CustomerLoginPage() {
  const navigate = useNavigate()
  const { loginCustomer } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    const { error } = await loginCustomer(formData.email, formData.password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/cuenta')
    }
  }

  return (
    <div className="min-h-screen bg-background-light pt-24 pb-16">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-2xl font-heading font-light mb-2 text-center">Iniciar sesion</h1>
        <p className="text-gray-500 font-menu text-center mb-8">Accede a tu cuenta de Astra Boutique</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm font-menu">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Contrasena *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
              placeholder="Tu contrasena"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-sm font-menu hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#251E1A' }}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="text-center text-sm font-menu text-gray-500 mt-6">
          No tienes cuenta?{' '}
          <Link to="/registro" className="text-[#251E1A] hover:underline">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}
