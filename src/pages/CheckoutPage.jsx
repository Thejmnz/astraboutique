import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, CreditCard, Truck, Package, Check, Clock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Envío Estándar', price: 12000, days: '5-7 días hábiles' },
  { id: 'express', name: 'Envío Express', price: 25000, days: '2-3 días hábiles' },
  { id: 'pickup', name: 'Recoger en tienda', price: 0, days: 'Disponible en 24h' },
]

const PAYMENT_METHODS = [
  { id: 'nequi', name: 'Nequi', icon: CreditCard },
]

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
  })

  const [errors, setErrors] = useState({})

  const selectedShipping = SHIPPING_METHODS.find(m => m.id === formData.shippingMethod)
  const shippingCost = selectedShipping?.price || 0
  const total = cartTotal + shippingCost

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido'
    if (!formData.cedula.trim()) newErrors.cedula = 'Cedula requerida'
    if (!formData.email.trim()) newErrors.email = 'Email requerido'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    if (formData.shippingMethod === 'pickup') return true
    const newErrors = {}
    if (!formData.address.trim()) newErrors.address = 'Dirección requerida'
    if (!formData.city.trim()) newErrors.city = 'Ciudad requerida'
    if (!formData.state.trim()) newErrors.state = 'Departamento requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmitOrder = async () => {
    setLoading(true)
    
    const newOrderId = 'AST-' + Date.now().toString(36).toUpperCase()
    
    const order = {
      order_number: newOrderId,
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_cedula: formData.cedula,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.shippingMethod === 'pickup' ? null : formData.address,
      shipping_city: formData.shippingMethod === 'pickup' ? null : formData.city,
      shipping_state: formData.shippingMethod === 'pickup' ? null : formData.state,
      shipping_zip: formData.shippingMethod === 'pickup' ? null : formData.zipCode,
      shipping_method: formData.shippingMethod,
      payment_method: formData.paymentMethod,
      items: cart,
      subtotal: cartTotal,
      shipping_cost: shippingCost,
      total: total,
      status: 'pending',
      notes: formData.notes,
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert([order])

      if (error) throw error
      
      setOrderTotal(total)
      setOrderId(newOrderId)
      setOrderComplete(true)
      clearCart()
    } catch (error) {
      console.error('Error al procesar orden:', error)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background-light pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Package size={64} strokeWidth={0.5} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-heading font-light mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-500 font-menu mb-8">Agrega productos a tu carrito para continuar con la compra.</p>
          <Link
            to="/"
            className="inline-block text-white py-3 px-8 text-sm font-menu hover:opacity-90 transition-all"
            style={{ backgroundColor: '#251E1A' }}
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return <OrderConfirmation orderId={orderId} formData={formData} total={orderTotal} />
  }

  return (
    <div className="min-h-screen bg-background-light pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-menu text-gray-500 hover:text-gray-700 mb-8"
        >
          <ChevronLeft size={16} />
          Continuar comprando
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <div className="relative">
                <div className="absolute top-4 h-0.5 bg-gray-200" style={{ left: '16px', right: '16px' }} />
                {step > 1 && (
                  <div
                    className="absolute top-4 h-0.5 bg-[#251E1A]"
                    style={{ left: '16px', width: step > 2 ? 'calc(100% - 32px)' : 'calc(50% - 16px)' }}
                  />
                )}
                <div className="relative flex justify-between">
                  {[
                    { num: 1, label: 'Información' },
                    { num: 2, label: 'Envío' },
                    { num: 3, label: 'Pago' },
                  ].map(({ num, label }) => (
                    <div key={num} className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-menu ${
                          step >= num
                            ? 'bg-[#251E1A] text-white'
                            : 'bg-white text-gray-500 border-2 border-gray-200'
                        }`}
                      >
                        {num}
                      </div>
                      <span className={`text-xs font-menu mt-2 ${step >= num ? 'text-[#251E1A]' : 'text-gray-400'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-lg font-menu font-medium mb-6">Información personal</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-menu text-gray-600 mb-1">Nombre *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-menu text-gray-600 mb-1">Apellido *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-menu text-gray-600 mb-1">Cedula *</label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                        errors.cedula ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-menu text-gray-600 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-menu text-gray-600 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white p-6 border border-gray-200">
                  <h2 className="text-lg font-menu font-medium mb-6">Método de envío</h2>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                          formData.shippingMethod === method.id
                            ? 'border-[#251E1A] bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#251E1A]"
                          />
                          <div>
                            <p className="text-sm font-menu font-medium">{method.name}</p>
                            <p className="text-xs font-menu text-gray-500">{method.days}</p>
                          </div>
                        </div>
                        <span className="text-sm font-menu font-medium">
                          {method.price === 0 ? 'Gratis' : `$${method.price.toLocaleString('es-CO')}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.shippingMethod !== 'pickup' && (
                  <div className="bg-white p-6 border border-gray-200">
                    <h2 className="text-lg font-menu font-medium mb-6">Dirección de envío</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-menu text-gray-600 mb-1">Dirección *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                            errors.address ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Calle, número, apartamento"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-menu text-gray-600 mb-1">Ciudad *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                              errors.city ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-menu text-gray-600 mb-1">Departamento *</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] ${
                              errors.state ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-menu text-gray-600 mb-1">Código postal</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 border border-gray-200">
                  <label className="block text-xs font-menu text-gray-600 mb-1">Notas del pedido (opcional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border p-3 text-sm font-menu focus:outline-none focus:ring-1 focus:ring-[#251E1A] border-gray-200"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white p-6 border border-gray-200">
                  <h2 className="text-lg font-menu font-medium mb-6">Método de pago</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? 'border-[#251E1A] bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#251E1A]"
                        />
                        <method.icon size={20} className="text-gray-400" />
                        <span className="text-sm font-menu">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 border border-amber-200 text-sm font-menu text-amber-800">
                  <p className="font-medium mb-1">Importante</p>
                  <p className="text-xs">El pago estará activo por <strong>15 minutos</strong>. Pasados los 15 minutos se cancelará el pedido y los productos volverán a estar en stock.</p>
                  <p className="text-xs mt-2">Una vez el asesor revise que el pago sí llegó y todo está bien, se realizará el envío.</p>
                </div>

                <div className="bg-gray-50 p-6 border border-gray-200">
                  <h3 className="text-sm font-menu font-medium mb-4">Resumen del pedido</h3>
                  <div className="space-y-2 text-sm font-menu">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contacto:</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enviar a:</span>
                      <span>
                        {formData.shippingMethod === 'pickup'
                          ? 'Recoger en tienda'
                          : `${formData.city}, ${formData.state}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método:</span>
                      <span>{selectedShipping?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 text-sm font-menu border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Volver
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="flex-1 text-white py-3 text-sm font-menu hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#251E1A' }}
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="flex-1 text-white py-3 text-sm font-menu hover:opacity-90 transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#251E1A' }}
                >
                  {loading ? 'Procesando...' : `Pagar $${total.toLocaleString('es-CO')} COP`}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white p-6 border border-gray-200 sticky top-24">
              <h2 className="text-lg font-menu font-medium mb-6">Tu pedido</h2>
              <div className="divide-y divide-gray-100">
                {cart.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${index}`} className="flex gap-4 py-4">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0 relative">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-menu truncate">{item.name}</h3>
                      <p className="text-xs font-menu text-gray-500">Talla: {item.size}</p>
                    </div>
                    <p className="text-sm font-menu">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm font-menu">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cartTotal.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-sm font-menu">
                  <span className="text-gray-600">Envío</span>
                  <span>
                    {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CO')} COP`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-menu font-medium pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderConfirmation({ orderId, formData, total }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-background-light pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-heading font-light mb-2">¡Pedido creado!</h1>
          <p className="text-gray-500 font-menu mb-1">Tu número de orden es:</p>
          <p className="text-lg font-menu font-medium">{orderId}</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-menu font-medium mb-4">Realiza tu pago con Nequi</h2>
          <p className="text-sm font-menu text-gray-600 mb-4">
            Envía el valor total al siguiente numero:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
            <p className="text-xs font-menu text-gray-500 mb-1">Numero de Nequi</p>
            <p className="text-2xl font-menu font-bold">316 313 7192</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
            <p className="text-xs font-menu text-gray-500 mb-1">Nombre</p>
            <p className="text-lg font-menu font-medium">Margarita María Salazar Sánchez</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
            <p className="text-xs font-menu text-gray-500 mb-1">Monto a pagar</p>
            <p className="text-xl font-menu font-bold text-[#251E1A]">${total.toLocaleString('es-CO')}</p>
          </div>
          <a
            href="https://wa.me/573155614103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-8 text-sm font-menu rounded-lg hover:opacity-90 transition-all w-full"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar comprobante por WhatsApp
          </a>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-amber-600" />
            <h3 className="text-sm font-menu font-medium text-amber-800">Tiempo limite de pago</h3>
          </div>
          <div className="text-center mb-3">
            <span className={`text-3xl font-menu font-bold ${timeLeft <= 120 ? 'text-red-600' : 'text-amber-700'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs font-menu text-amber-700 mb-2">
            Pasados <strong>15 minutos</strong> sin confirmar el pago, el pedido sera cancelado automaticamente y los productos volveran a estar en stock.
          </p>
          <p className="text-xs font-menu text-amber-700">
            Una vez el asesor revise que el pago llego correctamente, tu pedido sera confirmado y se realizara el envio.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block text-white py-3 px-8 text-sm font-menu hover:opacity-90 transition-all mt-2"
            style={{ backgroundColor: '#251E1A' }}
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
