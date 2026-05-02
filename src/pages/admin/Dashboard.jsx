import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Package, ShoppingBag, TrendingUp, Users, DollarSign, Clock, AlertTriangle, Eye, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'

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
  const [stockByCategory, setStockByCategory] = useState([])
  const [expandedCats, setExpandedCats] = useState({})
  const [sizeFilter, setSizeFilter] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchStockByCategory()
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

  const fetchStockByCategory = async () => {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, code, images, price, categories(id, name), product_sizes(size, stock)')
      .or('archived.is.null,archived.eq.false')
      .order('name')

    if (!products) return

    const catMap = {}
    products.forEach(p => {
      const catId = p.categories?.id || 'sin_cat'
      const catName = p.categories?.name || 'Sin categoría'
      if (!catMap[catId]) catMap[catId] = { id: catId, name: catName, products: [] }
      catMap[catId].products.push(p)
    })

    const result = Object.values(catMap).map(cat => {
      const totalStock = cat.products.reduce((sum, p) => sum + (p.product_sizes || []).reduce((s, ps) => s + ps.stock, 0), 0)
      return { ...cat, totalStock }
    }).sort((a, b) => a.name.localeCompare(b.name))

    setStockByCategory(result)
    setExpandedCats({})
  }

  const toggleCat = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }))
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
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen de tu tienda</p>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2.5 sm:p-3 rounded-lg ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-medium">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-100 mb-8">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">Stock por categoría</h2>
                <p className="text-sm text-gray-400 mt-1">Cada referencia con sus tallas y unidades disponibles</p>
              </div>
              <div className="divide-y divide-gray-100">
                {stockByCategory.map(cat => (
                  <div key={cat.id}>
                    <button
                      onClick={() => toggleCat(cat.id)}
                      className="w-full flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandedCats[cat.id] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                        <span className="font-medium text-gray-800">{cat.name}</span>
                        <span className="text-xs text-gray-400">({cat.products.length} {cat.products.length === 1 ? 'producto' : 'productos'})</span>
                      </div>
                      <span className={`text-sm font-bold ${cat.totalStock === 0 ? 'text-red-600' : cat.totalStock < 5 ? 'text-orange-500' : 'text-gray-600'}`}>
                        {cat.totalStock} uds
                      </span>
                    </button>
                    {expandedCats[cat.id] && (
                      <div className="px-4 sm:px-6 pb-4">
                        {(() => {
                          const allSizes = [...new Set(cat.products.flatMap(p => (p.product_sizes || []).map(ps => ps.size)))].sort((a, b) => {
                            const na = parseFloat(a), nb = parseFloat(b)
                            if (!isNaN(na) && !isNaN(nb)) return na - nb
                            return a.localeCompare(b)
                          })
                          const activeFilter = sizeFilter[cat.id] || null
                          const filtered = activeFilter
                            ? cat.products.filter(p => (p.product_sizes || []).some(ps => ps.size === activeFilter && ps.stock > 0))
                            : cat.products
                          return (
                            <>
                              {allSizes.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  <button
                                    onClick={() => setSizeFilter(prev => ({ ...prev, [cat.id]: null }))}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                      !activeFilter ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    Todos
                                  </button>
                                  {allSizes.map(s => {
                                    const count = cat.products.reduce((sum, p) => {
                                      const ps = (p.product_sizes || []).find(x => x.size === s)
                                      return sum + (ps && ps.stock > 0 ? 1 : 0)
                                    }, 0)
                                    if (count === 0) return null
                                    return (
                                      <button
                                        key={s}
                                        onClick={() => setSizeFilter(prev => ({ ...prev, [cat.id]: s }))}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                          activeFilter === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                      >
                                        {s} <span className="text-[10px] opacity-70">({count})</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-100">
                                      <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500 w-12"></th>
                                      <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500">Referencia</th>
                                      <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500">Código</th>
                                      <th className="text-left py-2 pr-3 text-xs font-medium text-gray-500">Precio</th>
                                      <th className="text-left py-2 text-xs font-medium text-gray-500">Tallas / Stock</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {filtered.map(p => {
                                      const sizes = p.product_sizes || []
                                      return (
                                        <tr key={p.id} className="hover:bg-gray-50/50">
                                          <td className="py-2 pr-3">
                                            <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                              {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                          </td>
                                          <td className="py-2 pr-3">
                                            <span className="font-medium text-gray-800">{p.name}</span>
                                          </td>
                                          <td className="py-2 pr-3 text-gray-500">{p.code || '-'}</td>
                                          <td className="py-2 pr-3 text-gray-600">{formatCurrency(p.price)}</td>
                                          <td className="py-2">
                                            {sizes.length === 0 ? (
                                              <span className="text-gray-400 text-xs">Sin tallas</span>
                                            ) : (
                                              <div className="flex flex-wrap gap-1">
                                                {sizes.sort((a, b) => {
                                                  const na = parseFloat(a.size), nb = parseFloat(b.size)
                                                  if (!isNaN(na) && !isNaN(nb)) return na - nb
                                                  return a.size.localeCompare(b.size)
                                                }).map(ps => (
                                                  <span
                                                    key={ps.size}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                                      ps.stock === 0 ? 'bg-red-100 text-red-700'
                                                      : ps.stock <= 3 ? 'bg-orange-100 text-orange-700'
                                                      : 'bg-green-100 text-green-700'
                                                    }`}
                                                  >
                                                    {ps.size}: {ps.stock}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    })}
                                    {filtered.length === 0 && (
                                      <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-400 text-xs">Sin productos disponibles en esta talla</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                ))}
                {stockByCategory.length === 0 && (
                  <div className="p-8 text-center text-gray-400">No hay productos</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
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
                  <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
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
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
