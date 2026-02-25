import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchOpen && !e.target.closest('.search-dropdown')) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-2 hidden md:flex justify-between items-center text-[11px] uppercase tracking-widest text-gray-500">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
            Colombia (COP $)
            <span className="material-icons-outlined text-sm">expand_more</span>
          </span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
            Español
            <span className="material-icons-outlined text-sm">expand_more</span>
          </span>
        </div>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">Facebook</a>
          <a className="hover:text-primary transition-colors" href="#">Instagram</a>
          <a className="hover:text-primary transition-colors" href="#">TikTok</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Astra <span className="text-primary italic font-display text-3xl font-semibold">Boutique</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest text-gray-800">
          <Link className="hover:text-primary transition-colors" to="/">POPULAR</Link>
          <Link className="relative group" to="/">
            NUEVOS
            <span className="absolute -top-3 -right-4 bg-primary text-white text-[8px] px-1 rounded-sm">NEW</span>
          </Link>
          <Link className="hover:text-primary transition-colors" to="/">OFERTAS</Link>
        </nav>
        <div className="flex items-center gap-5 flex-1 justify-end">
          <div className="relative search-dropdown hidden md:block">
            <button className="hover:text-primary transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
              <span className="material-icons-outlined">search</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
                <div className="relative">
                  <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                  <input 
                    className="w-full bg-background-light border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:outline-none" 
                    placeholder="Buscar productos..." 
                    type="text"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>
          <button className="relative hover:text-primary transition-colors hidden md:flex">
            <span className="material-icons-outlined">shopping_cart</span>
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </button>
          <button className="hover:text-primary transition-colors hidden md:flex">
            <span className="material-icons-outlined">favorite_border</span>
          </button>
          <button className="hover:text-primary transition-colors hidden md:flex">
            <span className="material-icons-outlined">person_outline</span>
          </button>
          <button className="hover:text-primary transition-colors md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-icons-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold tracking-widest text-gray-800">
            <Link className="hover:text-primary transition-colors py-2" to="/" onClick={() => setMobileMenuOpen(false)}>POPULAR</Link>
            <Link className="hover:text-primary transition-colors py-2 flex items-center gap-2" to="/" onClick={() => setMobileMenuOpen(false)}>
              NUEVOS
              <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-sm">NEW</span>
            </Link>
            <Link className="hover:text-primary transition-colors py-2" to="/" onClick={() => setMobileMenuOpen(false)}>OFERTAS</Link>
          </nav>
          <div className="px-6 pb-4">
            <div className="relative mb-4">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input 
                className="w-full bg-background-light border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:outline-none" 
                placeholder="Buscar productos..." 
                type="text"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="relative hover:text-primary transition-colors">
                  <span className="material-icons-outlined">shopping_cart</span>
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
                </button>
                <button className="hover:text-primary transition-colors">
                  <span className="material-icons-outlined">favorite_border</span>
                </button>
                <button className="hover:text-primary transition-colors">
                  <span className="material-icons-outlined">person_outline</span>
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Colombia (COP $) | Español
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
