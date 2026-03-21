import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWishlist } from '../context/WishlistContext'

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'all')
  const [availableSizes, setAvailableSizes] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    const sort = searchParams.get('sort') || 'all'
    setSortBy(sort)
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .order('created_at', { ascending: false })
    setProducts(data || [])

    const sizes = new Set()
    ;(data || []).forEach(p => {
      (p.product_sizes || []).forEach(s => {
        if (s.stock > 0) sizes.add(s.size)
      })
    })
    setAvailableSizes([...sizes].sort())
    setLoading(false)
  }

  const activeFilters = useMemo(() => {
    const f = []
    if (selectedColor) {
      const product = products.find(p => p.color === selectedColor)
      f.push({ label: product?.color_name || selectedColor, clear: () => setSelectedColor(null) })
    }
    if (selectedSize) {
      f.push({ label: `Talla ${selectedSize}`, clear: () => setSelectedSize(null) })
    }
    return f
  }, [selectedColor, selectedSize])

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedColor) {
      result = result.filter(p => p.color === selectedColor)
    }

    if (selectedSize) {
      result = result.filter(p =>
        p.product_sizes?.some(s => s.size === selectedSize && s.stock > 0)
      )
    }

    switch (sortBy) {
      case 'newest':
        result = result.filter(p => p.is_new && (Date.now() - new Date(p.created_at).getTime() < 15 * 24 * 60 * 60 * 1000))
        break
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'newest':
      default:
        break
    }

    return result
  }, [products, selectedColor, selectedSize, sortBy])

  const clearAll = () => {
    setSelectedColor(null)
    setSelectedSize(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <p className="font-menu">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light tracking-tight" style={{ color: '#251e1a' }}>
              {sortBy === 'price_asc' ? 'Ofertas' : sortBy === 'popular' ? 'Populares' : sortBy === 'newest' ? 'Nuevos' : 'Productos'}
            </h1>
            <p className="text-sm text-gray-500 font-menu mt-1">{filtered.length} productos</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-menu bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="newest">Mas recientes</option>
              <option value="popular">Populares</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-menu transition-colors ${
                showFilters ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {products
                    .filter((p, i, arr) => p.color && arr.findIndex(x => x.color === p.color) === i)
                    .map((p) => (
                      <button
                        key={p.color}
                        onClick={() => setSelectedColor(selectedColor === p.color ? null : p.color)}
                        className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${
                          selectedColor === p.color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'
                        }`}
                        style={{
                          borderColor: selectedColor === p.color ? '#251E1A' : '#e5e7eb'
                        }}
                        title={p.color_name || 'Color'}
                      >
                        <img src={p.color} alt={p.color_name || ''} className="w-full h-full object-cover" />
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Talla</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`w-10 h-10 text-xs font-menu border-2 transition-all ${
                        selectedSize === size
                          ? 'border-[#251E1A] bg-[#251E1A] text-white'
                          : 'border-gray-200 hover:border-[#251E1A]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-menu rounded-full hover:bg-gray-200 transition-colors"
              >
                {f.label}
                <X size={12} />
              </button>
            ))}
            <button
              onClick={clearAll}
              className="text-xs font-menu text-gray-500 hover:text-gray-700 underline ml-1"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-menu mb-4">No se encontraron productos con los filtros seleccionados.</p>
            <button
              onClick={clearAll}
              className="text-primary hover:underline text-sm font-menu"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {filtered.map((product) => (
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
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWishlist(product)
                    }}
                    className={`absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white ${
                      isInWishlist(product.id) ? '!bg-red-500 !text-white opacity-100' : ''
                    }`}
                  >
                    <Heart size={16} strokeWidth={0.75} className={isInWishlist(product.id) ? 'fill-white' : ''} />
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
                      {product.color && (
                        <div className="flex items-center gap-1.5">
                          <img src={product.color} alt="" className="w-3.5 h-3.5 rounded-full object-cover border border-gray-200" />
                          {product.color_name && <p className="text-xs font-menu text-gray-400">{product.color_name}</p>}
                        </div>
                      )}
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
