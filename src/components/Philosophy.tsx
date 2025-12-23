
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PhilosophyImage from './PhilosophyImage'

gsap.registerPlugin(ScrollTrigger)

const philosophySections = [
  {
    image: '/philosophy-1.jpg', // Long-term strength training
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    heading: "This is not a 12-week program.",
    summary: "Strength is a system you build over decades, not a destination reached in months.",
    paragraph: "Ironforge is built on the principle that true strength comes from consistency over years, not intensity over weeks. We reject the culture of quick fixes. What we offer is a methodology designed to serve you for life."
  },
  {
    image: '/philosophy-2.jpg', // Core strength training
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    heading: "All power flows from the center.",
    summary: "Core strength is the foundation of every movement, the source of all power.",
    paragraph: "At Ironforge, core strength is not a separate category—it is integrated into every movement, every program, every progression. We build from the center outward, because that is how the body is designed to function."
  },
  {
    image: '/philosophy-3.jpg', // Discipline and consistency
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    heading: "Motivation fades. Discipline remains.",
    summary: "The system you build so that you train regardless of how you feel.",
    paragraph: "Ironforge provides the structure, the methodology, the clear path forward. But the discipline—the decision to show up, to execute, to persist—that comes from you. We give you the tools. You bring the commitment."
  },
  {
    image: '/philosophy-4.jpg', // Precision and form
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    heading: "Every rep matters. Every movement intentional.",
    summary: "Quality over quantity. Form over ego. The path to mastery.",
    paragraph: "Every movement in Ironforge is designed with intention, and every execution should match that intention. The path to mastery is not paved with heavy weights lifted poorly—it is built on consistent, intentional practice over time."
  }
]

export default function Philosophy() {
  const { ref, controls } = useScrollAnimation(0.2)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const spiralRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Disable parallax on mobile for better performance
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    // Parallax effect for spiral lines - desktop only
    if (spiralRef.current) {
      gsap.to(spiralRef.current, {
        y: -50,
        rotation: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: spiralRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
  }, [])

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return

      // Disable 3D tilt effect on mobile
      const isMobile = window.innerWidth < 768
      
      if (!isMobile) {
        // 3D tilt effect on hover - desktop only
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = (y - centerY) / 10
          const rotateY = (centerX - x) / 10

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out',
          })
        }

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
        }

        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          card.removeEventListener('mousemove', handleMouseMove)
          card.removeEventListener('mouseleave', handleMouseLeave)
        }
      }

      // Scroll-triggered reveal - reduced intensity on mobile
      const mobileY = isMobile ? 30 : 60
      const mobileScale = isMobile ? 0.95 : 0.9
      const mobileRotationX = isMobile ? 0 : -15
      const mobileDuration = isMobile ? 0.6 : 1

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: mobileY,
          scale: mobileScale,
          rotationX: mobileRotationX,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: mobileDuration,
          delay: index * (isMobile ? 0.1 : 0.15),
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
  }, [])

  return (
    <section 
      ref={ref}
      className="py-20 md:py-40 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Premium background with animated gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(220, 38, 38, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(220, 38, 38, 0.03) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Animated mesh gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(135deg, rgba(220, 38, 38, 0.03) 0%, transparent 50%),
            linear-gradient(45deg, rgba(220, 38, 38, 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Premium Spiral Line - Spinal Curvature */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          ref={spiralRef}
          className="absolute w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{
            willChange: 'transform',
          }}
        >
          <defs>
            <linearGradient id="philosophySpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#DC2626" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
            <filter id="philosophySpiralGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main spiral curve - flowing from top-left to bottom-right */}
          <motion.path
            d="M -100 150 Q 300 100, 600 200 Q 900 300, 1200 400 Q 1500 500, 1920 600 L 2020 600"
            fill="none"
            stroke="url(#philosophySpiralGradient)"
            strokeWidth="2.5"
            filter="url(#philosophySpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
          />
          
          {/* Secondary spiral curve - more pronounced */}
          <motion.path
            d="M -50 350 Q 400 250, 800 350 Q 1200 450, 1600 550 Q 1800 600, 2020 700 L 2020 700"
            fill="none"
            stroke="url(#philosophySpiralGradient)"
            strokeWidth="2"
            filter="url(#philosophySpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          />
          
          {/* Tertiary accent curve - subtle */}
          <motion.path
            d="M 0 550 Q 500 450, 1000 550 Q 1400 650, 1920 750 L 2020 750"
            fill="none"
            stroke="url(#philosophySpiralGradient)"
            strokeWidth="1.5"
            filter="url(#philosophySpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3.5, delay: 1.2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-20 px-4"
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
            Our Philosophy
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Four principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {philosophySections.map((section, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className="group relative"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Premium image section */}
              <div className="mb-6">
                <PhilosophyImage 
                  src={section.image} 
                  alt={section.heading}
                  index={index}
                />
              </div>

              {/* Content without card styling */}
              <div className="relative h-full p-6 md:p-10 lg:p-12">
                {/* Premium icon with animated glow */}
                <div 
                  className="text-accent mb-6 md:mb-8 opacity-80 md:group-hover:opacity-100 transition-all duration-500 md:group-hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.3))',
                  }}
                >
                  {section.icon}
                </div>

                {/* Premium content */}
                <h3
                  className="font-bold mb-4 md:mb-5 text-xl md:text-2xl lg:text-3xl leading-tight"
                  style={{ 
                    fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {section.heading}
                </h3>
                
                <p 
                  className="text-accent/90 font-semibold mb-4 md:mb-6 text-xs md:text-sm tracking-[0.15em] uppercase leading-relaxed"
                  style={{
                    letterSpacing: '0.15em',
                  }}
                >
                  {section.summary}
                </p>
                
                <p 
                  className="text-text-secondary leading-relaxed text-base md:text-lg"
                  style={{
                    lineHeight: '1.75',
                  }}
                >
                  {section.paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

