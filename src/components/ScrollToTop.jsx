import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const saved = sessionStorage.getItem(`scroll-${pathname}`)
    if (saved) {
      const pos = parseInt(saved, 10)
      let attempts = 0
      const restore = () => {
        window.scrollTo(0, pos)
        attempts++
        if (attempts < 5 && Math.abs(window.scrollY - pos) > 20) {
          setTimeout(restore, 300)
        }
      }
      setTimeout(restore, 100)
      sessionStorage.removeItem(`scroll-${pathname}`)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY)
    }

    const handleClick = (e) => {
      const link = e.target.closest('a[href^="/producto/"]')
      if (link) {
        sessionStorage.setItem(`scroll-${pathname}`, window.scrollY)
      }
    }

    window.addEventListener('scroll', saveScroll, { passive: true })
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('scroll', saveScroll)
      window.removeEventListener('click', handleClick)
    }
  }, [pathname])

  return null
}
