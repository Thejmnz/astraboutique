import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWishlist } from '../context/WishlistContext'

const COLORS = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#6B7280' },
  { name: 'Rojo', hex: '#EF4444' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Naranja', hex: '#F97316' },
  { name: 'Amarillo', hex: '#EAB308' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Morado', hex: '#8B5CF6' },
  { name: 'Marrón', hex: '#92400E' },
  { name: 'Beige', hex: '#D4B896' },
  { name: 'Nude', hex: '#E8C4A2' },
  { name: 'Dorado', hex: '#CAA247' },
  { name: 'Plata', hex: '#C0C0C0' },
  { name: 'Azul Marino', hex: '#1E3A5A' },
  { name: 'Verde Oliva', hex: '#556B2F' },
  { name: 'Borgoña', hex: '#800020' },
]

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [availableSizes, setAvailableSizes] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const { isInWishlist, toggleWishlist } = useWishlist()

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
      const c = COLORS.find(c => c.hex === selectedColor)
      f.push({ label: c?.name || selectedColor, clear: () => setSelectedColor(null) })
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
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
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
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-light tracking-tight" style={{ color: '#251e1a' }}>
              Productos
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
                  {COLORS.map((c) => {
                    const hasProducts = products.some(p => p.color === c.hex)
                    if (!hasProducts) return null
                    return (
                      <button
                        key={c.hex}
                        onClick={() => setSelectedColor(selectedColor === c.hex ? null : c.hex)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === c.hex ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'
                        }`}
                        style={{
                          backgroundColor: c.hex,
                          borderColor: selectedColor === c.hex ? c.hex : '#e5e7eb',
                          ...(c.hex === '#FFFFFF' ? { ringColor: c.hex, boxShadow: '0 0 0 1px #e5e7eb' } : {})
                        }}
                        title={c.name}
                      />
                    )
                  })}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filtered.map((product) => (
              <Link key={product.id} to={`/producto/${product.slug || product.id}`} className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-4">
                  {product.images?.[0] && (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.images[0]}
                    />
                  )}
                  {product.is_new && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">
                      NUEVO
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
                <div className="flex flex-col pl-1">
                  <h3 className="text-sm font-medium text-gray-800 font-menu">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                      ${product.price?.toLocaleString('es-CO')}
                    </p>
                    {product.badge && (
                      <span className="text-[9px] font-bold tracking-wider text-primary border border-primary px-2 py-0.5 rounded-full">
                        {product.badge.toUpperCase()}
                      </span>
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
