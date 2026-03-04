import { Link } from 'react-router-dom'
import { Heart, ChevronRight } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Vortex',
    price: 189900,
    image: 'https://images.unsplash.com/photo-1763499390001-6ce9085593c1?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: true,
  },
  {
    id: 2,
    name: 'Cosmos',
    price: 215000,
    image: 'https://images.unsplash.com/photo-1621525157051-ecf5241693bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: false,
  },
  {
    id: 3,
    name: 'Zenith',
    price: 249900,
    image: 'https://plus.unsplash.com/premium_photo-1694618623690-db4ed5c37a2f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: true,
  },
  {
    id: 4,
    name: 'Aura',
    price: 175000,
    image: 'https://images.unsplash.com/photo-1570397369306-f42d7dbce359?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: false,
  },
  {
    id: 5,
    name: 'Ocaso',
    price: 279900,
    image: 'https://images.unsplash.com/photo-1584105617768-1154ac9d5053?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: false,
  },
  {
    id: 6,
    name: 'Magma',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1674291072795-583f08ab121d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: true,
  },
  {
    id: 7,
    name: 'Estela',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1738618806128-1e313827cd54?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: false,
  },
  {
    id: 8,
    name: 'Prisma',
    price: 299900,
    image: 'https://plus.unsplash.com/premium_photo-1690820317364-3e22c2f68eb4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isNew: true,
  },
]

export default function Products() {
  return (
    <section className="py-16 bg-background-light">
      <div className="w-full px-0">
        <div className="text-left mb-4 pl-6">
          <h2 className="font-medium tracking-tight mb-2 font-heading text-2xl md:text-3xl" style={{ color: '#251e1a' }}>
            Colecciones 2026
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-2">
          {products.map((product) => (
            <Link key={product.id} to={`/producto/${product.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[2/3] bg-gray-100 mb-4">
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
                  <Heart size={16} strokeWidth={0.75} />
                </button>
              </div>
              <div className="flex flex-col pl-4">
                <h3 className="text-sm font-medium text-gray-800 font-menu">
                  {product.name}
                </h3>
                <p className="text-sm font-menu" style={{ opacity: 0.5 }}>
                  ${product.price.toLocaleString('es-CO')} COP
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12 px-6">
          <a
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
            href="#"
          >
            VER TODOS LOS JEANS
            <ChevronRight size={14} strokeWidth={0.75} />
          </a>
        </div>
      </div>
    </section>
  )
}
