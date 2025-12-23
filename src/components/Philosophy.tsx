
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { staggerContainer, staggerItem } from '../lib/animations'
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

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return

      // 3D tilt effect on hover
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

      // Scroll-triggered reveal with scale and rotation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotationX: -15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      return () => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  }, [])

  return (
    <section 
      ref={ref}
      className="py-40 px-8 relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <h2
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Our Philosophy
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Four principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
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

              {/* Premium card with glassmorphism */}
              <div 
                className="relative h-full p-10 lg:p-12 border border-border-primary/50 bg-bg-secondary/20 backdrop-blur-sm hover:border-accent/60 hover:bg-bg-secondary/40 transition-all duration-700"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  willChange: 'transform',
                }}
              >
                {/* Premium accent line with glow */}
                <div 
                  className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
                  }}
                />

                {/* Premium icon with animated glow */}
                <div 
                  className="text-accent mb-8 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.3))',
                  }}
                >
                  {section.icon}
                </div>

                {/* Premium content */}
                <h3
                  className="font-bold mb-5 text-2xl lg:text-3xl leading-tight"
                  style={{ 
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {section.heading}
                </h3>
                
                <p 
                  className="text-accent/90 font-semibold mb-6 text-sm tracking-[0.15em] uppercase"
                  style={{
                    letterSpacing: '0.15em',
                  }}
                >
                  {section.summary}
                </p>
                
                <p 
                  className="text-text-secondary leading-relaxed text-lg"
                  style={{
                    lineHeight: '1.8',
                  }}
                >
                  {section.paragraph}
                </p>

                {/* Premium number indicator with gradient */}
                <div 
                  className="absolute top-8 right-8 text-7xl lg:text-8xl font-black select-none pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Premium hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

