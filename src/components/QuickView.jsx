import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [error, setError] = useState('')
  const [openAccordion, setOpenAccordion] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const allSizes = product.product_sizes || []

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Selecciona una talla')
      return
    }
    const sizeData = allSizes.find(s => s.size === selectedSize)
    if (!sizeData || sizeData.stock === 0) {
      setError('Talla no disponible')
      return
    }
    setError('')
    addToCart(product, selectedSize, 1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[85vh]">
          <div className="relative aspect-[2/3] md:aspect-auto bg-gray-100 overflow-hidden">
            {product.images?.[selectedImage] && (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImage === idx ? 'bg-primary' : 'bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center md:overflow-y-auto">
            <h2 className="text-2xl font-heading font-light tracking-tight mb-2">{product.name}</h2>
            <p className="text-lg font-menu mb-4">${product.price?.toLocaleString('es-CO')}</p>

            {product.description && (
              <p className="text-gray-500 text-sm font-menu mb-6 leading-relaxed">{product.description}</p>
            )}

            {product.colors && (
              <div className="flex items-center gap-2 mb-4">
                <img src={product.colors.image_url} alt="" className="w-4 h-4 rounded-full object-cover border border-gray-200" />
                {product.colors.name && <span className="text-sm text-gray-500 font-menu">{product.colors.name}</span>}
              </div>
            )}

            {allSizes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Talla</p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((ps) => {
                    const out = ps.stock === 0
                    return (
                      <button
                        key={ps.id}
                        onClick={() => !out && setSelectedSize(ps.size)}
                        disabled={out}
                        className={`w-10 h-10 border-2 text-xs font-menu transition-all relative ${
                          out
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedSize === ps.size
                              ? 'border-[#251E1A] bg-[#251E1A] text-white'
                              : 'border-gray-200 hover:border-[#251E1A]'
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {ps.size}
                        {out && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg width="100%" height="100%" className="absolute">
                              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-xs font-menu mb-3">{error}</p>}

            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 text-white py-3.5 text-sm font-menu hover:opacity-90 transition-all"
                style={{ backgroundColor: '#251E1A' }}
              >
                Agregar al Carrito
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="w-12 h-12 flex items-center justify-center hover:opacity-90 transition-all"
                style={{
                  backgroundColor: isInWishlist(product.id) ? '#ef4444' : '#251E1A',
                  borderRadius: 0
                }}
              >
                <Heart size={18} strokeWidth={0.75} className={`text-white ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
              </button>
            </div>

            {product.design_notes && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <span className="text-xs font-medium text-gray-800 block mb-2">Notas de Diseno</span>
                <div className="pb-3 text-xs text-gray-600 font-menu product-notes-display">
                  <div dangerouslySetInnerHTML={{ __html: product.design_notes }} />
                </div>
              </div>
            )}

            <Link
              to={`/producto/${product.slug || product.id}`}
              onClick={onClose}
              className="text-center text-xs font-medium text-gray-500 hover:text-primary transition-colors underline"
            >
              Ver producto completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
