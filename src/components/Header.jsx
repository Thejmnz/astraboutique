import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart()
  const { wishlistCount, setIsWishlistOpen } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuKey, setMenuKey] = useState(0)
  const [searchKey, setSearchKey] = useState(0)
  const [randomProducts, setRandomProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (searchOpen) {
      fetchRandomProducts()
      setSearchQuery('')
      setSearchResults([])
    }
  }, [searchOpen])

  const fetchRandomProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, price, images')
      .limit(4)
    
    if (data) {
      setRandomProducts(data.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.images?.[0]
      })))
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true)
        const q = searchQuery.trim()
        const [res1, res2, res3, res4] = await Promise.all([
          supabase.from('products').select('id, name, slug, price, images, colors(name)').ilike('name', `%${q}%`),
          supabase.from('products').select('id, name, slug, price, images, colors(name)').ilike('description', `%${q}%`),
          supabase.from('products').select('id, name, slug, price, images, colors(name)').ilike('code', `%${q}%`),
          supabase.from('products').select('id, name, slug, price, images, colors(name)').ilike('color_name', `%${q}%`),
        ])
        const all = [...(res1.data || []), ...(res2.data || []), ...(res3.data || []), ...(res4.data || [])]
        const seen = new Set()
        const data = all.filter(p => {
          if (seen.has(p.id)) return false
          seen.add(p.id)
          return true
        }).slice(0, 4)
        setSearchResults((data || []).map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.images?.[0]
        })))
        setSearching(false)
      } else {
        setSearchResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

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
            <Link className="hover:text-primary transition-colors whitespace-nowrap" to="/productos">Productos</Link>
            <Link className="hover:text-primary transition-colors whitespace-nowrap" to="/productos?sort=newest">Nuevos</Link>
          </nav>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Astra Boutique" className="h-9 md:h-16" />
          </Link>
        </div>
        <div className="flex items-center gap-5 justify-end flex-shrink-0">
          <button className="hover:text-primary transition-colors flex items-center" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20} strokeWidth={0.75} />
          </button>
          <button className="relative hover:text-primary transition-colors flex" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} strokeWidth={0.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
            )}
          </button>
          <Link to="/cuenta" className="hover:text-primary transition-colors flex">
            <User size={20} strokeWidth={0.75} />
          </Link>
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
              <img src="/logo.png" alt="Astra Boutique" className="h-9 md:h-16" />
            </Link>
            <button 
              className="hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={16} strokeWidth={0.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col px-6 pt-8 gap-4">
              <Link 
                key={`productos-${menuKey}`}
                className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case"
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                to="/productos" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                key={`nuevos-${menuKey}`}
                className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case"
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                to="/productos?sort=newest" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Nuevos
              </Link>
              <button 
                className="text-sm font-medium text-gray-800 font-menu hover:text-primary transition-all transform translate-y-4 opacity-0 animate-fadeInUp normal-case flex items-center gap-2"
                style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
                onClick={() => { setIsWishlistOpen(true); setMobileMenuOpen(false) }}
              >
                Lista de deseos
                {wishlistCount > 0 && (
                  <span className="bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>
                )}
              </button>
            </nav>

            <div className="px-6 mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs font-medium mb-4" style={{ opacity: 0.4 }}>CONTACTO</p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/573155614103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +57 315 5614103
                </a>
                <a
                  href="mailto:hello@astraboutique.store"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[16px] h-[16px]">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                  </svg>
                  hello@astraboutique.store
                </a>
                <p className="flex items-center gap-3 text-sm text-gray-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[16px] h-[16px]">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Lun - Sab: 9:00 A.M. - 6:00 P.M.
                </p>
              </div>
            </div>

            <div className="px-6 mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs font-medium mb-4" style={{ opacity: 0.4 }}>SIGUENOS</p>
              <div className="flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/astraboutiquestore/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 border-t border-gray-100">
            <a
              href="https://wa.me/573155614103"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribenos por WhatsApp
            </a>
          </div>
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
              <img src="/logo.png" alt="Astra Boutique" className="h-9 md:h-16" />
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

            {searchQuery.trim().length >= 2 && (
              <div>
                <h3 className="text-sm font-medium text-gray-800 font-menu mb-6">
                  {searching ? 'Buscando...' : searchResults.length > 0 ? `Resultados para "${searchQuery}"` : `Sin resultados para "${searchQuery}"`}
                </h3>
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {searchResults.map((product) => (
                      <Link
                        key={`result-${product.id}`}
                        to={`/producto/${product.slug || product.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-3">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 font-menu">{product.name}</h3>
                        <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                          ${product.price?.toLocaleString('es-CO')} COP
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {searchQuery.trim().length < 2 && randomProducts.length > 0 && (
              <div>
                <h3 
                  key={`search-title-${searchKey}`}
                  className="text-sm font-medium text-gray-800 font-menu mb-6 transform translate-y-4 opacity-0 animate-fadeInUp"
                  style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                  Búsqueda rápida
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {randomProducts.map((product, index) => (
                    <Link
                      key={`product-${searchKey}-${product.id}`}
                      to={`/producto/${product.slug || product.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="group cursor-pointer transform translate-y-4 opacity-0 animate-fadeInUp"
                      style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-3">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 font-menu">{product.name}</h3>
                      <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                        ${product.price?.toLocaleString('es-CO')} COP
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.trim().length < 2 && randomProducts.length === 0 && (
              <p className="text-gray-500 text-center">No hay productos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
