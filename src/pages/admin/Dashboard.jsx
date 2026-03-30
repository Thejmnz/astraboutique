import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Package, ShoppingBag, TrendingUp, Users, DollarSign, Clock, AlertTriangle, Eye, ArrowRight } from 'lucide-react'

const formatCurrency = (value) => {
  return '$' + Number(value).toLocaleString('es-CO')
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
    totalViews: 0,
    topProduct: null,
    recentOrders: [],
    lowStockProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [
      { count: productsCount },
      { data: lowStockSizes },
      { data: allOrders },
      { data: allProducts },
      { data: customerEmails }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('product_sizes').select('product_id, stock, products(name, images)').lt('stock', 5).limit(10),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('products').select('id, name, views, images, price'),
      supabase.from('orders').select('customer_email')
    ])

    const totalOrders = allOrders || []
    const pendingOrders = totalOrders.filter(o => o.status === 'pending')
    const now = Date.now()
    const expiredOrders = totalOrders.filter(o => o.status === 'pending' && (now - new Date(o.created_at).getTime()) > 15 * 60 * 1000)
    const realPending = pendingOrders.length - expiredOrders.length
    const shippedOrders = totalOrders.filter(o => o.status === 'shipped')
    const cancelledOrders = totalOrders.filter(o => o.status === 'cancelled')
    const confirmedOrders = totalOrders.filter(o => o.status === 'payment_confirmed' || o.status === 'shipped')
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalViews = (allProducts || []).reduce((sum, p) => sum + (p.views || 0), 0)

    const sortedProducts = [...(allProducts || [])].sort((a, b) => (b.views || 0) - (a.views || 0))
    const topProduct = sortedProducts[0] || null

    const recentOrders = totalOrders.slice(0, 5)

    const uniqueEmails = new Set((customerEmails || []).map(o => o.customer_email).filter(Boolean))
    const customerCount = uniqueEmails.size
    const productIdsLow = [...new Set((lowStockSizes || []).map(s => s.product_id))]
    const lowStockProducts = productIdsLow.map(id => {
      const item = lowStockSizes.find(s => s.product_id === id)
      return item?.products
    }).filter(Boolean).slice(0, 5)

    setStats({
      products: productsCount || 0,
      lowStock: lowStockSizes?.length || 0,
      totalOrders: totalOrders.length,
      totalRevenue,
      pendingOrders: realPending,
      shippedOrders: shippedOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalViews,
      topProduct,
      recentOrders,
      lowStockProducts
    })
    setLoading(false)
  }

  const isOrderExpired = (order) => {
    if (order.status !== 'pending') return false
    return (Date.now() - new Date(order.created_at).getTime()) > 15 * 60 * 1000
  }

  const getDisplayStatus = (order) => {
    return isOrderExpired(order) ? 'expired' : order.status
  }

  const STATUS_MAP = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    order_confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
    payment_confirmed: { label: 'Pago confirmado', color: 'bg-green-100 text-green-800' },
    shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    expired: { label: 'Expirado', color: 'bg-orange-100 text-orange-800' },
  }

  const statCards = [
    { label: 'Productos', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Stock bajo', value: stats.lowStock, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen de tu tienda</p>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-medium">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Pedidos recientes</h2>
                  <Link to="/admin/pedidos" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Ver todos <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay pedidos</p>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{order.order_number}</p>
                          <p className="text-xs text-gray-400">{order.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_MAP[getDisplayStatus(order)]?.color || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_MAP[getDisplayStatus(order)]?.label || order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {stats.topProduct && (
                  <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-medium mb-4">Producto mas visto</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {stats.topProduct.images?.[0] && (
                          <img src={stats.topProduct.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{stats.topProduct.name}</p>
                        <p className="text-sm text-gray-400">{stats.topProduct.views} vistas</p>
                        <p className="text-sm font-medium mt-1">{formatCurrency(stats.topProduct.price)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {stats.lowStockProducts.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Stock bajo</h2>
                      <Link to="/admin/productos" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        Ver productos <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {stats.lowStockProducts.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {product.images?.[0] && (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <p className="text-sm font-medium">{product.name}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Bajo stock</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
