import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { staggerContainer, staggerItem } from '../lib/animations'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    number: '01',
    title: 'Founding Member Access',
    description: 'Be among the first to experience Ironforge programs before public launch.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    number: '02',
    title: 'Founding Member Pricing',
    description: 'Lock in lifetime pricing reserved for those who join early.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    number: '03',
    title: 'Philosophy First',
    description: 'Access to the core principles and methodology before the noise of marketing.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    number: '04',
    title: 'Founding Circle',
    description: 'Join a private space for serious practitioners committed to the long game.'
  }
]

export default function WaitlistBenefits() {
  const { ref, controls } = useScrollAnimation(0.2)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return

      // Premium scroll reveal with rotation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
          rotationY: -15,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Premium hover 3D effect
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 15
        const rotateY = (centerX - x) / 15

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
            radial-gradient(ellipse at center, rgba(220, 38, 38, 0.08) 0%, transparent 70%),
            linear-gradient(180deg, transparent 0%, rgba(220, 38, 38, 0.03) 50%, transparent 100%)
          `,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
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
            Founding Member Benefits
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Exclusive access for those who join early
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {benefits.map((benefit, index) => (
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
              {/* Premium glassmorphic card */}
              <div 
                className="relative h-full p-10 lg:p-12 bg-bg-secondary/30 backdrop-blur-md border border-border-primary/50 hover:border-accent/60 hover:bg-bg-secondary/50 transition-all duration-700"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  willChange: 'transform',
                }}
              >
                {/* Premium icon container with glow */}
                <div className="flex items-start justify-between mb-8">
                  <div 
                    className="p-4 bg-accent/10 border border-accent/30 rounded-xl text-accent group-hover:bg-accent/20 group-hover:border-accent/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)',
                      filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.3))',
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <div 
                    className="text-5xl lg:text-6xl font-black select-none pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: '1',
                    }}
                  >
                    {benefit.number}
                  </div>
                </div>

                <h3 
                  className="text-2xl lg:text-3xl font-bold mb-4"
                  style={{
                    letterSpacing: '-0.02em',
                  }}
                >
                  {benefit.title}
                </h3>
                <p 
                  className="text-text-secondary leading-relaxed text-lg"
                  style={{
                    lineHeight: '1.8',
                  }}
                >
                  {benefit.description}
                </p>

                {/* Premium animated accent line */}
                <div 
                  className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-accent to-accent/50 group-hover:w-full transition-all duration-700"
                  style={{
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
                  }}
                />

                {/* Premium hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-lg"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
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


