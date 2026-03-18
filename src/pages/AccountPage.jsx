import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LogOut, Package, Clock, ChevronRight } from 'lucide-react'

const STATUS_MAP = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  order_confirmed: { label: 'Pedido confirmado', color: 'bg-blue-100 text-blue-800' },
  payment_confirmed: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expirado', color: 'bg-orange-100 text-orange-800' },
}

export default function AccountPage() {
  const { customer, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customer) return
    fetchOrders()
  }, [customer])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', customer.email)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background-light pt-24 pb-16">
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="text-2xl font-heading font-light mb-4">Mi cuenta</h1>
          <p className="text-gray-500 font-menu mb-8">Inicia sesion para ver tus pedidos</p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block text-center text-white py-3 px-8 text-sm font-menu hover:opacity-90 transition-all"
              style={{ backgroundColor: '#251E1A' }}
            >
              Iniciar sesion
            </Link>
            <Link
              to="/registro"
              className="block text-center py-3 px-8 text-sm font-menu border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background-light pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-light">Mi cuenta</h1>
            <p className="text-gray-500 font-menu mt-1">Hola, {customer.firstName} {customer.lastName}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-menu text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-menu font-medium mb-4">Mis pedidos</h2>
          {loading ? (
            <p className="text-gray-500 text-sm font-menu">Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 text-center">
              <Package size={48} strokeWidth={0.5} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-menu mb-4">No tienes pedidos aun</p>
              <Link
                to="/"
                className="text-[#251E1A] font-menu text-sm hover:underline"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-menu font-medium">{order.order_number}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_MAP[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_MAP[order.status]?.label || order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-10 h-12 bg-gray-100 rounded border border-white overflow-hidden">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {(order.items || []).length} articulo{(order.items || []).length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-menu font-medium">${Number(order.total).toLocaleString('es-CO')} COP</p>
                      {order.tracking_number && (
                        <p className="text-xs text-gray-400 mt-0.5">Guia: {order.tracking_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
