import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-background-light pt-20 pb-10 mt-12 border-t border-gray-100 font-menu">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-6">
            <img src="/logo.png" alt="Astra Boutique" className="h-10" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enfoque en calidad y estetica.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Atencion al Cliente</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link className="hover:text-primary transition-colors" to="/politicas-devoluciones">Politica de Devoluciones</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/politicas-datos">Politica de Datos</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/terminos-condiciones">Terminos y Condiciones</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Contacto</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a className="hover:text-primary transition-colors" href="mailto:hello@astraboutique.store">hello@astraboutique.store</a></li>
            <li><a className="hover:text-primary transition-colors" href="https://wa.me/573155614103" target="_blank" rel="noopener noreferrer">+57 315 5614103</a></li>
            <li>Lun - Sab: 8:00 A.M. - 8:00 P.M.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-6" style={{ opacity: 0.5 }}>Socials</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a className="hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a className="hover:text-primary transition-colors" href="https://www.instagram.com/astraboutiquestore/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a className="hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>&copy; 2026 Astra Boutique. Todos los derechos reservados.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link className="hover:text-primary transition-colors" to="/politicas-datos">Politica de Privacidad</Link>
          <Link className="hover:text-primary transition-colors" to="/terminos-condiciones">Terminos de Servicio</Link>
        </div>
      </div>
    </footer>
  )
}
