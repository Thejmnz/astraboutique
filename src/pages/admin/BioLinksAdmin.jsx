import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Plus, GripVertical, Trash2, Edit3, Check, X, Link2, Eye } from 'lucide-react'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
  { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
]

export default function BioLinksAdmin() {
  const [links, setLinks] = useState([])
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [formData, setFormData] = useState({ title: '', url: '', is_active: true })
  const [socialInputs, setSocialInputs] = useState({})
  const [dragIndex, setDragIndex] = useState(null)
  const [socialSaved, setSocialSaved] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [linksRes, socialsRes] = await Promise.all([
      supabase.from('bio_links').select('*').order('position', { ascending: true }),
      supabase.from('bio_socials').select('*'),
    ])

    if (!linksRes.error) setLinks(linksRes.data || [])
    const socialsData = socialsRes.data || []
    if (!socialsRes.error) setSocials(socialsData)
    const inputs = {}
    socialsData.forEach(s => { inputs[s.platform] = s.url })
    setSocialInputs(inputs)
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ title: '', url: '', is_active: true })
    setEditingLink(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.url.trim()) return

    const url = formData.url.trim().startsWith('http') ? formData.url.trim() : `https://${formData.url.trim()}`

    if (editingLink) {
      const { error } = await supabase
        .from('bio_links')
        .update({ title: formData.title.trim(), url, is_active: formData.is_active })
        .eq('id', editingLink.id)

      if (!error) {
        setLinks(prev => prev.map(l => l.id === editingLink.id ? {
          ...l, title: formData.title.trim(), url, is_active: formData.is_active,
        } : l))
      }
    } else {
      const newPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) + 1 : 1
      const { error } = await supabase
        .from('bio_links')
        .insert([{ title: formData.title.trim(), url, position: newPosition, is_active: formData.is_active }])

      if (!error) {
        setLinks(prev => [...prev, {
          id: Date.now(), title: formData.title.trim(), url, position: newPosition, is_active: formData.is_active,
        }])
      }
    }

    resetForm()
    fetchData()
  }

  const handleEdit = (link) => {
    setFormData({ title: link.title, url: link.url, is_active: link.is_active })
    setEditingLink(link)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('bio_links').delete().eq('id', id)
    if (!error) {
      const reordered = links.filter(l => l.id !== id).map((l, i) => ({ ...l, position: i + 1 }))
      for (const link of reordered) {
        await supabase.from('bio_links').update({ position: link.position }).eq('id', link.id)
      }
      setLinks(reordered)
    }
  }

  const toggleActive = async (link) => {
    const { error } = await supabase.from('bio_links').update({ is_active: !link.is_active }).eq('id', link.id)
    if (!error) setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l))
  }

  const handleDragStart = (index) => setDragIndex(index)

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...links]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    setLinks(updated)
    setDragIndex(index)
  }

  const handleDragEnd = async () => {
    const reordered = links.map((l, i) => ({ ...l, position: i + 1 }))
    for (const link of reordered) {
      await supabase.from('bio_links').update({ position: link.position }).eq('id', link.id)
    }
    setDragIndex(null)
  }

  const saveAllSocials = async () => {
    for (const { id } of PLATFORMS) {
      await saveSocialUrl(id)
    }
    setSocialSaved(true)
    setTimeout(() => setSocialSaved(false), 2000)
  }

  const saveSocialUrl = async (platform) => {
    const url = (socialInputs[platform] || '').trim()
    if (!url) {
      const existing = socials.find(s => s.platform === platform)
      if (existing) {
        await supabase.from('bio_socials').delete().eq('id', existing.id)
        setSocials(prev => prev.filter(s => s.platform !== platform))
      }
      return
    }

    const cleanUrl = url.startsWith('http') ? url : `https://${url}`
    const existing = socials.find(s => s.platform === platform)

    if (existing) {
      const { data } = await supabase.from('bio_socials').update({ url: cleanUrl }).eq('id', existing.id).select()
      if (data) {
        setSocials(prev => prev.map(s => s.platform === platform ? { ...s, url: cleanUrl } : s))
        setSocialInputs(prev => ({ ...prev, [platform]: cleanUrl }))
      }
    } else {
      const { data } = await supabase.from('bio_socials').insert([{ platform, url: cleanUrl, is_active: true }]).select()
      if (data) {
        setSocials(prev => [...prev, ...data])
        setSocialInputs(prev => ({ ...prev, [platform]: cleanUrl }))
      }
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display">Link en Bio</h1>
            <p className="text-gray-500 mt-1">Gestiona los links de tu pagina /links</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/links"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
              Ver pagina
            </a>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
              >
                <Plus size={16} />
                Agregar link
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-medium mb-4">Redes sociales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORMS.map(({ id, label, icon: Icon }) => (
                <div key={id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <input
                    type="text"
                    value={socialInputs[id] || ''}
                    onChange={(e) => setSocialInputs(prev => ({ ...prev, [id]: e.target.value }))}
                    placeholder={`URL de ${label}`}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={saveAllSocials}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
            >
              <Check size={14} />
              Guardar redes
            </button>
            {socialSaved && <span className="text-xs text-green-600">Guardado correctamente</span>}
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
            <h3 className="text-sm font-medium mb-4">
              {editingLink ? 'Editar link' : 'Nuevo link'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Titulo</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Tienda online"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Ej: https://mi-tienda.com"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-[#251E1A]"
                  />
                  <span className="text-sm text-gray-600">Activo</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-colors"
              >
                <Check size={14} />
                {editingLink ? 'Guardar cambios' : 'Agregar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X size={14} />
                Cancelar
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando...</p>
        ) : links.length === 0 ? (
          <div className="text-center py-16">
            <Link2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No tienes links todavia</p>
            <p className="text-gray-400 text-sm">Agrega tu primer link para empezar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={link.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-4 transition-all ${
                  dragIndex === index ? 'opacity-50 border-primary' : 'hover:border-gray-200'
                } ${!link.is_active ? 'opacity-50' : ''}`}
              >
                <div className="cursor-grab text-gray-300 hover:text-gray-500">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                {!link.is_active && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">Inactivo</span>
                )}
                <button
                  onClick={() => toggleActive(link)}
                  className={`p-2 rounded-lg transition-colors ${link.is_active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
