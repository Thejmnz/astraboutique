import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { X, Upload, Plus, Image as ImageIcon } from 'lucide-react'
import RichTextEditor from '../../components/RichTextEditor'

const COLORS = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#6B7280' },
  { name: 'Rojo', hex: '#EF4444' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Naranja', hex: '#F97316' },
  { name: 'Amarillo', hex: '#EAB308' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Morado', hex: '#8B5CF6' },
  { name: 'Marrón', hex: '#92400E' },
  { name: 'Beige', hex: '#D4B896' },
  { name: 'Nude', hex: '#E8C4A2' },
  { name: 'Dorado', hex: '#CAA247' },
  { name: 'Plata', hex: '#C0C0C0' },
  { name: 'Azul Marino', hex: '#1E3A5A' },
  { name: 'Verde Oliva', hex: '#556B2F' },
  { name: 'Borgoña', hex: '#800020' },
]

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
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    color: '',
    colorName: '',
    description: '',
    images: [],
    sizes: [{ size: '', stock: '' }],
    isNew: false,
    designNotes: '',
    fitNotes: '',
    fabricationCare: ''
  })

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
        color: formData.color,
        description: formData.description,
        images: formData.images,
        is_new: formData.isNew,
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
                <div key={index} className="relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden group">
                  <img 
                    src={url} 
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.hex, colorName: c.name })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === c.hex 
                          ? 'border-primary scale-110' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${c.hex === '#FFFFFF' ? 'ring-1 ring-gray-200' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                {formData.color && (
                  <div className="flex items-center gap-2 mt-3">
                    <span 
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-sm text-gray-600">{formData.colorName}</span>
                  </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabricación y Cuidado</label>
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
