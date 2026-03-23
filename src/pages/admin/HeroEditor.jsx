import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Save, Plus, Trash2, Monitor, Smartphone } from 'lucide-react'

export default function HeroEditor() {
  const [callouts, setCallouts] = useState([])
  const [isDesktop, setIsDesktop] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragging, setDragging] = useState(null)
  const [dragType, setDragType] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const containerRef = useRef(null)

  const fetchCallouts = async () => {
    const { data } = await supabase
      .from('hero_callouts')
      .select('*')
      .eq('is_desktop', isDesktop)
      .order('position', { ascending: true })
    setCallouts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCallouts()
  }, [isDesktop])

  const handleMouseDown = useCallback((e, id, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(id)
    setDragType(type)
  }, [])

  useEffect(() => {
    if (!dragging || !containerRef.current) return

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      setCallouts(prev => prev.map(c => {
        if (c.id !== dragging) return c
        if (dragType === 'point') {
          return { ...c, point_x: Math.max(0, Math.min(100, x)), point_y: Math.max(0, Math.min(100, y)) }
        }
        if (dragType === 'box') {
          const pointXpx = (c.point_x / 100) * rect.width
          const pointYpx = (c.point_y / 100) * rect.height
          const boxXpx = e.clientX - rect.left
          const boxYpx = e.clientY - rect.top
          return { ...c, box_offset_x: Math.round(boxXpx - pointXpx), box_offset_y: Math.round(boxYpx - pointYpx) }
        }
        return c
      }))
    }

    const handleMouseUp = () => {
      setDragging(null)
      setDragType(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, dragType])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    for (const callout of callouts) {
      await supabase.from('hero_callouts').update({
        title: callout.title,
        description: callout.description,
        point_x: callout.point_x,
        point_y: callout.point_y,
        box_offset_x: callout.box_offset_x,
        box_offset_y: callout.box_offset_y,
        position: callout.position,
      }).eq('id', callout.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addCallout = async () => {
    const { data } = await supabase.from('hero_callouts').insert([{
      title: 'Nuevo Callout',
      description: 'Descripcion',
      point_x: 50,
      point_y: 50,
      box_offset_x: isDesktop ? 150 : 100,
      box_offset_y: -80,
      is_desktop: isDesktop,
      position: callouts.length,
    }]).select()
    if (data) setCallouts(prev => [...prev, data[0]])
  }

  const deleteCallout = async (id) => {
    await supabase.from('hero_callouts').delete().eq('id', id)
    setCallouts(prev => prev.filter(c => c.id !== id))
  }

  const startEdit = (callout) => {
    setEditingId(callout.id)
    setEditTitle(callout.title)
    setEditDesc(callout.description || '')
  }

  const saveEdit = (id) => {
    setCallouts(prev => prev.map(c => {
      if (c.id !== id) return c
      return { ...c, title: editTitle, description: editDesc }
    }))
    setEditingId(null)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display">Editor Hero</h1>
            <p className="text-gray-500 mt-1">Arrastra los puntos y cajas para posicionar los callouts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDesktop(!isDesktop)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                isDesktop ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isDesktop ? <Monitor size={16} /> : <Smartphone size={16} />}
              {isDesktop ? 'Desktop' : 'Mobile'}
            </button>
            <button
              onClick={addCallout}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Agregar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
                saved ? 'bg-green-600' : 'bg-primary hover:opacity-90'
              }`}
            >
              <Save size={16} />
              {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
            <div
              ref={containerRef}
              className={`relative w-full bg-black select-none ${isDesktop ? 'aspect-video' : 'aspect-[9/16] max-w-[390px] mx-auto'}`}
            >
              <img
                src="/hero.png"
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {callouts.map((callout) => {
                const boxX = `calc(${callout.point_x}% + ${callout.box_offset_x}px)`
                const boxY = `calc(${callout.point_y}% + ${callout.box_offset_y}px)`

                return (
                  <div key={callout.id}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                      <path
                        d={`M ${(callout.point_x / 100) * 100}%,${(callout.point_y / 100) * 100}%`}
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="1"
                      />
                    </svg>

                    <div
                      className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-move z-30 border-2 border-white shadow-lg hover:bg-blue-600 transition-colors"
                      style={{
                        left: `${callout.point_x}%`,
                        top: `${callout.point_y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseDown={(e) => handleMouseDown(e, callout.id, 'point')}
                    />

                    <div
                      className={`absolute bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-400 z-20 ${
                        editingId === callout.id ? 'cursor-text' : 'cursor-move'
                      }`}
                      style={{
                        left: boxX,
                        top: boxY,
                        transform: 'translate(-50%, -50%)',
                        minWidth: editingId === callout.id ? '180px' : 'auto',
                      }}
                      onMouseDown={(e) => {
                        if (editingId === callout.id) return
                        handleMouseDown(e, callout.id, 'box')
                      }}
                      onDoubleClick={() => startEdit(callout)}
                    >
                      {editingId === callout.id ? (
                        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(callout.id) }}
                            className="bg-white/10 text-white text-xs font-bold border-b border-white/30 outline-none w-full px-1 py-0.5"
                            autoFocus
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(callout.id) }}
                            className="bg-white/10 text-white/70 text-[10px] outline-none w-full px-1 py-0.5"
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={() => saveEdit(callout.id)}
                            className="text-blue-400 text-[10px] font-bold hover:text-blue-300"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-white text-xs font-bold">{callout.title}</p>
                          <p className="text-white/70 text-[10px]">{callout.description}</p>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => deleteCallout(callout.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] z-40 opacity-0 hover:opacity-100 transition-opacity"
                      style={{
                        left: boxX,
                        top: boxY,
                        transform: 'translate(-50%, -200%)',
                      }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="p-4 bg-white">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Instrucciones:</span>{' '}
                Arrastra el <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mx-1" /> punto azul para mover el pin.{' '}
                Arrastra la caja de texto para reposicionarla.{' '}
                Doble click en la caja para editar texto.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
