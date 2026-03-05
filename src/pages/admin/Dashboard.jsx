import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { data: sizes } = await supabase
      .from('product_sizes')
      .select('stock')
      .lt('stock', 5)

    setStats({
      products: productsCount || 0,
      lowStock: sizes?.length || 0
    })
    setLoading(false)
  }

  const statCards = [
    { label: 'Productos', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Stock bajo', value: stats.lowStock, icon: TrendingUp, color: 'bg-red-50 text-red-600' },
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}
