import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && open) onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title || '¿Estás seguro?'}</h3>
            <p className="text-sm text-gray-500 mt-1">{message || 'Esta acción no se puede deshacer.'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            {confirmLabel || 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
