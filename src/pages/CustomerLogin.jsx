import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    
    const { error } = await signUp({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    })

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
        <h1 className="text-2xl font-heading font-light mb-2 text-center">Crear cuenta</h1>
        <p className="text-gray-500 font-menu text-center mb-8">
          Únete a Astra Boutique para una mejor experiencia de compra
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm font-menu">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-menu text-gray-600 mb-1">Nombre *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-menu text-gray-600 mb-1">Apellido *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-menu text-gray-600 mb-1">Confirmar contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-sm font-menu hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#251E1A' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm font-menu text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
