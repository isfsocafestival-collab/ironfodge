
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VisualShowcase() {
  const { ref, controls } = useScrollAnimation(0.3)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    imageRefs.current.forEach((imageRef, index) => {
      if (!imageRef) return

      // Reduced animation intensity on mobile
      const isMobile = window.innerWidth < 768
      const mobileY = isMobile ? 30 : 50
      const mobileScale = isMobile ? 0.95 : 0.9
      const mobileDuration = isMobile ? 0.6 : 1

      gsap.fromTo(
        imageRef,
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
            trigger: imageRef,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
  }, [])

  const images = [
    { src: '/showcase-1.jpg', alt: 'Strength training session' },
    { src: '/showcase-2.jpg', alt: 'Core strength focus' },
    { src: '/showcase-3.jpg', alt: 'Precision movement' },
  ]

  return (
    <section 
      ref={ref}
      className="py-20 md:py-40 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-10 md:mb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <h2
            className="font-bold mb-3 md:mb-4"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
          >
            Built for the Long Game
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            See the methodology in action
          </p>
        </motion.div>

        {/* Premium image grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                imageRefs.current[index] = el
              }}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg md:group-hover:-translate-y-2 transition-transform duration-300"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  // Fallback placeholder - hide image if it fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5"></div>
                    `
                  }
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Accent border on hover */}
              <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-500 rounded-lg" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

