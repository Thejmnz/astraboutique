import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Package, Truck, CreditCard, Check, X, ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-react'

const STATUS_MAP = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  order_confirmed: { label: 'Pedido confirmado', color: 'bg-blue-100 text-blue-800' },
  payment_confirmed: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Expirado', color: 'bg-orange-100 text-orange-800' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingOrder, setEditingOrder] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setOrders(data || [])
    } else {
      console.error('Error fetching orders:', error)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } else {
      console.error('Error updating status:', error)
    }
    setUpdatingStatus(null)
  }

  const updateTrackingNumber = async (orderId) => {
    if (!trackingNumber.trim()) return
    setUpdatingStatus(orderId)
    const { error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber.trim(),
        status: 'shipped',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        tracking_number: trackingNumber.trim(),
        status: 'shipped'
      } : o))
      setEditingOrder(null)
      setTrackingNumber('')
    } else {
      console.error('Error updating tracking:', error)
    }
    setUpdatingStatus(null)
  }

  const recoverOrder = async (orderId) => {
    setUpdatingStatus(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: 'order_confirmed', updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'order_confirmed' } : o))
    }
    setUpdatingStatus(null)
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

  const filteredOrders = orders.filter(order => {
    const displayStatus = getDisplayStatus(order)
    const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter
    const matchesSearch = searchQuery === '' ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getNextStatuses = (order) => {
    const status = getDisplayStatus(order)
    switch (status) {
      case 'pending':
        return ['order_confirmed', 'cancelled']
      case 'order_confirmed':
        return ['payment_confirmed', 'cancelled']
      case 'payment_confirmed':
        return ['shipped', 'cancelled']
      default:
        return []
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Pedidos</h1>
          <p className="text-gray-500 mt-1">Gestiona todos los pedidos de la tienda</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por numero de orden, nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando pedidos...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron pedidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.customer_name} &middot; {order.customer_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_MAP[getDisplayStatus(order)]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_MAP[getDisplayStatus(order)]?.label || order.status}
                      </span>
                      <span className="text-sm font-medium">${Number(order.total).toLocaleString('es-CO')} COP</span>
                      <span className="text-xs text-gray-400 hidden sm:block">{formatDate(order.created_at)}</span>
                      {expandedOrder === order.id
                        ? <ChevronUp size={18} className="text-gray-400" />
                        : <ChevronDown size={18} className="text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Cliente</h4>
                        <div className="space-y-1 text-gray-600">
                          <p>{order.customer_name}</p>
                          <p>{order.customer_email}</p>
                          <p>{order.customer_phone}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Envio</h4>
                        <div className="space-y-1 text-gray-600">
                          {order.shipping_address ? (
                            <>
                              <p>{order.shipping_address}</p>
                              <p>{order.shipping_city}, {order.shipping_state}</p>
                              {order.shipping_zip && <p>{order.shipping_zip}</p>}
                            </>
                          ) : (
                            <p>Recoger en tienda</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{order.shipping_method === 'standard' ? 'Envio Estandar' : order.shipping_method === 'express' ? 'Envio Express' : 'Recoger en tienda'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Pago</h4>
                        <div className="space-y-1 text-gray-600">
                          <p>Nequi</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 text-sm">Productos</h4>
                      <div className="divide-y divide-gray-50">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 text-sm">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt="" className="w-10 h-12 object-cover rounded" />
                              )}
                              <div>
                                <p className="text-gray-700">{item.name}</p>
                                <p className="text-xs text-gray-400">Talla: {item.size} &middot; Cant: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="text-gray-600">${Number(item.price * item.quantity).toLocaleString('es-CO')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span>${Number(order.subtotal).toLocaleString('es-CO')} COP</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Envio</span>
                          <span>{Number(order.shipping_cost) === 0 ? 'Gratis' : `$${Number(order.shipping_cost).toLocaleString('es-CO')} COP`}</span>
                        </div>
                        <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-100">
                          <span>Total</span>
                          <span>${Number(order.total).toLocaleString('es-CO')} COP</span>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1 text-sm">Notas</h4>
                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">{order.notes}</p>
                      </div>
                    )}

                    {order.tracking_number && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1 text-sm">Numero de guia</h4>
                        <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">{order.tracking_number}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400 mr-2">Cambiar estado:</span>
                      {getNextStatuses(order.status).map((status) => (
                        <button
                          key={status}
                          disabled={updatingStatus === order.id}
                          onClick={() => updateOrderStatus(order.id, status)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {STATUS_MAP[status]?.label}
                        </button>
                      ))}
                      {order.status === 'payment_confirmed' && (
                        <div className="flex items-center gap-2 ml-auto">
                          {editingOrder === order.id ? (
                            <>
                              <input
                                type="text"
                                placeholder="Numero de guia"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-40"
                                onKeyDown={(e) => e.key === 'Enter' && updateTrackingNumber(order.id)}
                              />
                              <button
                                onClick={() => updateTrackingNumber(order.id)}
                                disabled={updatingStatus === order.id}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => { setEditingOrder(null); setTrackingNumber('') }}
                                className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setEditingOrder(order.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <Truck size={14} />
                              Agregar guia
                            </button>
                          )}
                        </div>
                      )}
                      {(order.status === 'cancelled' || order.status === 'expired') && (
                        <button
                          disabled={updatingStatus === order.id}
                          onClick={() => recoverOrder(order.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50 ml-auto"
                        >
                          <RotateCcw size={14} />
                          Recuperar pedido
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
