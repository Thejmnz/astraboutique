import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { X, Upload, Plus, Trash2, GripVertical } from 'lucide-react'
import RichTextEditor from '../../components/RichTextEditor'

export default function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    color: '',
    colorName: '',
    description: '',
    images: [],
    is_new: false,
    badge: '',
    sizes: [],
    designNotes: '',
    fitNotes: '',
    fabricationCare: ''
  })

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('id', id)
      .single()

    if (error || !data) {
      alert('Producto no encontrado')
      navigate('/admin/productos')
      return
    }

    setFormData({
      name: data.name || '',
      price: data.price || '',
      color: data.color || '',
      colorName: data.color_name || '',
      description: data.description || '',
      images: data.images || [],
      is_new: data.is_new || false,
      badge: data.badge || '',
      sizes: data.product_sizes?.length > 0 
        ? data.product_sizes.map(s => ({ id: s.id, size: s.size, stock: s.stock.toString() }))
        : [{ size: '', stock: '' }],
      designNotes: data.design_notes || '',
      fitNotes: data.fit_notes || '',
      fabricationCare: data.fabrication_care || ''
    })
    setLoading(false)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const { convertToWebP } = await import('../../lib/convertToWebP')
      const webpFile = await convertToWebP(file)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, webpFile)

      if (uploadError) {
        alert('Error al subir imagen: ' + uploadError.message)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...uploadedUrls]
    })
    setUploading(false)
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleDragStart = (index) => {
    setDragIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const newImages = [...formData.images]
    const [moved] = newImages.splice(dragIndex, 1)
    newImages.splice(index, 0, moved)
    setFormData({ ...formData, images: newImages })
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleAddSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', stock: '' }]
    })
  }

  const handleRemoveSize = async (index) => {
    const sizeToRemove = formData.sizes[index]
    
    if (sizeToRemove.id) {
      await supabase
        .from('product_sizes')
        .delete()
        .eq('id', sizeToRemove.id)
    }

    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    })
  }

  const handleColorImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { convertToWebP } = await import('../../lib/convertToWebP')
    const webpFile = await convertToWebP(file)
    const fileName = `colors/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, webpFile)

    if (uploadError) {
      alert('Error al subir imagen de color: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    setFormData({ ...formData, color: publicUrl })
    setUploading(false)
  }

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes]
    newSizes[index][field] = value
    setFormData({ ...formData, sizes: newSizes })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    let slug = generateSlug(formData.name)

    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        slug,
        price: parseInt(formData.price),
        color: formData.color,
        color_name: formData.colorName,
        description: formData.description,
        images: formData.images,
        is_new: formData.is_new,
        badge: formData.badge || null,
        design_notes: formData.designNotes,
        fit_notes: formData.fitNotes,
        fabrication_care: formData.fabricationCare
      })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar: ' + error.message)
      setSaving(false)
      return
    }

    const sizesToUpdate = formData.sizes.filter(s => s.size && s.stock)
    
    for (const size of sizesToUpdate) {
      if (size.id) {
        await supabase
          .from('product_sizes')
          .update({ size: size.size, stock: parseInt(size.stock) })
          .eq('id', size.id)
      } else {
        await supabase
          .from('product_sizes')
          .insert([{
            product_id: id,
            size: size.size,
            stock: parseInt(size.stock)
          }])
      }
    }

    navigate('/admin/productos')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p>Cargando...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Editar Producto</h1>
          <p className="text-gray-500 mt-1">Modifica la información del producto</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Imágenes</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              {formData.images.map((url, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing ${dragIndex === index ? 'opacity-50 ring-2 ring-primary' : ''}`}
                >
                  <img 
                    src={url} 
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={14} className="text-gray-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              
              <label className="aspect-[2/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                {uploading ? (
                  <p className="text-sm text-gray-500">Subiendo...</p>
                ) : (
                  <>
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Agregar imagen</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Información básica</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio (COP) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex items-start gap-4">
                  <div>
                    {formData.color ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={formData.color} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, color: '' })}
                          className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                        {uploading ? (
                          <p className="text-[10px] text-gray-400">...</p>
                        ) : (
                          <Upload size={16} className="text-gray-400" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleColorImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.colorName}
                      onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                      placeholder="Nombre del color (ej: Rosa Pastel)"
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                    {!formData.color && !uploading && (
                      <p className="text-xs text-gray-400 mt-1">Sube una imagen del color</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Diseño</label>
                <RichTextEditor
                  value={formData.designNotes}
                  onChange={(value) => setFormData({ ...formData, designNotes: value })}
                  placeholder="Detalles del diseño..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Ajuste</label>
                <RichTextEditor
                  value={formData.fitNotes}
                  onChange={(value) => setFormData({ ...formData, fitNotes: value })}
                  placeholder="Información sobre el ajuste..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuidado</label>
                <RichTextEditor
                  value={formData.fabricationCare}
                  onChange={(value) => setFormData({ ...formData, fabricationCare: value })}
                  placeholder="Materiales y cuidados..."
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Tallas y Stock</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Marcar como nuevo</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta personalizada</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Ej: Best Seller, Edicion Limitada, Trending..."
                className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                maxLength={20}
              />
              <p className="text-xs text-gray-400 mt-1">Se muestra en la imagen del producto (max 20 caracteres). Si tambien esta marcado como nuevo, se muestran ambas etiquetas.</p>
            </div>
            
            <div className="space-y-3">
              {formData.sizes.map((sizeItem, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Talla"
                    value={sizeItem.size}
                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={sizeItem.stock}
                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                    className="w-32 border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSize}
              className="flex items-center gap-2 text-sm text-primary hover:underline mt-4"
            >
              <Plus size={16} />
              Agregar talla
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/productos')}
              className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
