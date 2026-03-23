import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Edit, Trash2, Plus, GripVertical, Save } from 'lucide-react'

export default function ProductsList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const dragItem = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*), colors(*)')      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    fetchProducts()
  }

  const handleDragStart = (idx) => {
    dragItem.current = idx
    setDragIdx(idx)
  }

  const handleDragOver = (e, idx) => {
    e.preventDefault()
    setOverIdx(idx)
  }

  const handleDrop = (idx) => {
    const fromIdx = dragItem.current
    if (fromIdx === null || fromIdx === idx) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }

    const updated = [...products]
    const [moved] = updated.splice(fromIdx, 1)
    updated.splice(idx, 0, moved)
    setProducts(updated)
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    dragItem.current = null
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleSaveOrder = async () => {
    setSaving(true)
    for (let i = 0; i < products.length; i++) {
      await supabase.from('products').update({ sort_order: i }).eq('id', products[i].id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const hasChanges = products.some((p, i) => p.sort_order !== i)

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display">Productos</h1>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all ${
                  saved ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <Save size={16} />
                {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar orden'}
              </button>
            )}
            <button
              onClick={() => navigate('/admin/productos/nuevo')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar producto</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">Arrastra las filas para reordenar los productos en la tienda</p>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-10 px-2 py-4"></th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Producto</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Precio</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Color</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors ${
                      dragIdx === idx ? 'opacity-50 bg-blue-50' : ''
                    } ${overIdx === idx && dragIdx !== idx ? 'border-t-2 border-t-blue-500' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                  >
                    <td className="px-2 py-4">
                      <GripVertical size={16} className="text-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ${product.price?.toLocaleString('es-CO')} COP
                    </td>
                    <td className="px-6 py-4">
                      {product.colors ? (
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-5 h-5 rounded-full overflow-hidden border border-gray-200"
                          >
                            <img src={product.colors.image_url} alt="" className="w-full h-full object-cover" />
                          </span>
                          {product.colors.name && (
                            <span className="text-xs text-gray-500">{product.colors.name}</span>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.product_sizes?.map((ps) => (
                          <span
                            key={ps.id}
                            className={`text-xs px-2 py-1 rounded ${
                              ps.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ps.size}: {ps.stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay productos. Agrega el primero.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
