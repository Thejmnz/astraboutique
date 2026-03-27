import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background-light pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-12">
          <Link to="/" className="text-sm text-primary hover:underline font-menu mb-6 inline-block">Volver al inicio</Link>
          <h1 className="text-3xl md:text-4xl font-heading font-light tracking-tight" style={{ color: '#251e1a' }}>
            Contacto
          </h1>
          <div className="w-16 h-0.5 bg-primary mt-4" />
          <p className="text-gray-500 font-menu mt-4 text-[15px]">
            ¿Tienes alguna duda, sugerencia o quieres hacer un pedido especial? Estamos aqui para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a
            href="https://wa.me/573155614103"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-100 rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle size={22} className="text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 font-menu mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-500 font-menu">+57 315 5614103</p>
              <p className="text-xs text-gray-400 font-menu mt-1">Escríbenos y responde lo antes posible</p>
            </div>
          </a>

          <a
            href="mailto:hello@astraboutique.store"
            className="bg-white border border-gray-100 rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 font-menu mb-1">Email</h3>
              <p className="text-sm text-gray-500 font-menu">hello@astraboutique.store</p>
              <p className="text-xs text-gray-400 font-menu mt-1">Para consultas detalladas o pedidos especiales</p>
            </div>
          </a>

          <a
            href="https://wa.me/573155614103"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-100 rounded-lg p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 font-menu mb-1">Teléfono</h3>
              <p className="text-sm text-gray-500 font-menu">+57 315 5614103</p>
              <p className="text-xs text-gray-400 font-menu mt-1">Lunes a Sábado, 9:00 AM - 6:00 PM</p>
            </div>
          </a>

          <div className="bg-white border border-gray-100 rounded-lg p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 font-menu mb-1">Horario de atención</h3>
              <div className="text-sm text-gray-500 font-menu space-y-1 mt-2">
                <p className="flex justify-between">
                  <span>Lunes a Sábado</span>
                  <span className="text-gray-800 font-medium">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Domingos y festivos</span>
                  <span className="text-gray-400">Cerrado</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-8 mb-16">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-light tracking-tight mb-1" style={{ color: '#251e1a' }}>Ubicación</h2>
              <p className="text-sm text-gray-500 font-menu">Medellín, Colombia</p>
            </div>
          </div>
          <div className="w-full h-[300px] rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126845.33886770798!2d-75.6517444!3d6.244203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80fad31%3A0x6bb88fce7e0e3f0!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Astra Boutique"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-heading font-light tracking-tight mb-6" style={{ color: '#251e1a' }}>Síguenos</h2>
          <div className="flex gap-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/astraboutiquestore/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/573155614103"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full px-8 py-3 text-sm font-medium transition-opacity hover:opacity-90"
          >
            <MessageCircle size={18} />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
