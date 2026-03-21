import { useState, useEffect } from 'react'
import { X, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, wishlistCount } = useWishlist()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] transition-opacity duration-300 ${
        isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsWishlistOpen(false)}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-white transform transition-transform duration-300 flex flex-col ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={20} strokeWidth={0.75} />
              <h2 className="text-lg font-menu font-medium">
                Lista de deseos {wishlistCount > 0 && `(${wishlistCount})`}
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart size={48} strokeWidth={0.5} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-menu mb-4">Tu lista de deseos está vacía</p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="text-primary font-menu underline text-sm hover:opacity-70"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-100"
                >
                  <Link
                    to={`/producto/${item.slug}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="w-20 h-28 bg-gray-100 flex-shrink-0 overflow-hidden"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/producto/${item.slug}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-sm font-menu font-medium text-gray-800 truncate block hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-menu text-primary mt-1">
                      ${item.price?.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
