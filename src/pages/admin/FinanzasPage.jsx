import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Plus, Trash2, X, TrendingUp, DollarSign, ShoppingCart, Search } from 'lucide-react'

export default function FinanzasPage() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterProduct, setFilterProduct] = useState('all')
  const [productSearch, setProductSearch] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const productInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [formData, setFormData] = useState({
    product_id: '',
    size: '',
    customer_name: '',
    sale_price: '',
    cost_price: '',
    notes: ''
  })

  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && productInputRef.current && !productInputRef.current.contains(e.target)) {
        setShowProductDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, cost_price, price, images, product_sizes(*)')
      .order('name')
    setProducts(data || [])
  }

  const fetchSales = async () => {
    const { data } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
    setSales(data || [])
    setLoading(false)
  }

  const selectedProduct = products.find(p => p.id === formData.product_id)
  const availableSizes = selectedProduct?.product_sizes || []

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === productId)
    setFormData({
      ...formData,
      product_id: productId,
      size: '',
      cost_price: product?.cost_price || '',
      sale_price: product?.price || ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.product_id || !formData.sale_price) return

    setSaving(true)
    const profit = parseInt(formData.sale_price || 0) - parseInt(formData.cost_price || 0)

    const { error } = await supabase
      .from('sales')
      .insert([{
        product_id: formData.product_id,
        product_name: selectedProduct?.name || '',
        size: formData.size || null,
        customer_name: formData.customer_name || null,
        sale_price: parseInt(formData.sale_price),
        cost_price: parseInt(formData.cost_price || 0),
        profit,
        notes: formData.notes || null
      }])

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
      return
    }

    setFormData({ product_id: '', size: '', customer_name: '', sale_price: '', cost_price: '', notes: '' })
    setShowForm(false)
    setSaving(false)
    fetchSales()
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este registro?')) return
    await supabase.from('sales').delete().eq('id', id)
    fetchSales()
  }

  const filteredSales = filterProduct === 'all' ? sales : sales.filter(s => s.product_id === filterProduct)

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.sale_price || 0), 0)
  const totalCost = filteredSales.reduce((sum, s) => sum + (s.cost_price || 0), 0)
  const totalProfit = filteredSales.reduce((sum, s) => sum + (s.profit || 0), 0)

  const fmt = (v) => '$' + Number(v).toLocaleString('es-CO')

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display">Finanzas</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            <span>Registrar venta</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Registrar Venta</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto *</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={productInputRef}
                      type="text"
                      placeholder={selectedProduct ? selectedProduct.name : 'Buscar producto...'}
                      value={selectedProduct ? selectedProduct.name : productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setShowProductDropdown(true)
                        if (formData.product_id) {
                          setFormData({ ...formData, product_id: '', size: '', cost_price: '', sale_price: '' })
                        }
                      }}
                      onFocus={() => {
                        if (!selectedProduct) setShowProductDropdown(true)
                      }}
                      className="w-full border border-gray-200 rounded-md py-2.5 pl-9 pr-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                    {selectedProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setProductSearch('')
                          setFormData({ ...formData, product_id: '', size: '', cost_price: '', sale_price: '' })
                          setShowProductDropdown(true)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {showProductDropdown && !selectedProduct && (
                    <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {products
                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              const product = products.find(pr => pr.id === p.id)
                              setFormData({
                                ...formData,
                                product_id: p.id,
                                size: '',
                                cost_price: product?.cost_price || '',
                                sale_price: product?.price || ''
                              })
                              setProductSearch('')
                              setShowProductDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            {p.images?.[0] && (
                              <img src={p.images[0]} alt="" className="w-8 h-10 object-cover rounded" />
                            )}
                            <span className="text-gray-800">{p.name}</span>
                            <span className="text-gray-400 ml-auto">${p.price?.toLocaleString('es-CO')}</span>
                          </button>
                        ))
                      }
                      {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                        <p className="px-4 py-3 text-sm text-gray-400">No se encontraron productos</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    disabled={availableSizes.length === 0}
                  >
                    <option value="">Sin talla</option>
                    {availableSizes.map(ps => (
                      <option key={ps.id} value={ps.size} disabled={ps.stock === 0}>
                        {ps.size} {ps.stock === 0 ? '(Agotado)' : `(Stock: ${ps.stock})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del cliente</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de costo</label>
                  <input
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    placeholder="Costo"
                    className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de venta *</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    placeholder="Precio de venta"
                    className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Utilidad</label>
                  <div className={`w-full border border-gray-200 rounded-md py-2.5 px-3 text-lg font-bold ${
                    (parseInt(formData.sale_price || 0) - parseInt(formData.cost_price || 0)) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {fmt(parseInt(formData.sale_price || 0) - parseInt(formData.cost_price || 0))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Registrar venta'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Ingresos</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{fmt(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={20} className="text-red-600" />
              </div>
              <span className="text-sm text-gray-500">Costos</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{fmt(totalCost)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Utilidad Total</span>
            </div>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totalProfit)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-500">Filtrar por producto:</span>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="all">Todos</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400">{filteredSales.length} registros</span>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Producto</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Talla</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Costo</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Venta</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Utilidad</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Notas</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-800">{sale.product_name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sale.size || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sale.customer_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {fmt(sale.cost_price)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
                      {fmt(sale.sale_price)}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(sale.profit)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                      {sale.notes || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay ventas registradas. Agrega la primera.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
