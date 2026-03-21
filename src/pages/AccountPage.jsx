import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LogOut, Package, Clock, ChevronDown, Truck, MapPin, CreditCard, FileText } from 'lucide-react'

const STATUS_MAP = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  order_confirmed: { label: 'Pedido confirmado', color: 'bg-blue-100 text-blue-800' },
  payment_confirmed: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expirado', color: 'bg-orange-100 text-orange-800' },
}

const SHIPPING_MAP = {
  standard: { label: 'Envio estandar', days: '3-5 dias habiles' },
  express: { label: 'Envio express', days: '1-2 dias habiles' },
  pickup: { label: 'Recogida en tienda', days: '' },
}

export default function AccountPage() {
  const { customer, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState(null)
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

  const isOrderExpired = (order) => {
    if (order.status !== 'pending') return false
    const created = new Date(order.created_at).getTime()
    const now = Date.now()
    return (now - created) > 15 * 60 * 1000
  }

  const getDisplayStatus = (order) => {
    return isOrderExpired(order) ? 'expired' : order.status
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
                <div key={order.id} className="bg-white border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-10 h-12 bg-gray-100 rounded border border-white overflow-hidden">
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-menu font-medium">{order.order_number}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock size={11} className="text-gray-400" />
                          <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                          <span className="text-xs text-gray-300">|</span>
                          <p className="text-xs text-gray-400">{(order.items || []).length} articulo{(order.items || []).length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-menu font-medium">${Number(order.total).toLocaleString('es-CO')}</p>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${STATUS_MAP[getDisplayStatus(order)]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_MAP[getDisplayStatus(order)]?.label || order.status}
                        </span>
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${expanded === order.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider mb-3">Productos</h4>
                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-14 h-18 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-menu font-medium text-gray-800 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400 font-menu">Talla: {item.size} | Cant: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-menu text-gray-700">${Number(item.price * item.quantity).toLocaleString('es-CO')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          {order.shipping_method !== 'pickup' && (
                            <div className="flex items-start gap-2 flex-1">
                              <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider">Direccion de envio</p>
                                <p className="text-sm text-gray-700 font-menu mt-0.5">{order.shipping_address}</p>
                                <p className="text-sm text-gray-500 font-menu">{order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-2 flex-1">
                            <Truck size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider">Metodo de envio</p>
                              <p className="text-sm text-gray-700 font-menu mt-0.5">
                                {SHIPPING_MAP[order.shipping_method]?.label || order.shipping_method}
                              </p>
                              {SHIPPING_MAP[order.shipping_method]?.days && (
                                <p className="text-xs text-gray-400 font-menu">{SHIPPING_MAP[order.shipping_method].days}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2 flex-1">
                            <CreditCard size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider">Pago</p>
                              <p className="text-sm text-gray-700 font-menu mt-0.5">
                                {order.payment_method === 'card' ? 'Nequi' : order.payment_method}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          <div className="flex justify-between text-sm font-menu text-gray-500">
                            <span>Subtotal</span>
                            <span>${Number(order.subtotal).toLocaleString('es-CO')}</span>
                          </div>
                          <div className="flex justify-between text-sm font-menu text-gray-500 mt-1">
                            <span>Envio</span>
                            <span>{Number(order.shipping_cost) === 0 ? 'Gratis' : `$${Number(order.shipping_cost).toLocaleString('es-CO')}`}</span>
                          </div>
                          <div className="flex justify-between text-sm font-menu font-medium text-gray-800 mt-2 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>${Number(order.total).toLocaleString('es-CO')} COP</span>
                          </div>
                        </div>

                        {(order.notes || order.tracking_number) && (
                          <div className="space-y-3">
                            {order.notes && (
                              <div className="flex items-start gap-2">
                                <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider">Notas</p>
                                  <p className="text-sm text-gray-700 font-menu mt-0.5">{order.notes}</p>
                                </div>
                              </div>
                            )}
                            {order.tracking_number && (
                              <div className="flex items-start gap-2">
                                <Package size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-menu font-medium text-gray-500 uppercase tracking-wider">Numero de guia</p>
                                  <p className="text-sm text-gray-700 font-menu mt-0.5">{order.tracking_number}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
