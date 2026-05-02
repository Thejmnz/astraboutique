import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'
import { Plus, Trash2, Monitor, Smartphone, Upload, Image as ImageIcon } from 'lucide-react'

export default function HeroEditor() {
  const [isDesktop, setIsDesktop] = useState(true)
  const [heroImages, setHeroImages] = useState({ desktop: [], mobile: [] })
  const [uploadingImage, setUploadingImage] = useState(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const fileInputRef = useRef(null)

  const fetchHeroImages = async () => {
    const { data } = await supabase
      .from('hero_images')
      .select('*')
      .order('position', { ascending: true })
    if (data) {
      const images = { desktop: [], mobile: [] }
      data.forEach(row => {
        images[row.type].push({ id: row.id, url: row.url, position: row.position })
      })
      setHeroImages(images)
    }
  }

  useEffect(() => {
    fetchHeroImages()
  }, [])

  useEffect(() => {
    setPreviewIndex(0)
  }, [isDesktop])

  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImage(type)

    try {
      const currentImages = heroImages[type]
      const newImages = []

      for (const file of files) {
        const { convertToWebP } = await import('../../lib/convertToWebP')
        const webpFile = await convertToWebP(file)
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
        const filePath = `hero/${type}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('hero')
          .upload(filePath, webpFile)

        if (uploadError) {
          alert('Error al subir imagen: ' + uploadError.message)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('hero')
          .getPublicUrl(filePath)

        const position = currentImages.length + newImages.length

        const { data, error: insertError } = await supabase
          .from('hero_images')
          .insert([{ type, url: publicUrl, position }])
          .select()

        if (insertError) {
          alert('Error al guardar: ' + insertError.message)
          continue
        }

        if (data) newImages.push(data[0])
      }

      setHeroImages(prev => ({
        ...prev,
        [type]: [...prev[type], ...newImages]
      }))
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUploadingImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const deleteImage = async (type, id) => {
    await supabase.from('hero_images').delete().eq('id', id)
    setHeroImages(prev => ({
      ...prev,
      [type]: prev[type].filter(img => img.id !== id)
    }))
    setPreviewIndex(0)
  }

  const moveImage = async (type, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    const images = [...heroImages[type]]
    const [moved] = images.splice(fromIndex, 1)
    images.splice(toIndex, 0, moved)

    setHeroImages(prev => ({ ...prev, [type]: images }))

    for (let i = 0; i < images.length; i++) {
      await supabase.from('hero_images').update({ position: i }).eq('id', images[i].id)
    }
  }

  const triggerUpload = (type) => {
    setUploadingImage(type)
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e) => {
    if (uploadingImage) {
      handleImageUpload(e, uploadingImage)
    }
  }

  const currentHeroImages = isDesktop ? heroImages.desktop : heroImages.mobile

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display">Editor Hero</h1>
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
          </div>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelected}
          />

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {isDesktop ? <Monitor size={16} className="text-gray-500" /> : <Smartphone size={16} className="text-gray-500" />}
                <span className="text-sm font-medium">Imagenes {isDesktop ? 'Desktop' : 'Mobile'}</span>
                <span className="text-xs text-gray-400">({currentHeroImages.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerUpload(isDesktop ? 'desktop' : 'mobile')}
                  disabled={uploadingImage === (isDesktop ? 'desktop' : 'mobile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs rounded-md hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  <Upload size={12} />
                  {uploadingImage ? 'Subiendo...' : 'Subir imagenes'}
                </button>
              </div>
            </div>

            {currentHeroImages.length === 0 ? (
              <div
                className="p-12 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => triggerUpload(isDesktop ? 'desktop' : 'mobile')}
              >
                <ImageIcon size={40} />
                <span className="text-sm mt-2">Sin imagenes</span>
                <span className="text-xs mt-1">Haz click para agregar</span>
              </div>
            ) : (
              <>
                <div className={`relative bg-black ${isDesktop ? 'aspect-video' : 'aspect-[9/16] max-w-[390px] mx-auto'}`}>
                  {currentHeroImages.map((img, i) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={`Hero ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: i === previewIndex ? 1 : 0, transition: 'opacity 0.3s' }}
                    />
                  ))}
                </div>
                <div className="p-3 flex gap-2 overflow-x-auto bg-gray-50">
                  {currentHeroImages.map((img, i) => (
                    <div
                      key={img.id}
                      className={`relative flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${
                        i === previewIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setPreviewIndex(i)}
                    >
                      <img
                        src={img.url}
                        alt={`Thumb ${i + 1}`}
                        className={`h-16 w-auto object-cover ${isDesktop ? 'aspect-video' : 'aspect-[9/16] h-20'}`}
                      />
                      <div className="absolute inset-0 group">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {i > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveImage(isDesktop ? 'desktop' : 'mobile', i, i - 1) }}
                              className="p-1 bg-white rounded-full text-gray-700 text-xs"
                            >
                              &larr;
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteImage(isDesktop ? 'desktop' : 'mobile', img.id) }}
                            className="p-1 bg-red-500 rounded-full text-white"
                          >
                            <Trash2 size={10} />
                          </button>
                          {i < currentHeroImages.length - 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); moveImage(isDesktop ? 'desktop' : 'mobile', i, i + 1) }}
                              className="p-1 bg-white rounded-full text-gray-700 text-xs"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                      <span className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-sm">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
