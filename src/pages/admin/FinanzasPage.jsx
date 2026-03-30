import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Plus, Trash2, X, TrendingUp, DollarSign, ShoppingCart, Search, PackageOpen, Minus, Pencil, ImagePlus, XCircle } from 'lucide-react'
import ConfirmModal from '../../components/ConfirmModal'

const fmt = (v) => '$' + Number(v).toLocaleString('es-CO')

export default function FinanzasPage() {
  const [tab, setTab] = useState('ventas')
  const [sales, setSales] = useState([])
  const [wholesaleOrders, setWholesaleOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showWholesaleForm, setShowWholesaleForm] = useState(false)
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
    notes: '',
    receipt_url: ''
  })

  const [wholesaleData, setWholesaleData] = useState({
    order_date: new Date().toISOString().split('T')[0],
    supplier: '',
    payment_status: 'pending',
    notes: '',
    receipt_url: '',
    invoice_url: ''
  })
  const [wholesaleItems, setWholesaleItems] = useState([{ product_name: '', price: '' }])
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
  const [editingSaleId, setEditingSaleId] = useState(null)
  const [editingWholesaleId, setEditingWholesaleId] = useState(null)
  const supplierInputRef = useRef(null)
  const supplierDropdownRef = useRef(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, onConfirm: null })

  const [deleteWholesaleModal, setDeleteWholesaleModal] = useState({ open: false, type: '', id: null, onConfirm: null })
  const [receiptPreview, setReceiptPreview] = useState(null)
  const receiptInputRef = useRef(null)
  const wholesaleReceiptRef = useRef(null)
  const wholesaleInvoiceRef = useRef(null)

  useEffect(() => {
    fetchSales()
    fetchWholesaleOrders()
    fetchProducts()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && productInputRef.current && !productInputRef.current.contains(e.target)) {
        setShowProductDropdown(false)
      }
      if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(e.target) && supplierInputRef.current && !supplierInputRef.current.contains(e.target)) {
        setShowSupplierDropdown(false)
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

  const fetchWholesaleOrders = async () => {
    const { data } = await supabase
      .from('wholesale_orders')
      .select('*')
      .order('order_date', { ascending: false })
    setWholesaleOrders(data || [])
  }

  const selectedProduct = products.find(p => p.id === formData.product_id)
  const availableSizes = selectedProduct?.product_sizes || []

  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { convertToWebP } = await import('../../lib/convertToWebP')
    const webpFile = await convertToWebP(file)
    const filePath = `receipts/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, webpFile)

    if (uploadError) {
      alert('Error al subir comprobante: ' + uploadError.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    setFormData({ ...formData, receipt_url: publicUrl })
  }

  const handleWholesaleFileUpload = async (e, field) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { convertToWebP } = await import('../../lib/convertToWebP')
    const webpFile = await convertToWebP(file)
    const filePath = `receipts/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, webpFile)

    if (uploadError) {
      alert('Error al subir imagen: ' + uploadError.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    setWholesaleData({ ...wholesaleData, [field]: publicUrl })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.product_id || !formData.sale_price) return

    setSaving(true)
    const profit = parseInt(formData.sale_price || 0) - parseInt(formData.cost_price || 0)

    const payload = {
      product_id: formData.product_id,
      product_name: selectedProduct?.name || '',
      size: formData.size || null,
      customer_name: formData.customer_name || null,
      sale_price: parseInt(formData.sale_price),
      cost_price: parseInt(formData.cost_price || 0),
      profit,
      notes: formData.notes || null,
      receipt_url: formData.receipt_url || null
    }

    let error
    if (editingSaleId) {
      ({ error } = await supabase.from('sales').update(payload).eq('id', editingSaleId))
    } else {
      ({ error } = await supabase.from('sales').insert([payload]))
    }

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
      return
    }

    setFormData({ product_id: '', size: '', customer_name: '', sale_price: '', cost_price: '', notes: '', receipt_url: '' })
    setEditingSaleId(null)
    setShowForm(false)
    setSaving(false)
    fetchSales()
  }

  const handleWholesaleSubmit = async (e) => {
    e.preventDefault()
    const validItems = wholesaleItems.filter(i => i.product_name.trim() && i.price)
    if (validItems.length === 0) return

    setSaving(true)
    const totalCost = validItems.reduce((sum, i) => sum + parseInt(i.price || 0), 0)
    const description = JSON.stringify(validItems.map(i => ({ product_name: i.product_name.trim(), price: parseInt(i.price) })))

    const payload = {
      description,
      cost: totalCost,
      order_date: wholesaleData.order_date || new Date().toISOString().split('T')[0],
      supplier: wholesaleData.supplier || null,
      payment_status: wholesaleData.payment_status || 'pending',
      notes: wholesaleData.notes || null,
      receipt_url: wholesaleData.receipt_url || null,
      invoice_url: wholesaleData.invoice_url || null
    }

    let error
    if (editingWholesaleId) {
      ({ error } = await supabase.from('wholesale_orders').update(payload).eq('id', editingWholesaleId))
    } else {
      ({ error } = await supabase.from('wholesale_orders').insert([payload]))
    }

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
      return
    }

    setWholesaleData({ order_date: new Date().toISOString().split('T')[0], supplier: '', payment_status: 'pending', notes: '', receipt_url: '', invoice_url: '' })
    setWholesaleItems([{ product_name: '', price: '' }])
    setEditingWholesaleId(null)
    setShowWholesaleForm(false)
    setSaving(false)
    fetchWholesaleOrders()
  }

  const handleDelete = (id) => {
    setDeleteModal({ open: true, type: 'sale', id })
  }

  const handleDeleteWholesale = (id) => {
    setDeleteModal({ open: true, type: 'wholesale', id })
  }

  const confirmDelete = async () => {
    if (deleteModal.type === 'sale') {
      await supabase.from('sales').delete().eq('id', deleteModal.id)
      fetchSales()
    } else {
      await supabase.from('wholesale_orders').delete().eq('id', deleteModal.id)
      fetchWholesaleOrders()
    }
    setDeleteModal({ open: false, type: null, id: null })
  }

  const handleEditSale = (sale) => {
    setEditingSaleId(sale.id)
    setFormData({
      product_id: sale.product_id || '',
      size: sale.size || '',
      customer_name: sale.customer_name || '',
      sale_price: sale.sale_price?.toString() || '',
      cost_price: sale.cost_price?.toString() || '',
      notes: sale.notes || '',
      receipt_url: sale.receipt_url || ''
    })
    setProductSearch('')
    setShowProductDropdown(false)
    setShowForm(true)
  }

  const handleEditWholesale = (order) => {
    const parsed = parseWholesaleItems(order.description)
    setEditingWholesaleId(order.id)
    setWholesaleData({
      order_date: order.order_date || new Date().toISOString().split('T')[0],
      supplier: order.supplier || '',
      payment_status: order.payment_status || 'pending',
      notes: order.notes || '',
      receipt_url: order.receipt_url || '',
      invoice_url: order.invoice_url || ''
    })
    if (parsed) {
      setWholesaleItems(parsed.map(i => ({ product_name: i.product_name, price: i.price.toString() })))
    } else {
      setWholesaleItems([{ product_name: order.description || '', price: order.cost?.toString() || '' }])
    }
    setShowSupplierDropdown(false)
    setShowWholesaleForm(true)
  }

  const togglePaymentStatus = async (order) => {
    const newStatus = order.payment_status === 'paid' ? 'pending' : 'paid'
    await supabase.from('wholesale_orders').update({ payment_status: newStatus }).eq('id', order.id)
    fetchWholesaleOrders()
  }

  const parseWholesaleItems = (description) => {
    try {
      const items = JSON.parse(description)
      if (Array.isArray(items) && items[0]?.product_name !== undefined) return items
    } catch {}
    return null
  }

  const filteredSales = filterProduct === 'all' ? sales : sales.filter(s => s.product_id === filterProduct)

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.sale_price || 0), 0)
  const totalCost = filteredSales.reduce((sum, s) => sum + (s.cost_price || 0), 0)
  const totalProfit = filteredSales.reduce((sum, s) => sum + (s.profit || 0), 0)
  const totalWholesaleCost = wholesaleOrders.reduce((sum, o) => sum + (o.cost || 0), 0)
  const uniqueSuppliers = [...new Set(wholesaleOrders.map(o => o.supplier).filter(Boolean))]
  const pendingDebt = wholesaleOrders.filter(o => o.payment_status !== 'paid').reduce((sum, o) => sum + (o.cost || 0), 0)

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-display">Finanzas</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTab('ventas')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  tab === 'ventas' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => setTab('mayoreo')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  tab === 'mayoreo' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pedido Por Mayor
              </button>
            </div>
          </div>
          {tab === 'ventas' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              <span>Registrar venta</span>
            </button>
          )}
          {tab === 'mayoreo' && (
            <button
              onClick={() => setShowWholesaleForm(!showWholesaleForm)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo pedido</span>
            </button>
          )}
        </div>

        {tab === 'ventas' && (
          <>
            {showForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">{editingSaleId ? 'Editar Venta' : 'Registrar Venta'}</h2>
                  <button onClick={() => { setShowForm(false); setEditingSaleId(null); setFormData({ product_id: '', size: '', customer_name: '', sale_price: '', cost_price: '', notes: '', receipt_url: '' }) }} className="text-gray-400 hover:text-gray-600">
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
                          placeholder="Buscar producto..."
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
                                  setFormData({
                                    ...formData,
                                    product_id: p.id,
                                    size: '',
                                    cost_price: p.cost_price || '',
                                    sale_price: p.price || ''
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
                          <option key={ps.id} value={ps.size}>
                            {ps.size} (Stock: {ps.stock})
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante de pago</label>
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                    {formData.receipt_url ? (
                      <div className="relative inline-block">
                        <img src={formData.receipt_url} alt="Comprobante" className="h-24 rounded-lg border border-gray-200 object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, receipt_url: '' })}
                          className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 text-gray-400 hover:text-red-500"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => receiptInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                      >
                        <ImagePlus size={18} />
                        Subir comprobante
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : editingSaleId ? 'Guardar cambios' : 'Registrar venta'}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setEditingSaleId(null); setFormData({ product_id: '', size: '', customer_name: '', sale_price: '', cost_price: '', notes: '', receipt_url: '' }) }} className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Ingresos</span>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{fmt(totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={18} className="text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Costos</span>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{fmt(totalCost)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={18} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Utilidad Total</span>
                    <p className={`text-lg sm:text-2xl font-bold truncate ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totalProfit)}</p>
                  </div>
                </div>
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
              <>
                <div className="hidden md:block bg-white rounded-lg border border-gray-100 overflow-hidden">
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
                          <td className="px-6 py-4"><span className="text-sm font-medium text-gray-800">{sale.product_name}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sale.size || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sale.customer_name || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-right">{fmt(sale.cost_price)}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">{fmt(sale.sale_price)}</td>
                          <td className={`px-6 py-4 text-sm font-bold text-right ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(sale.profit)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{sale.notes || '-'}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {sale.receipt_url && (
                              <button onClick={() => setReceiptPreview(sale.receipt_url)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Ver comprobante"><ImagePlus size={16} /></button>
                            )}
                            <button onClick={() => handleEditSale(sale)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(sale.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredSales.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No hay ventas registradas.</div>
                  )}
                </div>

                <div className="md:hidden space-y-3">
                  {filteredSales.map((sale) => (
                    <div key={sale.id} className="bg-white rounded-lg border border-gray-100 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{sale.product_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(sale.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEditSale(sale)} className="p-1.5 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(sale.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        {sale.customer_name && (
                          <>
                            <span className="text-gray-400">Cliente</span>
                            <span className="text-gray-700 text-right truncate">{sale.customer_name}</span>
                          </>
                        )}
                        {sale.size && (
                          <>
                            <span className="text-gray-400">Talla</span>
                            <span className="text-gray-700 text-right">{sale.size}</span>
                          </>
                        )}
                        <span className="text-gray-400">Costo</span>
                        <span className="text-gray-700 text-right">{fmt(sale.cost_price)}</span>
                        <span className="text-gray-400">Venta</span>
                        <span className="text-gray-700 font-medium text-right">{fmt(sale.sale_price)}</span>
                        <span className="text-gray-400 font-medium">Utilidad</span>
                        <span className={`font-bold text-right ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(sale.profit)}</span>
                      </div>
                      {sale.receipt_url && (
                        <button onClick={() => setReceiptPreview(sale.receipt_url)} className="mt-3 pt-2 border-t border-gray-50 w-full text-left text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <ImagePlus size={14} />
                          Ver comprobante
                        </button>
                      )}
                      {!sale.receipt_url && sale.notes && (
                        <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50 truncate">{sale.notes}</p>
                      )}
                    </div>
                  ))}
                  {filteredSales.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No hay ventas registradas.</div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'mayoreo' && (
          <>
            {showWholesaleForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">{editingWholesaleId ? 'Editar Pedido Por Mayor' : 'Nuevo Pedido Por Mayor'}</h2>
                  <button onClick={() => { setShowWholesaleForm(false); setEditingWholesaleId(null); setWholesaleData({ order_date: new Date().toISOString().split('T')[0], supplier: '', payment_status: 'pending', notes: '', receipt_url: '', invoice_url: '' }); setWholesaleItems([{ product_name: '', price: '' }]) }} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleWholesaleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del pedido</label>
                      <input
                        type="date"
                        value={wholesaleData.order_date}
                        onChange={(e) => setWholesaleData({ ...wholesaleData, order_date: e.target.value })}
                        className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          ref={supplierInputRef}
                          type="text"
                          value={wholesaleData.supplier}
                          onChange={(e) => {
                            setWholesaleData({ ...wholesaleData, supplier: e.target.value })
                            setShowSupplierDropdown(true)
                          }}
                          onFocus={() => {
                            if (uniqueSuppliers.length > 0) setShowSupplierDropdown(true)
                          }}
                          placeholder="Nombre del proveedor"
                          className="w-full border border-gray-200 rounded-md py-2.5 pl-9 pr-3 focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        {wholesaleData.supplier && (
                          <button
                            type="button"
                            onClick={() => setWholesaleData({ ...wholesaleData, supplier: '' })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      {showSupplierDropdown && uniqueSuppliers.filter(s => s.toLowerCase().includes(wholesaleData.supplier.toLowerCase())).length > 0 && (
                        <div ref={supplierDropdownRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {uniqueSuppliers
                            .filter(s => s.toLowerCase().includes(wholesaleData.supplier.toLowerCase()))
                            .map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setWholesaleData({ ...wholesaleData, supplier: s })
                                  setShowSupplierDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-800"
                              >
                                {s}
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Productos del pedido *</label>
                      <button
                        type="button"
                        onClick={() => setWholesaleItems([...wholesaleItems, { product_name: '', price: '' }])}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-gray-800 font-medium transition-colors"
                      >
                        <Plus size={16} />
                        Agregar producto
                      </button>
                    </div>
                    <div className="space-y-3">
                      {wholesaleItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={item.product_name}
                            onChange={(e) => {
                              const updated = [...wholesaleItems]
                              updated[idx] = { ...updated[idx], product_name: e.target.value }
                              setWholesaleItems(updated)
                            }}
                            placeholder="Nombre del producto"
                            className="flex-1 border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const updated = [...wholesaleItems]
                              updated[idx] = { ...updated[idx], price: e.target.value }
                              setWholesaleItems(updated)
                            }}
                            placeholder="Precio"
                            className="w-36 border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          {wholesaleItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setWholesaleItems(wholesaleItems.filter((_, i) => i !== idx))}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Minus size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total del pedido:</span>
                      <span className="text-lg font-bold text-red-600">
                        {fmt(wholesaleItems.reduce((sum, i) => sum + parseInt(i.price || 0), 0))}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado del pago</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setWholesaleData({ ...wholesaleData, payment_status: 'paid' })}
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium border-2 transition-all ${
                          wholesaleData.payment_status === 'paid'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        Pagado
                      </button>
                      <button
                        type="button"
                        onClick={() => setWholesaleData({ ...wholesaleData, payment_status: 'pending' })}
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium border-2 transition-all ${
                          wholesaleData.payment_status !== 'paid'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        Debe
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                    <textarea
                      value={wholesaleData.notes}
                      onChange={(e) => setWholesaleData({ ...wholesaleData, notes: e.target.value })}
                      placeholder="Notas adicionales..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-md py-2.5 px-3 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante de pago</label>
                      <input ref={wholesaleReceiptRef} type="file" accept="image/*" onChange={(e) => handleWholesaleFileUpload(e, 'receipt_url')} className="hidden" />
                      {wholesaleData.receipt_url ? (
                        <div className="relative inline-block">
                          <img src={wholesaleData.receipt_url} alt="Comprobante" className="h-24 rounded-lg border border-gray-200 object-cover" />
                          <button type="button" onClick={() => setWholesaleData({ ...wholesaleData, receipt_url: '' })} className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 text-gray-400 hover:text-red-500"><XCircle size={16} /></button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => wholesaleReceiptRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors w-full">
                          <ImagePlus size={18} />
                          Subir comprobante
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Factura proveedor</label>
                      <input ref={wholesaleInvoiceRef} type="file" accept="image/*" onChange={(e) => handleWholesaleFileUpload(e, 'invoice_url')} className="hidden" />
                      {wholesaleData.invoice_url ? (
                        <div className="relative inline-block">
                          <img src={wholesaleData.invoice_url} alt="Factura" className="h-24 rounded-lg border border-gray-200 object-cover" />
                          <button type="button" onClick={() => setWholesaleData({ ...wholesaleData, invoice_url: '' })} className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 text-gray-400 hover:text-red-500"><XCircle size={16} /></button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => wholesaleInvoiceRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors w-full">
                          <ImagePlus size={18} />
                          Subir factura
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : editingWholesaleId ? 'Guardar cambios' : 'Registrar pedido'}
                    </button>
                    <button type="button" onClick={() => { setShowWholesaleForm(false); setEditingWholesaleId(null); setWholesaleData({ order_date: new Date().toISOString().split('T')[0], supplier: '', payment_status: 'pending', notes: '', receipt_url: '', invoice_url: '' }); setWholesaleItems([{ product_name: '', price: '' }]) }} className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PackageOpen size={18} className="text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Total pedidos</span>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{wholesaleOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={18} className="text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Total invertido</span>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">{fmt(totalWholesaleCost)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm text-gray-500">Deuda pendiente</span>
                    <p className={`text-lg sm:text-2xl font-bold truncate ${pendingDebt > 0 ? 'text-orange-600' : 'text-green-600'}`}>{fmt(pendingDebt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-white rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Fecha</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Proveedor</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Estado</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Productos</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Costo</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Notas</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wholesaleOrders.map((order) => {
                    const parsedItems = parseWholesaleItems(order.description)
                    const isPaid = order.payment_status === 'paid'
                    return (
                      <tr key={order.id} className={`transition-colors ${isPaid ? 'bg-green-50/50' : 'bg-red-50/40'} hover:opacity-90`}>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.order_date + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.supplier || '-'}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePaymentStatus(order)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                              isPaid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                            {isPaid ? 'Pagado' : 'Debe'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {parsedItems ? (
                            <div className="space-y-1">
                              {parsedItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between gap-4">
                                  <span className="text-gray-800">{item.product_name}</span>
                                  <span className="text-gray-500 font-medium">{fmt(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-800 whitespace-pre-line">{order.description}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{fmt(order.cost)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.notes || '-'}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {order.receipt_url && (
                            <button onClick={() => setReceiptPreview(order.receipt_url)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Comprobante de pago"><ImagePlus size={16} /></button>
                          )}
                          {order.invoice_url && (
                            <button onClick={() => setReceiptPreview(order.invoice_url)} className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Factura proveedor"><ImagePlus size={16} /></button>
                          )}
                          <button onClick={() => handleEditWholesale(order)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDeleteWholesale(order.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {wholesaleOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">No hay pedidos por mayor registrados.</div>
              )}
            </div>

            <div className="md:hidden space-y-3">
              {wholesaleOrders.map((order) => {
                const parsedItems = parseWholesaleItems(order.description)
                const isPaid = order.payment_status === 'paid'
                return (
                  <div key={order.id} className={`rounded-lg border p-4 ${isPaid ? 'bg-green-50/60 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-gray-500">
                            {new Date(order.order_date + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          {order.supplier && <span className="text-xs bg-white/80 text-gray-600 px-2 py-0.5 rounded-full">{order.supplier}</span>}
                          <button
                            onClick={() => togglePaymentStatus(order)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                              isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                            {isPaid ? 'Pagado' : 'Debe'}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditWholesale(order)} className="p-1.5 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
                        <button onClick={() => handleDeleteWholesale(order.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    {parsedItems ? (
                      <div className="space-y-1 mb-3">
                        {parsedItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.product_name}</span>
                            <span className="text-gray-500 font-medium">{fmt(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{order.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                      <span className="text-xs text-gray-500">Total</span>
                      <span className="text-base font-bold">{fmt(order.cost)}</span>
                    </div>
                    {order.notes && (
                      <p className="text-xs text-gray-400 mt-2 truncate">{order.notes}</p>
                    )}
                    {(order.receipt_url || order.invoice_url) && (
                      <div className="flex gap-3 mt-2 pt-2 border-t border-gray-50">
                        {order.receipt_url && (
                          <button onClick={() => setReceiptPreview(order.receipt_url)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <ImagePlus size={14} />
                            Comprobante
                          </button>
                        )}
                        {order.invoice_url && (
                          <button onClick={() => setReceiptPreview(order.invoice_url)} className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1">
                            <ImagePlus size={14} />
                            Factura
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {wholesaleOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">No hay pedidos por mayor registrados.</div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title={deleteModal.type === 'sale' ? '¿Eliminar venta?' : '¿Eliminar pedido?'}
        message={deleteModal.type === 'sale' ? 'Esta acción no se puede deshacer. El registro de venta será eliminado.' : 'Esta acción no se puede deshacer. El pedido por mayor será eliminado.'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, type: null, id: null })}
      />

      {receiptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setReceiptPreview(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setReceiptPreview(null)} className="absolute -top-3 -right-3 bg-white rounded-full shadow-lg p-2 text-gray-500 hover:text-gray-800 z-10">
              <X size={20} />
            </button>
            <img src={receiptPreview} alt="Comprobante" className="w-full rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
