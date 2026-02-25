import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const products = [
  {
    id: 1,
    name: 'Slim Fit Clásico',
    price: 189900,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272459335-9eb3c5e8d75e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    ],
    isNew: true,
    description: 'Jeans slim fit clásico con corte ajustado perfecto para un look moderno y elegante. Confeccionado en mezclilla premium de alta calidad.',
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Azul clásico', 'Negro', 'Gris'],
  },
  {
    id: 2,
    name: 'High Waist Mom',
    price: 215000,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop',
    ],
    isNew: false,
    description: 'Jeans mom fit de cintura alta con pierna relajada. El estilo retro perfecto para un look casual y cómodo.',
    sizes: ['4', '6', '8', '10', '12', '14', '16'],
    colors: ['Azul medio', 'Azul claro'],
  },
  {
    id: 3,
    name: 'Relaxed Vintage',
    price: 249900,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
    ],
    isNew: true,
    description: 'Jeans relaxed fit con acabado vintage. Corte holgado para máxima comodidad con un toque auténtico.',
    sizes: ['6', '8', '10', '12', '14'],
    colors: ['Vintage azul', 'Vintage claro'],
  },
  {
    id: 4,
    name: 'Straight Leg Azul',
    price: 175000,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop',
    ],
    isNew: false,
    description: 'Jeans straight leg en azul clásico. El básico esencial que nunca pasa de moda.',
    sizes: ['4', '6', '8', '10', '12', '14', '16'],
    colors: ['Azul clásico'],
  },
  {
    id: 5,
    name: 'Wide Leg Crop',
    price: 279900,
    image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop',
    ],
    isNew: false,
    description: 'Jeans wide leg cropped con pierna ancha y largo cropped. Perfecto para un look moderno y sofisticado.',
    sizes: ['4', '6', '8', '10', '12'],
    colors: ['Crema', 'Negro', 'Azul'],
  },
  {
    id: 6,
    name: 'Skinny Negro',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop',
    ],
    isNew: true,
    description: 'Jeans skinny en negro intenso. El básico versátil que combina con todo.',
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Negro'],
  },
  {
    id: 7,
    name: 'Bootcut Esencial',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop',
    ],
    isNew: false,
    description: 'Jeans bootcut con apertura en la parte inferior. El estilo clásico que alarga la silueta.',
    sizes: ['6', '8', '10', '12', '14'],
    colors: ['Azul medio', 'Negro'],
  },
  {
    id: 8,
    name: 'Distressed Raw',
    price: 299900,
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    ],
    isNew: true,
    description: 'Jeans relaxed fit con detalles distressed y acabado raw. Estilo auténtico con personalidad única.',
    sizes: ['6', '8', '10', '12', '14'],
    colors: ['Raw azul', 'Raw negro'],
  },
]

export default function ProductPage() {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [sizeType, setSizeType] = useState('CO')

  const sizeMap = {
    '4': '0',
    '6': '2',
    '8': '4',
    '10': '6',
    '12': '8',
    '14': '10',
    '16': '12',
  }

  const getSizeLabel = (size) => {
    return sizeType === 'US' ? sizeMap[size] : size
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }
    const sizeLabel = sizeType === 'US' ? `${sizeMap[selectedSize]} US` : `${selectedSize} CO`
    alert(`Agregado al carrito: ${product.name} - Talla: ${sizeLabel} - Cantidad: ${quantity}`)
  }

  return (
    <div className="min-h-screen bg-background-light pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 text-sm">
          <span className="material-icons-outlined text-sm">arrow_back</span>
          Volver
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative overflow-hidden rounded-3xl aspect-[3/4] bg-gray-100 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">
                  NUEVO
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:pt-8">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-2xl text-primary font-semibold mb-6">
              ${product.price.toLocaleString('es-CO')} COP
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold tracking-widest uppercase">Talla</h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => { setSizeType('CO'); setSelectedSize('') }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      sizeType === 'CO' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    CO
                  </button>
                  <button
                    onClick={() => { setSizeType('US'); setSelectedSize('') }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      sizeType === 'US' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    US
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {getSizeLabel(size)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold tracking-widest uppercase mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-widest uppercase mb-3">Cantidad</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <span className="material-icons-outlined text-sm">remove</span>
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <span className="material-icons-outlined text-sm">add</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-4 rounded-full text-sm font-bold tracking-widest hover:bg-accent transition-all duration-300"
              >
                AGREGAR AL CARRITO
              </button>
              <button className="w-14 h-14 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all">
                <span className="material-icons-outlined">favorite_border</span>
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-icons-outlined text-primary">local_shipping</span>
                  Envío gratis +$150.000
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-icons-outlined text-primary">refresh</span>
                  Devoluciones gratis
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-icons-outlined text-primary">shield</span>
                  Pago seguro
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-icons-outlined text-primary">checkroom</span>
                  Calidad garantizada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
