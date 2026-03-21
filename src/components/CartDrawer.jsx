import { useState, useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] transition-opacity duration-300 ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsCartOpen(false)}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-white transform transition-transform duration-300 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} strokeWidth={0.75} />
              <h2 className="text-lg font-menu font-medium">
                Carrito {cartCount > 0 && `(${cartCount})`}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} strokeWidth={0.5} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-menu mb-4">Tu carrito está vacío</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-primary font-menu underline text-sm hover:opacity-70"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex gap-4 pb-4 border-b border-gray-100"
                >
                  <div className="w-20 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-menu font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-menu text-gray-500 mt-1">
                      Talla: {item.size}
                    </p>
                    <p className="text-sm font-menu text-primary mt-1">
                      ${item.price?.toLocaleString('es-CO')} COP
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-xs font-menu">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-menu text-gray-600">Subtotal</span>
              <span className="text-base font-menu font-medium">
                ${cartTotal.toLocaleString('es-CO')} COP
              </span>
            </div>
            <p className="text-xs font-menu text-gray-500 mb-4">
              Envío e impuestos calculados en el checkout
            </p>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-white py-3 text-sm font-menu hover:opacity-90 transition-all duration-300 text-center"
              style={{ backgroundColor: '#251E1A' }}
            >
              Pagar
            </Link>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center text-sm font-menu text-gray-600 hover:text-gray-800 mt-3 underline"
            >
              Ver detalle del pedido
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
