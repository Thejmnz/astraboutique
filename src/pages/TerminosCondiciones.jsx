import { Link } from 'react-router-dom'

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-primary hover:underline font-menu mb-8 inline-block">Volver al inicio</Link>
        <h1 className="text-3xl font-heading font-light tracking-tight mb-2" style={{ color: '#251e1a' }}>
          Terminos y Condiciones
        </h1>
        <div className="w-16 h-0.5 bg-primary mb-8" />

        <div className="prose prose-sm max-w-none font-menu text-gray-700 leading-relaxed space-y-6 text-[13px]">

          <p>
            Al acceder y utilizar la pagina web de ASTRA BOUTIQUE (en adelante "el Sitio"), usted acepta quedar vinculado por los presentes Terminos y Condiciones, los cuales regulan el uso del Sitio, la compra de productos y la relacion entre ASTRA BOUTIQUE y los usuarios. Si no esta de acuerdo con estos terminos, le rogamos que no utilice el Sitio.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">1. Informacion General.</h2>
          <p>
            ASTRA BOUTIQUE es una tienda en linea con domicilio en la ciudad de Medellin, Colombia, dedicada a la comercializacion de prendas de vestir y accesorios. El Sitio esta disponible en astraboutique.com y cualquier otro dominio que ASTRA BOUTIQUE determine.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">2. Registro de Usuarios.</h2>
          <p>
            Para realizar compras a traves del Sitio, los usuarios deberan registrarse proporcionando informacion veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de su contrasena y de todas las actividades que se realicen bajo su cuenta. ASTRA BOUTIQUE no se hace responsable por el uso no autorizado de las cuentas de los usuarios.
          </p>
          <p>
            El usuario se compromete a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar informacion veraz, exacta y completa al momento del registro.</li>
            <li>Actualizar dicha informacion cuando sea necesario.</li>
            <li>Mantener la confidencialidad de sus datos de acceso.</li>
            <li>Notificar inmediatamente a ASTRA BOUTIQUE sobre cualquier uso no autorizado de su cuenta.</li>
          </ul>

          <h2 className="text-lg font-medium text-gray-900 pt-4">3. Productos y Disponibilidad.</h2>
          <p>
            Los productos ofrecidos en el Sitio estan sujetos a disponibilidad. ASTRA BOUTIQUE se reserva el derecho de modificar el catalogo de productos, precios, descripciones e imagenes en cualquier momento sin previo aviso. Las imagenes de los productos son meramente ilustrativas y pueden presentar variaciones respecto al producto real debido a la configuracion de pantalla o condiciones de iluminacion.
          </p>
          <p>
            Los precios mostrados en el Sitio incluyen IVA y estan expresados en pesos colombianos (COP), a menos que se indique lo contrario. ASTRA BOUTIQUE se reserva el derecho de modificar los precios sin previo aviso, sin embargo, el precio aplicable sera el vigente en el momento de la compra.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">4. Proceso de Compra.</h2>
          <p>
            Para realizar una compra, el usuario debera seguir los siguientes pasos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Seleccionar los productos deseados y agregarlos al carrito de compras.</li>
            <li>Seleccionar la talla, cantidad y color correspondiente.</li>
            <li>Proporcionar la informacion de envio requerida.</li>
            <li>Seleccionar el metodo de envio.</li>
            <li>Realizar el pago a traves de los metodos habilitados.</li>
          </ul>
          <p>
            Una vez confirmado el pago, ASTRA BOUTIQUE enviara una confirmacion de la orden al correo electronico registrado por el usuario.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">5. Metodos de Pago.</h2>
          <p>
            ASTRA BOUTIQUE acepta los siguientes metodos de pago, los cuales pueden variar segun la disponibilidad:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nequi</li>
            <li>Transferencia bancaria</li>
            <li>Otros metodos que se habiliten en el Sitio</li>
          </ul>
          <p>
            ASTRA BOUTIQUE no almacena ni tiene acceso a la informacion financiera de los usuarios. Los pagos son procesados por plataformas de pago tercerizadas que cumplen con los estandares de seguridad correspondientes.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">6. Envios y Entregas.</h2>
          <p>
            Los envios se realizan a todo el territorio colombiano. Los tiempos de entrega son de uno (1) dia habil para Medellin, entre tres (03) y siete (07) dias habiles para ciudades principales y entre ocho (08) y quince (15) dias habiles para otros destinos. Los tiempos pueden variar en temporadas de alta demanda.
          </p>
          <p>
            Los costos de envio seran calculados al momento de la compra segun el destino, peso y volumen del paquete. ASTRA BOUTIQUE no se hace responsable por retrasos causados por fuerza mayor, casos fortuitos o fallas en los servicios de las transportadoras.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">7. Politicas de Cambios y Devoluciones.</h2>
          <p>
            Los cambios y devoluciones se rigen por nuestra Politica de Cambios, Garantias y Devoluciones, la cual puede ser consultada en la seccion correspondiente del Sitio. Le recomendamos revisarla antes de realizar su compra.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">8. Propiedad Intelectual.</h2>
          <p>
            Todo el contenido del Sitio, incluyendo pero no limitandose a logos, disenos, textos, graficos, imagenes, fotografias, videos, iconos, codigo fuente y software, es propiedad de ASTRA BOUTIQUE o de sus licenciantes y esta protegido por las leyes colombianas e internacionales de propiedad intelectual.
          </p>
          <p>
            Queda expresamente prohibida la reproduccion, distribucion, modificacion, comunicacion publica o cualquier otra forma de explotacion del contenido del Sitio sin la autorizacion previa y por escrito de ASTRA BOUTIQUE.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">9. Uso Aceptable del Sitio.</h2>
          <p>El usuario se compromete a utilizar el Sitio de conformidad con la ley, la moral, las buenas costumbres y el orden publico. En consecuencia, el usuario no podra:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Utilizar el Sitio con fines ilegales, fraudulentos o no autorizados.</li>
            <li>Intentar obtener acceso no autorizado a los sistemas del Sitio.</li>
            <li>Introducir virus, malware o cualquier codigo danino.</li>
            <li>Realizar acciones que puedan danar, deshabilitar o sobrecargar el Sitio.</li>
            <li>Utilizar robots, scrapers o cualquier medio automatizado para extraer informacion del Sitio.</li>
            <li>Suplantar la identidad de otros usuarios o de ASTRA BOUTIQUE.</li>
          </ul>

          <h2 className="text-lg font-medium text-gray-900 pt-4">10. Limitacion de Responsabilidad.</h2>
          <p>
            ASTRA BOUTIQUE no garantiza que el Sitio estara disponible de forma ininterrumpida, libre de errores o seguro. En ningun caso ASTRA BOUTIQUE sera responsable por danos directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del Sitio.
          </p>
          <p>
            ASTRA BOUTIQUE no se responsabiliza por los contenidos de sitios web de terceros a los que se pueda acceder a traves de enlaces o vinculos desde el Sitio.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">11. Tratamiento de Datos Personales.</h2>
          <p>
            El tratamiento de los datos personales de los usuarios se rige por nuestra Politica de Tratamiento de Datos Personales, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">12. Expiracion de Pedidos.</h2>
          <p>
            Los pedidos que no sean pagados dentro del plazo estipulado en la plataforma seran cancelados automaticamente. ASTRA BOUTIQUE se reserva el derecho de cancelar pedidos que presenten inconsistencias en la informacion o que sean detectados como fraudulentos.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">13. Modificaciones.</h2>
          <p>
            ASTRA BOUTIQUE se reserva el derecho de modificar estos Terminos y Condiciones en cualquier momento. Las modificaciones entraran en vigor a partir de su publicacion en el Sitio. El uso continuado del Sitio despues de la publicacion de las modificaciones constituye la aceptacion de las mismas.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">14. Ley Aplicable y Jurisdiccion.</h2>
          <p>
            Estos Terminos y Condiciones se rigen por las leyes de la Republica de Colombia. Para la resolucion de cualquier controversia que surja con relacion a los mismos, las partes se someteran a la jurisdiccion de los tribunales de Medellin, Colombia.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">15. Contacto.</h2>
          <p>
            Para cualquier consulta relacionada con estos Terminos y Condiciones, puede comunicarse con nosotros a traves de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Correo electronico: hello@astraboutique.store</li>
            <li>WhatsApp: +57 315 5614103</li>
            <li>Horario de atencion: lunes a sabado de 8:00 A.M. a 8:00 P.M.</li>
          </ul>

          <p className="text-xs text-gray-400 pt-8">Ultima actualizacion: Marzo 2026.</p>
        </div>
      </div>
    </div>
  )
}
