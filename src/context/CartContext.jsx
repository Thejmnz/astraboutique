import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch {
    return []
  }
}

function matchItem(item, productId, size, colorId) {
  return item.productId === productId && item.size === size && (item.colorId || null) === (colorId || null)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => getInitialCart().map(item => ({
    ...item,
    colorId: item.colorId || null,
    colorName: item.colorName || null,
  })))
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size, quantity = 1, color = null) => {
    const cId = color?.id || null
    const effectivePrice = (product.on_sale && product.sale_price) ? product.sale_price : product.price
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => matchItem(item, product.id, size, cId)
      )

      if (existingIndex > -1) {
        const newCart = [...prevCart]
        newCart[existingIndex].quantity += quantity
        return newCart
      }

      return [...prevCart, {
        productId: product.id,
        name: product.name,
        price: effectivePrice,
        originalPrice: (product.on_sale && product.sale_price) ? product.price : null,
        size: size,
        colorId: cId,
        colorName: color?.name || null,
        colorHex: color?.hex || null,
        colorImage: color?.image_url || null,
        image: product.images?.[0],
        quantity: quantity,
      }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId, size, colorId = null) => {
    setCart(prevCart => prevCart.filter(
      item => !matchItem(item, productId, size, colorId)
    ))
  }

  const updateQuantity = (productId, size, quantity, colorId = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorId)
      return
    }
    setCart(prevCart => prevCart.map(item =>
      matchItem(item, productId, size, colorId)
        ? { ...item, quantity }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
