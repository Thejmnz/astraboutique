import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, Plus, LogOut, LayoutDashboard, ClipboardList, Link2, Users, Image, Tag, DollarSign, Menu, X } from 'lucide-react'

export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'products', label: 'Productos', icon: Package, path: '/admin/productos' },
    { id: 'categories', label: 'Categorias', icon: Tag, path: '/admin/categorias' },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList, path: '/admin/pedidos' },
    { id: 'finanzas', label: 'Finanzas', icon: DollarSign, path: '/admin/finanzas' },
    { id: 'customers', label: 'Usuarios', icon: Users, path: '/admin/usuarios' },
    { id: 'hero', label: 'Hero', icon: Image, path: '/admin/hero' },
    { id: 'links', label: 'Link en Bio', icon: Link2, path: '/admin/links' },
    { id: 'add-product', label: 'Agregar producto', icon: Plus, path: '/admin/productos/nuevo' },
  ]

  const isActive = (path) => location.pathname === path

  const handleNavigate = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const sidebar = (
    <>
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={24} />
            <span className="font-medium">Astra Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isActive(item.path) 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background-light">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={20} />
          <span className="font-medium text-sm">Astra Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col z-10 shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
