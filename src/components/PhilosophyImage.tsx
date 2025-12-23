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

    gsap.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 1.1,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        delay: index * 0.15,
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
      className="relative aspect-[4/3] overflow-hidden rounded-lg group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          // Fallback placeholder
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <div class="text-accent/30 text-4xl">${index + 1}</div>
              </div>
            `
          }
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}


