import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { X, Upload, Plus, Image as ImageIcon, GripVertical, Check } from 'lucide-react'
import RichTextEditor from '../../components/RichTextEditor'

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [colors, setColors] = useState([])
  const [categories, setCategories] = useState([])
  const [showNewColor, setShowNewColor] = useState(false)
  const [newColorName, setNewColorName] = useState('')
  const [newColorImage, setNewColorImage] = useState('')
  const [newColorHex, setNewColorHex] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    colorIds: [],
    categoryId: '',
    description: '',
    images: [],
    sizes: [{ size: '', stock: '' }],
    isNew: false,
    badge: '',
    designNotes: '',
    fitNotes: '',
    fabricationCare: ''
  })

  useEffect(() => {
    fetchColors()
    fetchCategories()
  }, [])

  const fetchColors = async () => {
    const { data } = await supabase.from('colors').select('*').order('name')
    setColors(data || [])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('name')
    setCategories(data || [])
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

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    })
  }

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes]
    newSizes[index][field] = value
    setFormData({ ...formData, sizes: newSizes })
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

    setNewColorImage(publicUrl)
    setUploading(false)
  }

  const handleSaveNewColor = async () => {
    if (!newColorName || (!newColorImage && !newColorHex)) return

    const { data, error } = await supabase
      .from('colors')
      .insert([{ name: newColorName, image_url: newColorImage || null, hex: newColorHex || null }])
      .select()
      .single()

    if (error) {
      alert('Error al crear color: ' + error.message)
      return
    }

    setFormData({ ...formData, colorIds: [...formData.colorIds, data.id] })
    setColors(prev => [...prev, data])
    setShowNewColor(false)
    setNewColorName('')
    setNewColorImage('')
    setNewColorHex('')
  }

  const handleSaveNewCategory = async () => {
    if (!newCategoryName.trim()) return

    const slug = generateSlug(newCategoryName)
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim(), slug }])
      .select()
      .single()

    if (error) {
      alert('Error al crear categoria: ' + error.message)
      return
    }

    setFormData({ ...formData, categoryId: data.id })
    setCategories(prev => [...prev, data])
    setShowNewCategory(false)
    setNewCategoryName('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const slug = generateSlug(formData.name)

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: formData.name,
        slug: slug,
        price: parseInt(formData.price),
        category_id: formData.categoryId || null,
        description: formData.description,
        images: formData.images,
        is_new: formData.isNew,
        badge: formData.badge || null,
        design_notes: formData.designNotes,
        fit_notes: formData.fitNotes,
        fabrication_care: formData.fabricationCare
      }])
      .select()
      .single()

    if (error) {
      alert('Error al crear producto: ' + error.message)
      setLoading(false)
      return
    }

    const sizesToInsert = formData.sizes
      .filter(s => s.size && s.stock)
      .map(s => ({
        product_id: product.id,
        size: s.size,
        stock: parseInt(s.stock)
      }))

    if (sizesToInsert.length > 0) {
      await supabase.from('product_sizes').insert(sizesToInsert)
    }

    if (formData.colorIds.length > 0) {
      await supabase.from('product_colors').insert(
        formData.colorIds.map(colorId => ({ product_id: product.id, color_id: colorId }))
      )
    }

    navigate('/admin/productos')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display">Agregar Producto</h1>
          <p className="text-gray-500 mt-1">Completa la información del producto</p>
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
            <p className="text-xs text-gray-400">La primera imagen será la principal. Formatos: JPG, PNG, WebP</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                
                {categories.length > 0 && (
                  <div className="mb-3">
                    <select
                      value={formData.categoryId}
                      onChange={(e) => { setFormData({ ...formData, categoryId: e.target.value }); setShowNewCategory(false) }}
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Sin categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {showNewCategory ? (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Nueva categoria</p>
                      <button type="button" onClick={() => setShowNewCategory(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nombre (ej: Jeans, Camisetas, Accesorios...)"
                          className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveNewCategory()}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveNewCategory}
                        disabled={!newCategoryName.trim()}
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Plus size={14} />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                    Crear nueva categoria
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                
                {colors.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Seleccionar colores (puedes elegir varios)</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              colorIds: formData.colorIds.includes(c.id)
                                ? formData.colorIds.filter(id => id !== c.id)
                                : [...formData.colorIds, c.id]
                            })
                            setShowNewColor(false)
                          }}
                          className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            formData.colorIds.includes(c.id) ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {c.hex ? (
                            <div className="w-full h-full" style={{ backgroundColor: c.hex }} />
                          ) : (
                            <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                          )}
                          {formData.colorIds.includes(c.id) && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check size={14} className="text-white drop-shadow" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {colors.filter(c => formData.colorIds.includes(c.id)).map(c => (
                        <span key={c.id} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showNewColor ? (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Nuevo color</p>
                      <button type="button" onClick={() => setShowNewColor(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Color HEX</label>
                        <div className="flex items-center gap-2">
                          {newColorHex && (
                            <span className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0" style={{ backgroundColor: newColorHex }} />
                          )}
                          <input
                            type="text"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            placeholder="#FF5733"
                            className="flex-1 border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-primary focus:outline-none font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">O imagen WebP</label>
                        <div className="flex items-center gap-2">
                          {newColorImage ? (
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              <img src={newColorImage} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setNewColorImage('')}
                                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors flex-shrink-0">
                              <Upload size={12} className="text-gray-400" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleColorImageUpload}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                          )}
                          <span className="text-xs text-gray-400">{uploading ? 'Subiendo...' : 'Opcional'}</span>
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Nombre del color (ej: Rosa Pastel)"
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewColor}
                      disabled={!newColorName || (!newColorImage && !newColorHex)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Plus size={14} />
                      Guardar color
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewColor(true)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                    Crear nuevo color
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  placeholder="Describe el producto..."
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
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
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
                    placeholder="Talla (ej: S, M, L, XL)"
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
                      <X size={20} />
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
              disabled={loading || uploading}
              className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar producto'}
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
