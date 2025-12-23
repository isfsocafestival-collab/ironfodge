import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PhilosophyImageProps {
  src: string
  alt: string
  index: number
}

export default function PhilosophyImage({ src, alt, index }: PhilosophyImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!imageRef.current) return

    // Reduced animation intensity on mobile
    const isMobile = window.innerWidth < 768
    const mobileY = isMobile ? 20 : 30
    const mobileScale = isMobile ? 1.05 : 1.1
    const mobileDuration = isMobile ? 0.6 : 1.2

    gsap.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: mobileScale,
        y: mobileY,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: mobileDuration,
        delay: index * (isMobile ? 0.1 : 0.15),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [index])

  return (
    <motion.div
      ref={imageRef}
      className="relative aspect-[4/3] overflow-hidden rounded-lg group md:group-hover:scale-[1.02] transition-transform duration-300"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          // Fallback placeholder - hide image if it fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5"></div>
            `
          }
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}


