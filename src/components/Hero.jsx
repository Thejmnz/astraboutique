import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function Hero() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [mobileState, setMobileState] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [callouts, setCallouts] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [heroImages, setHeroImages] = useState({ desktop: [], mobile: [] })
  const [currentSlide, setCurrentSlide] = useState(0)
  const drawCalloutsRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const onResize = () => setMobileState(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase
        .from('hero_images')
        .select('*')
        .order('position', { ascending: true })
      if (data) {
        const images = { desktop: [], mobile: [] }
        data.forEach(row => { images[row.type].push(row.url) })
        setHeroImages(images)
      }
    }
    fetchHeroImages()
  }, [])

  useEffect(() => {
    const fetchCallouts = async () => {
      const { data } = await supabase
        .from('hero_callouts')
        .select('*')
        .eq('is_desktop', !mobileState)
        .order('position', { ascending: true })
      setCallouts(data || [])
      setLoaded(true)
    }
    fetchCallouts()
  }, [mobileState])

  const activeCallouts = loaded ? callouts : []

  const slides = mobileState ? heroImages.mobile : heroImages.desktop

  useEffect(() => {
    setCurrentSlide(0)
  }, [mobileState])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (slides.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [slides.length])

  const drawLines = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const w = container.offsetWidth
    const h = container.offsetHeight
    const dpr = window.devicePixelRatio || 1

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    activeCallouts.forEach(callout => {
      const pointX = callout.point_x ?? callout.pointX
      const pointY = callout.point_y ?? callout.pointY
      const boxOffsetX = callout.box_offset_x ?? callout.boxOffsetX
      const boxOffsetY = callout.box_offset_y ?? callout.boxOffsetY

      const px = (pointX / 100) * w
      const py = (pointY / 100) * h
      const bx = px + boxOffsetX
      const by = py + boxOffsetY

      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px, by)
      ctx.lineTo(bx, by)
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [activeCallouts])

  useEffect(() => {
    drawCalloutsRef.current = drawLines
  }, [drawLines])

  useEffect(() => {
    drawLines()
  }, [drawLines])

  useEffect(() => {
    const onResize = () => {
      if (drawCalloutsRef.current) drawCalloutsRef.current()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-svh overflow-hidden">
      {slides.length > 0 && (
        <>
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Hero ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ zIndex: 1, opacity: i === currentSlide ? 1 : 0 }}
            />
          ))}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10 }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />

      {activeCallouts.map(callout => {
        const pointX = callout.point_x ?? callout.pointX
        const pointY = callout.point_y ?? callout.pointY
        const boxOffsetX = callout.box_offset_x ?? callout.boxOffsetX
        const boxOffsetY = callout.box_offset_y ?? callout.boxOffsetY

        return (
          <div key={callout.id}>
            <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg" style={{ left: `${pointX}%`, top: `${pointY}%`, transform: 'translate(-50%, -50%)', zIndex: 4 }}>
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
            </div>
            <div className="absolute bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30 whitespace-nowrap" style={{ left: `calc(${pointX}% + ${boxOffsetX}px)`, top: `calc(${pointY}% + ${boxOffsetY}px)`, transform: 'translate(-50%, -50%)', zIndex: 5 }}>
              <p className="text-white text-xs font-bold">{callout.title}</p>
              <p className="text-white/70 text-[10px]">{callout.description}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
