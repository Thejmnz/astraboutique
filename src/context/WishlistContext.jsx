import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

function getInitialWishlist() {
  try {
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getInitialWishlist)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.id === product.id)
      if (exists) return prevWishlist
      return [...prevWishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        slug: product.slug,
      }]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
      isWishlistOpen,
      setIsWishlistOpen,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
