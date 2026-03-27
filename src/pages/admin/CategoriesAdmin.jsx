import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Plus, Edit3, Trash2, Check, X, Save } from 'lucide-react'

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    const slug = generateSlug(newName)
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newName.trim(), slug }])

    if (error) {
      alert('Error al crear categoria: ' + error.message)
      return
    }

    setNewName('')
    fetchCategories()
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) return

    const slug = generateSlug(editName)
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), slug })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar: ' + error.message)
      return
    }

    setEditingId(null)
    setEditName('')
    fetchCategories()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estas seguro de eliminar esta categoria? Los productos quedaran sin categoria.')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    fetchCategories()
  }

  const handleDragStart = (idx) => setDragIdx(idx)
  const handleDragOver = (e, idx) => {
    e.preventDefault()
    setOverIdx(idx)
  }
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    const updated = [...categories]
    const [moved] = updated.splice(dragIdx, 1)
    updated.splice(idx, 0, moved)
    setCategories(updated)
    setDragIdx(null)
    setOverIdx(null)
  }
  const handleDragEnd = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleSaveOrder = async () => {
    for (let i = 0; i < categories.length; i++) {
      await supabase.from('categories').update({ sort_order: i }).eq('id', categories[i].id)
    }
  }

  const hasChanges = categories.some((c, i) => c.sort_order !== i)

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8"><p>Cargando...</p></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display">Categorias</h1>
            <p className="text-gray-500 mt-1">Gestiona las categorias de productos</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveOrder}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Save size={16} />
              Guardar orden
            </button>
          )}
        </div>

        <form onSubmit={handleCreate} className="flex items-center gap-3 mb-8">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nueva categoria (ej: Jeans, Camisetas, Accesorios...)"
            className="flex-1 max-w-md border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            Crear
          </button>
        </form>

        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-10 px-2 py-4"></th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Nombre</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Productos</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <tr
                  key={cat.id}
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
                    <div className="w-4 h-4 flex items-center justify-center text-gray-300">⠿</div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border border-gray-200 rounded-md py-1.5 px-2 focus:ring-1 focus:ring-primary focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                        />
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditName('') }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.product_count || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId !== cat.id && (
                        <>
                          <button
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay categorias. Crea la primera.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
