import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Edit, Trash2, Plus, GripVertical, Save, Archive, ArchiveRestore } from 'lucide-react'
import ConfirmModal from '../../components/ConfirmModal'

export default function ProductsList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const [view, setView] = useState('active')
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const dragItem = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [view])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, product_sizes(*), product_colors(colors(*)), categories(*)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (view === 'active') {
      query = query.neq('archived', true)
    } else {
      query = query.eq('archived', true)
    }

    const { data } = await query
    setProducts((data || []).map(p => ({
      ...p,
      colors_list: (p.product_colors || []).map(pc => pc.colors).filter(Boolean)
    })))
    setLoading(false)
  }

  const handleArchive = async (id) => {
    const archive = view === 'active'
    const { error } = await supabase
      .from('products')
      .update({ archived: archive })
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
      return
    }
    fetchProducts()
  }

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteModal.id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setDeleteModal({ open: false, id: null })
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
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <h1 className="text-2xl font-display">Productos</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('active')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === 'active' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setView('archived')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === 'archived' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Archivados
              </button>
            </div>
          </div>
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
          <>
            <div className="hidden md:block bg-white rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="w-10 px-2 py-4"></th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Producto</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Precio</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Categoria</th>
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
                        {product.on_sale && product.sale_price ? (
                          <div className="flex flex-col">
                            <span className="line-through text-xs text-gray-400">${product.price?.toLocaleString('es-CO')}</span>
                            <span className="text-red-600 font-medium">${product.sale_price?.toLocaleString('es-CO')} COP</span>
                          </div>
                        ) : (
                          <span>${product.price?.toLocaleString('es-CO')} COP</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.categories ? (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{product.categories.name}</span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {product.colors_list?.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {product.colors_list.map(c => (
                              <div key={c.id} className="flex items-center gap-1">
                                <span className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                                  {c.hex ? (
                                    <span className="block w-full h-full" style={{ backgroundColor: c.hex }} />
                                  ) : (
                                    <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">{c.name}</span>
                              </div>
                            ))}
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
                          {view === 'active' && (
                            <button
                              onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleArchive(product.id)}
                            className={`p-2 transition-colors ${
                              view === 'active'
                                ? 'text-gray-400 hover:text-amber-600'
                                : 'text-gray-400 hover:text-green-600'
                            }`}
                            title={view === 'active' ? 'Archivar' : 'Desarchivar'}
                          >
                            {view === 'active' ? <Archive size={18} /> : <ArchiveRestore size={18} />}
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, id: product.id })}
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

            <div className="md:hidden space-y-3">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-18 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                      {product.categories && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{product.categories.name}</span>
                      )}
                      <div className="mt-1">
                        {product.on_sale && product.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through text-xs text-gray-400">${product.price?.toLocaleString('es-CO')}</span>
                            <span className="text-red-600 font-medium text-sm">${product.sale_price?.toLocaleString('es-CO')}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700">${product.price?.toLocaleString('es-CO')} COP</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {view === 'active' && (
                        <button onClick={() => navigate(`/admin/productos/editar/${product.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600">
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(product.id)}
                        className={`p-1.5 ${view === 'active' ? 'text-gray-400 hover:text-amber-600' : 'text-gray-400 hover:text-green-600'}`}
                      >
                        {view === 'active' ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                      </button>
                      <button onClick={() => setDeleteModal({ open: true, id: product.id })} className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.product_sizes?.map((ps) => (
                      <span
                        key={ps.id}
                        className={`text-xs px-2 py-0.5 rounded ${
                          ps.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {ps.size}: {ps.stock}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">No hay productos. Agrega el primero.</div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title="¿Eliminar producto?"
        message="Esta acción no se puede deshacer. El producto será eliminado permanentemente."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </AdminLayout>
  )
}
