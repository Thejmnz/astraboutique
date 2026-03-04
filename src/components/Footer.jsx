import { Facebook, Instagram, Music2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background-light pt-20 pb-10 mt-12 border-t border-gray-100 font-menu">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="mb-6">
            <img src="/logo.png" alt="Astra Boutique" className="h-10" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Enfoque en calidad y estética.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-all">
              <Facebook size={14} strokeWidth={0.75} />
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-all">
              <Instagram size={14} strokeWidth={0.75} />
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-all">
              <Music2 size={14} strokeWidth={0.75} />
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Colecciones</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a className="hover:text-primary" href="#">Invierno 2024</a></li>
            <li><a className="hover:text-primary" href="#">Serie Minimalista</a></li>
            <li><a className="hover:text-primary" href="#">Edición Limitada</a></li>
            <li><a className="hover:text-primary" href="#">Accesorios</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Atención al Cliente</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a className="hover:text-primary" href="#">Rastrear Pedido</a></li>
            <li><a className="hover:text-primary" href="#">Info de Envío</a></li>
            <li><a className="hover:text-primary" href="#">Política de Devoluciones</a></li>
            <li><a className="hover:text-primary" href="#">Tarjetas de Regalo</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Únete al Club</h4>
          <p className="text-sm text-gray-500 mb-4">Regístrate para ofertas exclusivas y novedades.</p>
          <div className="relative">
            <input
              className="w-full bg-background-light border-none rounded-full py-3 px-5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Correo electrónico"
              type="email"
            />
            <button className="absolute right-1 top-1 bottom-1 px-4 bg-primary text-white rounded-full text-xs font-medium hover:bg-accent transition-colors">
              Unirse
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>© 2024 Astra Boutique. Todos los derechos reservados.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  )
}
