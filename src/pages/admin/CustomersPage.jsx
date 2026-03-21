import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [ordersByCustomer, setOrdersByCustomer] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const { data: orders } = await supabase
      .from('orders')
      .select('customer_name, customer_email, customer_phone, created_at, total, status')
      .order('created_at', { ascending: false })

    const customerMap = {}

    ;(orders || []).forEach(order => {
      const email = order.customer_email
      if (!email) return

      if (!customerMap[email]) {
        customerMap[email] = {
          name: order.customer_name || '',
          email: order.customer_email,
          phone: order.customer_phone || '',
          firstOrder: order.created_at,
          lastOrder: order.created_at,
          totalSpent: 0,
          orderCount: 0,
          cancelledCount: 0,
          orders: [],
        }
      }

      const c = customerMap[email]
      c.orderCount++
      c.orders.push(order)

      if (new Date(order.created_at) < new Date(c.firstOrder)) {
        c.firstOrder = order.created_at
      }
      if (new Date(order.created_at) > new Date(c.lastOrder)) {
        c.lastOrder = order.created_at
      }

      if (order.status !== 'cancelled') {
        c.totalSpent += order.total || 0
      } else {
        c.cancelledCount++
      }
    })

    const list = Object.values(customerMap).sort((a, b) =>
      new Date(b.lastOrder) - new Date(a.lastOrder)
    )

    setCustomers(list)
    setLoading(false)
  }

  const filtered = customers.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  })

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Usuarios</h1>
          <p className="text-gray-500 mt-1">{customers.length} clientes registrados</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o telefono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
            <Users size={48} strokeWidth={0.5} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total gastado</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Ultimo pedido</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.email} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                          {(customer.name || customer.email)?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{customer.name || 'Sin nombre'}</p>
                          <p className="text-xs text-gray-400">{formatDate(customer.firstOrder)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <ShoppingBag size={14} className="text-gray-400" />
                        <span className="text-sm font-medium">{customer.orderCount}</span>
                      </div>
                      {customer.cancelledCount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">{customer.cancelledCount} cancelado(s)</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium">${Number(customer.totalSpent).toLocaleString('es-CO')}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(customer.lastOrder)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
