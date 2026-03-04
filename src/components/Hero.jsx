'use client'

import { useState, useEffect, useRef } from 'react'

export default function Hero() {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth
        const newHeight = containerRef.current.offsetHeight
        
        setDimensions(prev => {
          if (prev.width !== newWidth) {
            return { width: newWidth, height: newHeight }
          }
          return prev
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const desktopCallouts = [
    {
      id: 'cintura',
      title: 'Ajuste Órbita',
      description: 'Control de abdomen',
      pointX: 52.9,
      pointY: 67.5,
      boxOffsetX: 165,
      boxOffsetY: -86
    },
    {
      id: 'bolsillo',
      title: 'Efecto Zenith',
      description: 'Realce 100% natural',
      pointX: 46.9,
      pointY: 56.9,
      boxOffsetX: -151,
      boxOffsetY: -92
    },
    {
      id: 'bota',
      title: 'Corte Estela',
      description: 'Longitud adaptable',
      pointX: 47.8,
      pointY: 91.2,
      boxOffsetX: -142,
      boxOffsetY: -77
    }
  ]

  const mobileCallouts = [
    {
      id: 'cintura',
      title: 'Ajuste Órbita',
      description: 'Control de abdomen',
      pointX: 52.9,
      pointY: 67.5,
      boxOffsetX: 107,
      boxOffsetY: -145
    },
    {
      id: 'bolsillo',
      title: 'Efecto Zenith',
      description: 'Realce 100% natural',
      pointX: 46.9,
      pointY: 56.9,
      boxOffsetX: -93,
      boxOffsetY: -130
    },
    {
      id: 'bota',
      title: 'Corte Estela',
      description: 'Longitud adaptable',
      pointX: 47.8,
      pointY: 91.2,
      boxOffsetX: -106,
      boxOffsetY: -143
    }
  ]

  const callouts = isMobile ? mobileCallouts : desktopCallouts

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-svh overflow-hidden"
    >
      <img
        src="/hero.png"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        src="/bg2.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      >
        {callouts.map((callout) => {
          const pointXpx = (callout.pointX / 100) * dimensions.width
          const pointYpx = (callout.pointY / 100) * dimensions.height
          const boxXpx = pointXpx + callout.boxOffsetX
          const boxYpx = pointYpx + callout.boxOffsetY
          
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
      
      {callouts.map((callout) => {
        const pointLeft = `${callout.pointX}%`
        const pointTop = `${callout.pointY}%`
        const boxX = `calc(${callout.pointX}% + ${callout.boxOffsetX}px)`
        const boxY = `calc(${callout.pointY}% + ${callout.boxOffsetY}px)`
        
        return (
          <div key={callout.id}>
            <div
              className="absolute w-3 h-3 bg-white rounded-full shadow-lg z-10"
              style={{ left: pointLeft, top: pointTop, transform: 'translate(-50%, -50%)' }}
            />
            
            <div
              className="absolute bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30 whitespace-nowrap z-20"
              style={{ 
                left: boxX,
                top: boxY,
                transform: 'translate(-50%, -50%)'
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
