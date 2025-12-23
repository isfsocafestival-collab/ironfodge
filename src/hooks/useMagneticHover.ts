import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useMagneticHover(strength = 0.3) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Disable magnetic effect on mobile devices
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const rect = element.getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left - rect.width / 2
      const y = mouseEvent.clientY - rect.top - rect.height / 2

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.6,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
    }

    element.addEventListener('mousemove', handleMouseMove as EventListener)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return ref
}


