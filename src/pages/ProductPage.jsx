import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, X, Plus, Minus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [sizeGuideTab, setSizeGuideTab] = useState('medidas')
  const [error, setError] = useState('')
  const [openAccordion, setOpenAccordion] = useState('design')
  const [showLightbox, setShowLightbox] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('slug', slug)
      .single()

    if (!error && data) {
      setProduct(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <p className="font-menu">Cargando...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-light mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-primary hover:underline font-menu">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Por favor selecciona una talla')
      return
    }
    const selectedSizeData = allSizes.find(ps => ps.size === selectedSize)
    if (!selectedSizeData || selectedSizeData.stock === 0) {
      setError('Esta talla no está disponible')
      return
    }
    setError('')
    addToCart(product, selectedSize, quantity)
  }

  const allSizes = product.product_sizes || []

  return (
    <div className="min-h-screen bg-background-light pt-12 pb-16">
      {/* Size Guide Panel */}
      <div 
        className={`fixed inset-0 z-[10000] transition-opacity duration-300 ${
          showSizeGuide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowSizeGuide(false)}
        />
        <div 
          className={`absolute top-0 left-0 h-full w-full md:w-[600px] bg-white transform transition-transform duration-300 ${
            showSizeGuide ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-menu font-medium">Guía de Tallas</h2>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-[12px] text-gray-500 font-menu mt-2">
              Esta es una guía genérica de tallas. Para medidas específicas consulta las notas de cada producto.
            </p>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setSizeGuideTab('medidas')}
                className={`pb-3 text-xs font-menu transition-colors ${
                  sizeGuideTab === 'medidas'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Medidas
              </button>
              <button
                onClick={() => setSizeGuideTab('conversion')}
                className={`pb-3 text-xs font-menu transition-colors ${
                  sizeGuideTab === 'conversion'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Conversión de Medidas
              </button>
            </div>

            {sizeGuideTab === 'medidas' && (
              <>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full text-xs font-menu table-fixed">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-3 px-2 text-gray-500 border-r border-gray-200 w-[28%]">Talla US</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">0</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">2</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">4</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">6</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">8</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">10</th>
                        <th className="text-center py-3 text-gray-500 border-r border-gray-200">12</th>
                        <th className="text-center py-3 text-gray-500">14</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-2 text-gray-500 border-r border-gray-200">Largo pierna (cm)</td>
                        <td className="text-center py-3 border-r border-gray-200">74</td>
                        <td className="text-center py-3 border-r border-gray-200">76</td>
                        <td className="text-center py-3 border-r border-gray-200">78</td>
                        <td className="text-center py-3 border-r border-gray-200">80</td>
                        <td className="text-center py-3 border-r border-gray-200">82</td>
                        <td className="text-center py-3 border-r border-gray-200">84</td>
                        <td className="text-center py-3 border-r border-gray-200">86</td>
                        <td className="text-center py-3">88</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-2 text-gray-500 border-r border-gray-200">Cintura (cm)</td>
                        <td className="text-center py-3 border-r border-gray-200">60</td>
                        <td className="text-center py-3 border-r border-gray-200">63</td>
                        <td className="text-center py-3 border-r border-gray-200">66</td>
                        <td className="text-center py-3 border-r border-gray-200">69</td>
                        <td className="text-center py-3 border-r border-gray-200">72</td>
                        <td className="text-center py-3 border-r border-gray-200">76</td>
                        <td className="text-center py-3 border-r border-gray-200">80</td>
                        <td className="text-center py-3">85</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-500 border-r border-gray-200">Cadera (cm)</td>
                        <td className="text-center py-3 border-r border-gray-200">86</td>
                        <td className="text-center py-3 border-r border-gray-200">90</td>
                        <td className="text-center py-3 border-r border-gray-200">94</td>
                        <td className="text-center py-3 border-r border-gray-200">98</td>
                        <td className="text-center py-3 border-r border-gray-200">102</td>
                        <td className="text-center py-3 border-r border-gray-200">106</td>
                        <td className="text-center py-3 border-r border-gray-200">110</td>
                        <td className="text-center py-3">116</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-menu font-medium mb-4">Cómo medir</h3>
                  <div className="space-y-4 text-xs font-menu text-gray-600">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Largo de pierna</p>
                      <p>Mide desde la entrepierna hasta el tobillo por la parte interior de la pierna.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Cintura</p>
                      <p>Mide alrededor de la parte más estrecha de tu cintura, justo encima del ombligo.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Cadera</p>
                      <p>Mide alrededor de la parte más ancha de tus caderas y glúteos, aproximadamente 20 cm debajo de la cintura.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {sizeGuideTab === 'conversion' && (
              <>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full text-xs font-menu table-fixed">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-3 px-2 text-gray-500 border-r border-gray-200 w-[20%]">Size</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">XXS</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">XS</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">S</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">M</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">L</th>
                      <th className="text-center py-3 text-gray-500 border-r border-gray-200">XL</th>
                      <th className="text-center py-3 text-gray-500">XXL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200 font-medium">Colombia</td>
                      <td className="text-center py-3 border-r border-gray-200">6</td>
                      <td className="text-center py-3 border-r border-gray-200">8</td>
                      <td className="text-center py-3 border-r border-gray-200">10</td>
                      <td className="text-center py-3 border-r border-gray-200">12</td>
                      <td className="text-center py-3 border-r border-gray-200">14</td>
                      <td className="text-center py-3 border-r border-gray-200">16</td>
                      <td className="text-center py-3">18</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">US</td>
                      <td className="text-center py-3 border-r border-gray-200">0</td>
                      <td className="text-center py-3 border-r border-gray-200">2</td>
                      <td className="text-center py-3 border-r border-gray-200">4</td>
                      <td className="text-center py-3 border-r border-gray-200">6</td>
                      <td className="text-center py-3 border-r border-gray-200">8</td>
                      <td className="text-center py-3 border-r border-gray-200">10</td>
                      <td className="text-center py-3">12</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">AU</td>
                      <td className="text-center py-3 border-r border-gray-200">4</td>
                      <td className="text-center py-3 border-r border-gray-200">6</td>
                      <td className="text-center py-3 border-r border-gray-200">8</td>
                      <td className="text-center py-3 border-r border-gray-200">10</td>
                      <td className="text-center py-3 border-r border-gray-200">12</td>
                      <td className="text-center py-3 border-r border-gray-200">14</td>
                      <td className="text-center py-3">16</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">UK</td>
                      <td className="text-center py-3 border-r border-gray-200">4</td>
                      <td className="text-center py-3 border-r border-gray-200">6</td>
                      <td className="text-center py-3 border-r border-gray-200">8</td>
                      <td className="text-center py-3 border-r border-gray-200">10</td>
                      <td className="text-center py-3 border-r border-gray-200">12</td>
                      <td className="text-center py-3 border-r border-gray-200">14</td>
                      <td className="text-center py-3">16</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">Japón</td>
                      <td className="text-center py-3 border-r border-gray-200">3</td>
                      <td className="text-center py-3 border-r border-gray-200">5</td>
                      <td className="text-center py-3 border-r border-gray-200">7</td>
                      <td className="text-center py-3 border-r border-gray-200">9</td>
                      <td className="text-center py-3 border-r border-gray-200">11</td>
                      <td className="text-center py-3 border-r border-gray-200">13</td>
                      <td className="text-center py-3">15</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">EU</td>
                      <td className="text-center py-3 border-r border-gray-200">32</td>
                      <td className="text-center py-3 border-r border-gray-200">34</td>
                      <td className="text-center py-3 border-r border-gray-200">36</td>
                      <td className="text-center py-3 border-r border-gray-200">38</td>
                      <td className="text-center py-3 border-r border-gray-200">40</td>
                      <td className="text-center py-3 border-r border-gray-200">42</td>
                      <td className="text-center py-3">44</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-gray-500 border-r border-gray-200">Italia</td>
                      <td className="text-center py-3 border-r border-gray-200">36</td>
                      <td className="text-center py-3 border-r border-gray-200">38</td>
                      <td className="text-center py-3 border-r border-gray-200">40</td>
                      <td className="text-center py-3 border-r border-gray-200">42</td>
                      <td className="text-center py-3 border-r border-gray-200">44</td>
                      <td className="text-center py-3 border-r border-gray-200">46</td>
                      <td className="text-center py-3">48</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-menu font-medium mb-4">Cómo medir</h3>
                <div className="space-y-4 text-xs font-menu text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Largo de pierna</p>
                    <p>Mide desde la entrepierna hasta el tobillo por la parte interior de la pierna.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Cintura</p>
                    <p>Mide alrededor de la parte más estrecha de tu cintura, justo encima del ombligo.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Cadera</p>
                    <p>Mide alrededor de la parte más ancha de tus caderas y glúteos, aproximadamente 20 cm debajo de la cintura.</p>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-6 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start min-w-0">
          <div className="flex flex-row-reverse gap-4 min-w-0 -mx-6 lg:mx-0">
            <div className="relative flex-1 flex items-center justify-center">
              {product.images?.[selectedImage] && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-[95vh] object-contain cursor-pointer hidden lg:block"
                  onClick={() => setShowLightbox(true)}
                />
              )}
              
              {/* Mobile carousel */}
              {product.images?.length > 0 && (
                <div className="lg:hidden relative w-full flex items-center justify-center">
                  <div className="w-full -mx-6 relative">
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-black p-2 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-auto object-contain cursor-pointer"
                      onClick={() => setShowLightbox(true)}
                    />
                    
                    <button
                      onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-black p-2 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop thumbnails */}
            {product.images?.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 shrink-0 py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-28 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === index ? 'border-[#251E1A]' : 'border-transparent'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:py-8 min-w-0 max-w-full overflow-hidden">
            <h1 className="text-3xl md:text-4xl font-heading font-light tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-base text-primary font-menu mb-6">
              ${product.price?.toLocaleString('es-CO')}
            </p>
            
            {product.description && (
              <p className="text-gray-600 leading-relaxed font-menu mb-8 text-[12px]">
                {product.description}
              </p>
            )}

            {allSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => { setShowSizeGuide(true); setSizeGuideTab('medidas') }}
                    className="text-xs font-menu text-gray-500 hover:text-gray-700 underline"
                  >
                    Guía de tallas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((ps) => {
                    const isOutOfStock = ps.stock === 0
                    return (
                      <button
                        key={ps.id}
                        onClick={() => !isOutOfStock && setSelectedSize(ps.size)}
                        disabled={isOutOfStock}
                        className={`w-10 h-10 border-2 text-xs font-menu transition-all relative ${
                          isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedSize === ps.size
                              ? 'border-[#251E1A] bg-[#251E1A] text-white'
                              : 'border-gray-200 hover:border-[#251E1A]'
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {ps.size}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg width="100%" height="100%" className="absolute">
                              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {product.badge && (
              <div className="mb-6">
                <span className="text-xs font-medium text-gray-800">Marca: </span>
                <span className="text-xs font-bold tracking-wider text-primary border border-primary px-2 py-0.5 rounded-full">{product.badge}</span>
              </div>
            )}

            {product.color && (
              <div className="mb-6">
                <p className="text-[12px] font-medium text-gray-800 mb-2">Color</p>
                <div className="flex items-center gap-2">
                  <span 
                    className="inline-block w-8 h-8 rounded-full overflow-hidden"
                    style={{ border: '1px solid #A49F9B' }}
                  >
                    <img src={product.color} alt="" className="w-full h-full object-cover" />
                  </span>
                  {product.color_name && (
                    <span className="text-[12px] text-gray-600">{product.color_name}</span>
                  )}
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-xs font-menu mb-3">{error}</p>
            )}

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 text-white py-4 text-sm font-menu hover:opacity-90 transition-all duration-300"
                style={{ backgroundColor: '#251E1A' }}
              >
                Agregar al Carrito
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 flex items-center justify-center hover:opacity-90 transition-all ${
                  isInWishlist(product.id) ? 'bg-red-500' : ''
                }`}
                style={{ backgroundColor: isInWishlist(product.id) ? '#ef4444' : '#251E1A', borderRadius: 0 }}
              >
                <Heart
                  size={20}
                  strokeWidth={0.75}
                  className={`text-white ${isInWishlist(product.id) ? 'fill-white' : ''}`}
                />
              </button>
            </div>

            {/* Accordion for notes */}
            <div className="mt-6 border-t border-gray-200">
              {product.design_notes && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'design' ? null : 'design')}
                    className="w-full py-2 flex items-center justify-between text-left font-menu"
                  >
                    <span className="text-[12px] font-medium text-gray-800">Notas de Diseño</span>
                    <span className="text-gray-500 text-lg w-4 flex justify-center">
                      {openAccordion === 'design' ? '−' : '+'}
                    </span>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openAccordion === 'design' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-2 text-[12px] text-gray-600 font-menu product-notes-display">
                      <div dangerouslySetInnerHTML={{ __html: product.design_notes }} />
                    </div>
                  </div>
                </div>
              )}

              {product.fit_notes && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'fit' ? null : 'fit')}
                    className="w-full py-2 flex items-center justify-between text-left font-menu"
                  >
                    <span className="text-[12px] font-medium text-gray-800">Notas de Ajuste</span>
                    <span className="text-gray-500 text-lg w-4 flex justify-center">
                      {openAccordion === 'fit' ? '−' : '+'}
                    </span>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openAccordion === 'fit' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-2 text-[12px] text-gray-600 font-menu product-notes-display">
                      <div dangerouslySetInnerHTML={{ __html: product.fit_notes }} />
                    </div>
                  </div>
                </div>
              )}

              {product.fabrication_care && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                    className="w-full py-2 flex items-center justify-between text-left font-menu"
                  >
                    <span className="text-[12px] font-medium text-gray-800">Cuidado</span>
                    <span className="text-gray-500 text-lg w-4 flex justify-center">
                      {openAccordion === 'care' ? '−' : '+'}
                    </span>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openAccordion === 'care' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-2 text-[12px] text-gray-600 font-menu product-notes-display">
                      <div dangerouslySetInnerHTML={{ __html: product.fabrication_care }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[10001] bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <div className="flex items-center h-full w-full justify-center">
            {/* Thumbnails sidebar - desktop only */}
            {product.images?.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 h-full py-8">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-22 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Navigation arrows - mobile only */}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                  className="md:hidden absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                  className="md:hidden absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Main image */}
            <div className="h-full flex items-center justify-center ml-0 md:ml-4">
              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
