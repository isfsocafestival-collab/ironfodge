import { useState, FormEvent, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { submitToWaitlist } from '../lib/supabase'
import MagneticButton from './MagneticButton'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { ref, controls } = useScrollAnimation(0.3)
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all fields.')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await submitToWaitlist({ name: name.trim(), email: email.trim().toLowerCase() })
      setStatus('success')
      setName('')
      setEmail('')
    } catch (error: any) {
      setStatus('error')
      if (error.code === '23505') {
        setErrorMessage('This email is already on the waitlist.')
      } else {
        setErrorMessage('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section 
      id="waitlist-form"
      ref={ref}
      className="py-20 md:py-32 px-4 md:px-8 relative"
    >
      {/* Background gradient with accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-50" />

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
            <linearGradient id="waitlistSpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#DC2626" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
            <filter id="waitlistSpiralGlow">
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
            stroke="url(#waitlistSpiralGradient)"
            strokeWidth="2.5"
            filter="url(#waitlistSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
          />
          
          {/* Secondary spiral curve - more pronounced */}
          <motion.path
            d="M -50 350 Q 400 250, 800 350 Q 1200 450, 1600 550 Q 1800 600, 2020 700 L 2020 700"
            fill="none"
            stroke="url(#waitlistSpiralGradient)"
            strokeWidth="2"
            filter="url(#waitlistSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          />
          
          {/* Tertiary accent curve - subtle */}
          <motion.path
            d="M 0 550 Q 500 450, 1000 550 Q 1400 650, 1920 750 L 2020 750"
            fill="none"
            stroke="url(#waitlistSpiralGradient)"
            strokeWidth="1.5"
            filter="url(#waitlistSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3.5, delay: 1.2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="mb-8 md:mb-12 px-4"
        >
          <div className="inline-block mb-4 md:mb-6">
            <span className="px-3 py-1.5 md:px-4 md:py-2 border border-accent/30 bg-accent/5 rounded-full text-accent text-xs md:text-sm font-semibold tracking-wider">
              JOIN THE WAITLIST
            </span>
          </div>
          <h2
            className="font-bold mb-4 md:mb-6"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
          >
            This is not for everyone.
          </h2>
          
          <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            But if this resonates, join us.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 md:p-12 border-2 border-success bg-success/5 rounded-lg"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
                >
                  <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-success text-xl font-semibold">
                  Thank you. We'll be in touch soon.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5 md:space-y-6 bg-bg-secondary/40 border border-border-primary p-6 md:p-8 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                animate: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.8, 
                    delay: 0.2,
                    staggerChildren: 0.1
                  } 
                }
              }}
            >
              <motion.div
                variants={{
                  animate: { opacity: 1, y: 0 }
                }}
                className="relative"
              >
                <label className="block text-left text-text-secondary text-sm mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-bg-tertiary/50 border border-border-primary focus:border-accent outline-none py-4 md:py-4 px-4 rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:bg-bg-tertiary focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] text-base"
                  disabled={isSubmitting}
                  aria-label="Name"
                  autoComplete="name"
                />
              </motion.div>

              <motion.div
                variants={{
                  animate: { opacity: 1, y: 0 }
                }}
                className="relative"
              >
                <label className="block text-left text-text-secondary text-sm mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-bg-tertiary/50 border border-border-primary focus:border-accent outline-none py-4 md:py-4 px-4 rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:bg-bg-tertiary focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] text-base"
                  disabled={isSubmitting}
                  aria-label="Email"
                  autoComplete="email"
                  inputMode="email"
                />
              </motion.div>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-error text-sm"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                variants={{
                  animate: { opacity: 1, y: 0 }
                }}
                className="pt-2"
              >
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </MagneticButton>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}


