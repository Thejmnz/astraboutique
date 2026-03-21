import { Link } from 'react-router-dom'

export default function PoliticasTratamientoDatos() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-primary hover:underline font-menu mb-8 inline-block">Volver al inicio</Link>
        <h1 className="text-3xl font-heading font-light tracking-tight mb-2" style={{ color: '#251e1a' }}>
          Politica de Tratamiento de Datos Personales
        </h1>
        <div className="w-16 h-0.5 bg-primary mb-8" />

        <div className="prose prose-sm max-w-none font-menu text-gray-700 leading-relaxed space-y-6 text-[13px]">

          <p>
            En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, ASTRA BOUTIQUE, con domicilio principal en la ciudad de Medellin, Colombia, se compromete a garantizar la proteccion de los datos personales de todos sus clientes, usuarios y visitantes, mediante la adopcion de medidas tecnicas, humanas y administrativas necesarias para otorgar seguridad a los registros evitando su adulteracion, perdida, consulta, uso o acceso no autorizado o fraudulento.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">1. Responsable del Tratamiento.</h2>
          <p>
            El responsable del tratamiento de los datos personales es ASTRA BOUTIQUE, con correo electronico hello@astraboutique.com y telefono +57 315 5614103. Horario de atencion: lunes a sabado de 8:00 A.M. a 8:00 P.M.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">2. Datos Personales Recopilados.</h2>
          <p>ASTRA BOUTIQUE recopila los siguientes datos personales:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Datos de identificacion: nombre, apellidos, numero de identificacion (cedula).</li>
            <li>Datos de contacto: correo electronico, numero telefonico, direccion de envio.</li>
            <li>Datos de transacciones: historial de compras, metodos de pago, preferencias de compra.</li>
            <li>Datos de navegacion: direccion IP, cookies, datos de uso del sitio web.</li>
          </ul>

          <h2 className="text-lg font-medium text-gray-900 pt-4">3. Finalidad del Tratamiento.</h2>
          <p>Los datos personales recopilados seran utilizados para las siguientes finalidades:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestionar y cumplir con los pedidos realizados a traves de la pagina web.</li>
            <li>Realizar envios de productos a las direcciones indicadas por el cliente.</li>
            <li>Enviar notificaciones sobre el estado de pedidos, entregas y cambios.</li>
            <li>Ofrecer promociones, descuentos y novedades relacionadas con nuestros productos.</li>
            <li>Mejorar la experiencia de usuario en la pagina web.</li>
            <li>Generar facturas y documentos contables requeridos por la ley.</li>
            <li>Atender solicitudes, quejas, reclamos o consultas de los clientes.</li>
            <li>Cumplir con obligaciones legales y regulatorias aplicables.</li>
          </ul>

          <h2 className="text-lg font-medium text-gray-900 pt-4">4. Base Legal del Tratamiento.</h2>
          <p>
            El tratamiento de datos personales se realiza con base en las siguientes disposiciones legales: Ley 1581 de 2012 (Ley de Proteccion de Datos Personales), Decreto 1377 de 2013, Decreto 886 de 2014, y las demas normas que las modifiquen, adicionen o sustituyan.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">5. Derechos de los Titulares.</h2>
          <p>Como titular de sus datos personales, usted tiene los siguientes derechos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acceso:</strong> Conocer los datos personales que ASTRA BOUTIQUE tiene sobre usted.</li>
            <li><strong>Rectificacion:</strong> Solicitar la correccion de datos personales que sean inexactos o incompletos.</li>
            <li><strong>Cancelacion:</strong> Solicitar la eliminacion de sus datos personales cuando considere que no son necesarios o el tratamiento no cumple con la ley.</li>
            <li><strong>Oposicion:</strong> Oponerse al tratamiento de sus datos personales para fines especificos.</li>
            <li><strong>Revocatoria:</strong> Revocar la autorizacion otorgada para el tratamiento de sus datos personales.</li>
            <li><strong>Presentar quejas:</strong> Ante la Superintendencia de Industria y Comercio (SIC) por violaciones a la ley de proteccion de datos.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, puede enviar un correo electronico a hello@astraboutique.com con el asunto "Solicitud de Titular de Datos Personales" incluyendo su nombre completo, numero de cedula y la solicitud especifica.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">6. Autorizacion para el Tratamiento.</h2>
          <p>
            Al registrarse en nuestra pagina web, realizar una compra o proporcionar sus datos personales de cualquier otra forma, usted otorga autorizacion expresa a ASTRA BOUTIQUE para el tratamiento de sus datos personales conforme a las finalidades descritas en la presente politica. Esta autorizacion puede ser revocada en cualquier momento mediante solicitud escrita a hello@astraboutique.com.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">7. Transferencia de Datos.</h2>
          <p>
            ASTRA BOUTIQUE podra transferir sus datos personales a terceros unicamente cuando sea necesario para cumplir con las finalidades autorizadas, tales como empresas de transporte y logistica para la entrega de pedidos, plataformas de pago electronico, o cuando sea requerido por autoridad competente. En todos los casos, se garantizara la proteccion de los datos conforme a la ley.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">8. Seguridad de los Datos.</h2>
          <p>
            ASTRA BOUTIQUE implementa medidas de seguridad tecnicas, humanas y administrativas razonables para proteger los datos personales contra acceso no autorizado, destruccion, perdida, alteracion o cualquier forma de tratamiento no autorizado. Sin embargo, ninguna medida de seguridad es infalible, por lo que ASTRA BOUTIQUE no garantiza la seguridad absoluta de la informacion.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">9. Cookies y Tecnologias Similares.</h2>
          <p>
            La pagina web de ASTRA BOUTIQUE utiliza cookies y tecnologias similares para mejorar la experiencia de navegacion, analizar el uso del sitio y ofrecer contenido personalizado. Al navegar en nuestro sitio, usted acepta el uso de cookies. Puede configurar su navegador para rechazar cookies, aunque esto podria afectar la funcionalidad del sitio.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">10. Conservacion de Datos.</h2>
          <p>
            Los datos personales seran conservados durante el tiempo necesario para cumplir con las finalidades para las cuales fueron recopilados y para cumplir con las obligaciones legales aplicables. Una vez finalizado el periodo de conservacion, los datos seran eliminados de forma segura.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">11. Modificaciones a la Politica.</h2>
          <p>
            ASTRA BOUTIQUE se reserva el derecho de modificar la presente politica de tratamiento de datos personales en cualquier momento. Cualquier modificacion sera publicada en nuestra pagina web. Le recomendamos revisar periodicamente esta politica para estar informado sobre las actualizaciones.
          </p>

          <h2 className="text-lg font-medium text-gray-900 pt-4">12. Contacto.</h2>
          <p>
            Para cualquier consulta, solicitud o queja relacionada con el tratamiento de sus datos personales, puede comunicarse con nosotros a traves de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Correo electronico: hello@astraboutique.com</li>
            <li>WhatsApp: +57 315 5614103</li>
            <li>Horario de atencion: lunes a sabado de 8:00 A.M. a 8:00 P.M.</li>
          </ul>

          <p className="text-xs text-gray-400 pt-8">Ultima actualizacion: Marzo 2026.</p>
        </div>
      </div>
    </div>
  )
}
