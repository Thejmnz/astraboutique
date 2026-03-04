import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuKey, setMenuKey] = useState(0)
  const [searchKey, setSearchKey] = useState(0)
  const [randomProducts, setRandomProducts] = useState([])

  const allProducts = [
    { id: 1, name: 'Vortex', price: 189900, image: 'https://images.unsplash.com/photo-1763499390001-6ce9085593c1?q=80&w=764&auto=format&fit=crop' },
    { id: 2, name: 'Cosmos', price: 215000, image: 'https://images.unsplash.com/photo-1621525157051-ecf5241693bf?q=80&w=687&auto=format&fit=crop' },
    { id: 3, name: 'Zenith', price: 249900, image: 'https://plus.unsplash.com/premium_photo-1694618623690-db4ed5c37a2f?q=80&w=687&auto=format&fit=crop' },
    { id: 4, name: 'Aura', price: 175000, image: 'https://images.unsplash.com/photo-1570397369306-f42d7dbce359?q=80&w=687&auto=format&fit=crop' },
    { id: 5, name: 'Ocaso', price: 279900, image: 'https://images.unsplash.com/photo-1584105617768-1154ac9d5053?q=80&w=687&auto=format&fit=crop' },
    { id: 6, name: 'Magma', price: 195000, image: 'https://images.unsplash.com/photo-1674291072795-583f08ab121d?q=80&w=764&auto=format&fit=crop' },
    { id: 7, name: 'Estela', price: 225000, image: 'https://images.unsplash.com/photo-1738618806128-1e313827cd54?q=80&w=687&auto=format&fit=crop' },
    { id: 8, name: 'Prisma', price: 299900, image: 'https://plus.unsplash.com/premium_photo-1690820317364-3e22c2f68eb4?q=80&w=687&auto=format&fit=crop' },
  ]

  useEffect(() => {
    if (searchOpen) {
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random())
      setRandomProducts(shuffled.slice(0, 2))
    }
  }, [searchOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      setMenuKey(prev => prev + 1)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden'
      setSearchKey(prev => prev + 1)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [searchOpen])

  return (
    <header 
      style={{ 
        position: 'absolute', 
        top: 16,
        left: 0, 
        right: 0, 
        zIndex: 9999, 
        backgroundColor: 'transparent'
      }}
      className="md:!top-4 !top-4"
    >
      <div className="w-full px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <button className="hover:text-primary transition-colors md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} strokeWidth={0.75} /> : <Menu size={20} strokeWidth={0.75} />}
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800 font-menu normal-case flex-shrink-0">
            <Link className="hover:text-primary transition-colors whitespace-nowrap" to="/">Popular</Link>
            <Link className="hover:text-primary transition-colors whitespace-nowrap" to="/">Nuevos</Link>
            <Link className="hover:text-primary transition-colors whitespace-nowrap" to="/">Ofertas</Link>
          </nav>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Astra Boutique" className="h-6" />
          </Link>
        </div>
        <div className="flex items-center gap-5 justify-end flex-shrink-0">
          <button className="hover:text-primary transition-colors flex items-center" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} strokeWidth={0.75} />
          </button>
          <button className="relative hover:text-primary transition-colors flex">
            <ShoppingCart size={20} strokeWidth={0.75} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </button>
          <button className="hover:text-primary transition-colors hidden md:flex">
            <Heart size={20} strokeWidth={0.75} />
          </button>
          <button className="hover:text-primary transition-colors hidden md:flex">
            <User size={20} strokeWidth={0.75} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[9998] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-full z-[9999] md:hidden transform transition-transform duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#F8F5F1' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Astra Boutique" className="h-6" />
            </Link>
            <button 
              className="hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={16} strokeWidth={0.75} />
            </button>
          </div>

          <nav className="flex flex-col px-6 pt-8 gap-4">
            <Link 
              key={`popular-${menuKey}`}
              className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Popular
            </Link>
            <Link 
              key={`nuevos-${menuKey}`}
              className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case"
              style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Nuevos
            </Link>
            <Link 
              key={`ofertas-${menuKey}`}
              className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case"
              style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Ofertas
            </Link>
          </nav>
        </div>
      </div>
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[9998]"
          onClick={() => setSearchOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-full z-[9999] transform transition-opacity duration-500 ease-out ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#F8F5F1' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to="/" className="flex items-center" onClick={() => setSearchOpen(false)}>
              <img src="/logo.png" alt="Astra Boutique" className="h-6" />
            </Link>
            <button 
              className="hover:text-primary transition-colors"
              onClick={() => setSearchOpen(false)}
            >
              <X size={16} strokeWidth={0.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div 
              key={`search-input-${searchKey}`}
              className="transform translate-y-4 opacity-0 animate-fadeInUp"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <div className="relative flex items-center mb-12">
                <Search className="absolute left-4 text-gray-400" size={20} strokeWidth={0.75} />
                <input 
                  className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-4 text-base font-menu focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Buscar productos..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <h3 
                key={`search-title-${searchKey}`}
                className="text-sm font-medium text-gray-800 font-menu mb-6 transform translate-y-4 opacity-0 animate-fadeInUp"
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
              >
                Búsqueda rápida
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {randomProducts.map((product, index) => (
                  <Link
                    key={`product-${searchKey}-${product.id}`}
                    to={`/producto/${product.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="group cursor-pointer transform translate-y-4 opacity-0 animate-fadeInUp"
                    style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 font-menu">{product.name}</h3>
                    <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                      ${product.price.toLocaleString('es-CO')} COP
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
