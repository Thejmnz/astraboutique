import { Link } from 'react-router-dom'

const products = [
  {
    id: 1,
    name: 'Slim Fit Clásico',
    price: 189900,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
    isNew: true,
  },
  {
    id: 2,
    name: 'High Waist Mom',
    price: 215000,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
    isNew: false,
  },
  {
    id: 3,
    name: 'Relaxed Vintage',
    price: 249900,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop',
    isNew: true,
  },
  {
    id: 4,
    name: 'Straight Leg Azul',
    price: 175000,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=500&fit=crop',
    isNew: false,
  },
  {
    id: 5,
    name: 'Wide Leg Crop',
    price: 279900,
    image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&h=500&fit=crop',
    isNew: false,
  },
  {
    id: 6,
    name: 'Skinny Negro',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=500&fit=crop',
    isNew: true,
  },
  {
    id: 7,
    name: 'Bootcut Esencial',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop',
    isNew: false,
  },
  {
    id: 8,
    name: 'Distressed Raw',
    price: 299900,
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=500&fit=crop',
    isNew: true,
  },
]

export default function Products() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
            Colección de <span className="font-display italic text-primary font-semibold">Jeans</span>
          </h2>
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Esenciales de mezclilla premium
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/producto/${product.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-[3/5] bg-gray-100 mb-4">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={product.image}
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">
                    NUEVO
                  </span>
                )}
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white">
                  <span className="material-icons-outlined text-sm">favorite_border</span>
                </button>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-primary font-semibold">
                ${product.price.toLocaleString('es-CO')} COP
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
            href="#"
          >
            VER TODOS LOS JEANS
            <span className="material-icons-outlined text-sm">chevron_right</span>
          </a>
        </div>
      </div>
    </section>
  )
}
