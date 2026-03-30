import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, Plus, LogOut, LayoutDashboard, ClipboardList, Link2, Users, Image, Tag, DollarSign } from 'lucide-react'

export default function AdminLayout({ children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <div className="min-h-screen bg-background-light flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package size={24} />
            <span className="font-medium">Astra Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
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

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
