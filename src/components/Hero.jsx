'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Hero() {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [callouts, setCallouts] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    const checkMobile = () => { isMobileRef.current = window.innerWidth < 768 }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [mobileState, setMobileState] = useState(isMobileRef.current)

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const onResize = () => setMobileState(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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

  const fallbackCallouts = mobileState ? [
    { pointX: 52.9, pointY: 67.5, boxOffsetX: 107, boxOffsetY: -145 },
    { pointX: 46.9, pointY: 56.9, boxOffsetX: -93, boxOffsetY: -130 },
    { pointX: 47.8, pointY: 91.2, boxOffsetX: -106, boxOffsetY: -143 },
  ] : [
    { pointX: 52.9, pointY: 67.5, boxOffsetX: 165, boxOffsetY: -86 },
    { pointX: 46.9, pointY: 56.9, boxOffsetX: -151, boxOffsetY: -92 },
    { pointX: 47.8, pointY: 91.2, boxOffsetX: -142, boxOffsetY: -77 },
  ]

  const activeCallouts = loaded
    ? (callouts.length > 0 ? callouts : fallbackCallouts)
    : []

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-svh overflow-hidden"
    >
      <img
        src="/hero.png"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />
      <img
        src="/bg2.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 2 }}
      />
      
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
        width={dimensions.width || undefined}
        height={dimensions.height || undefined}
      >
        {dimensions.width > 0 && activeCallouts.map((callout) => {
          const pointX = callout.point_x ?? callout.pointX
          const pointY = callout.point_y ?? callout.pointY
          const boxOffsetX = callout.box_offset_x ?? callout.boxOffsetX
          const boxOffsetY = callout.box_offset_y ?? callout.boxOffsetY
          
          const pointXpx = (pointX / 100) * dimensions.width
          const pointYpx = (pointY / 100) * dimensions.height
          const boxXpx = pointXpx + boxOffsetX
          const boxYpx = pointYpx + boxOffsetY
          
          return (
            <path
              key={callout.id}
              d={`M ${pointXpx},${pointYpx} L ${pointXpx},${boxYpx} L ${boxXpx},${boxYpx}`}
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1"
            />
          )
        })}
      </svg>
      
      {activeCallouts.map((callout) => {
        const pointX = callout.point_x ?? callout.pointX
        const pointY = callout.point_y ?? callout.pointY
        const boxOffsetX = callout.box_offset_x ?? callout.boxOffsetX
        const boxOffsetY = callout.box_offset_y ?? callout.boxOffsetY
        
        const pointLeft = `${pointX}%`
        const pointTop = `${pointY}%`
        const boxX = `calc(${pointX}% + ${boxOffsetX}px)`
        const boxY = `calc(${pointY}% + ${boxOffsetY}px)`
        
        return (
          <div key={callout.id}>
            <div
              className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
              style={{ left: pointLeft, top: pointTop, transform: 'translate(-50%, -50%)', zIndex: 4 }}
            />
            
            <div
              className="absolute bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30 whitespace-nowrap"
              style={{ 
                left: boxX,
                top: boxY,
                transform: 'translate(-50%, -50%)',
                zIndex: 5
              }}
            >
              <p className="text-white text-xs font-bold">{callout.title}</p>
              <p className="text-white/70 text-[10px]">{callout.description}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
