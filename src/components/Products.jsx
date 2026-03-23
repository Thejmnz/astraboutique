import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ChevronRight, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import QuickView from './QuickView'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*), colors(*)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(4)
    setProducts(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <section className="py-16 bg-background-light">
        <div className="w-full px-6">
          <p>Cargando productos...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background-light">
      <div className="w-full px-4 md:px-8">
        <div className="text-left mb-4 pl-2 md:pl-0">
          <h2 className="font-medium tracking-tight mb-2 font-heading text-2xl md:text-3xl" style={{ color: '#251e1a' }}>
            Colecciones 2026
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-2">
          {products.map((product) => (
            <Link key={product.id} to={`/producto/${product.slug || product.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-4">
                {product.images?.[0] && (
                  <img
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    src={product.images[0]}
                  />
                )}
                {product.images?.[1] && (
                  <img
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover scale-105 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    src={product.images[1]}
                  />
                )}
                  {product.is_new && (Date.now() - new Date(product.created_at).getTime() < 15 * 24 * 60 * 60 * 1000) && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">
                      NUEVO
                    </span>
                  )}
                  {product.badge && (
                    <span className="absolute bottom-4 left-4 bg-white text-primary text-[9px] font-bold tracking-wider border border-primary px-2 py-0.5 rounded-full">
                      {product.badge.toUpperCase()}
                    </span>
                  )}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white">
                  <Heart size={16} strokeWidth={0.75} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setQuickViewProduct(product)
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white hidden md:flex"
                >
                  <Eye size={16} strokeWidth={0.75} />
                </button>
              </div>
              <div className="flex flex-col pl-2 -mt-2">
                <h3 className="text-sm font-medium text-gray-800 font-menu">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                    ${product.price?.toLocaleString('es-CO')}
                  </p>
                  {product.colors && (
                    <div className="flex items-center gap-1.5">
                      <img src={product.colors.image_url} alt="" className="w-3.5 h-3.5 rounded-full object-cover border border-gray-200" />
                      {product.colors.name && <p className="text-xs font-menu text-gray-400">{product.colors.name}</p>}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12 px-6">
          <Link
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
            to="/productos"
          >
            VER TODOS LOS JEANS
            <ChevronRight size={14} strokeWidth={0.75} />
          </Link>
        </div>
      </div>
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  )
}
