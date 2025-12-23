import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100)
  })

  const scrollToForm = () => {
    // Close mobile menu first
    setIsMobileMenuOpen(false)
    
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      const formElement = document.getElementById('waitlist-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1,
        y: 0
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-bg-primary/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-bg-primary/60 backdrop-blur-lg'
      }`}
      style={{
        willChange: 'background-color, backdrop-filter',
      }}
    >
      {/* Premium Spiral Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 2"
          preserveAspectRatio="none"
          style={{
            height: '2px',
          }}
        >
          <defs>
            <linearGradient id="navbarSpiralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity={isScrolled ? 0.8 : 0.5} />
              <stop offset="20%" stopColor="#DC2626" stopOpacity={isScrolled ? 1 : 0.7} />
              <stop offset="40%" stopColor="#DC2626" stopOpacity={isScrolled ? 0.6 : 0.4} />
              <stop offset="60%" stopColor="#DC2626" stopOpacity={isScrolled ? 0.9 : 0.6} />
              <stop offset="80%" stopColor="#DC2626" stopOpacity={isScrolled ? 0.5 : 0.3} />
              <stop offset="100%" stopColor="#DC2626" stopOpacity={isScrolled ? 0.7 : 0.4} />
            </linearGradient>
            <filter id="navbarSpiralGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main spiral curve border - flowing wave pattern */}
          <motion.path
            d="M -50 1 Q 150 0.2, 350 1.8 Q 550 0.3, 750 1.7 Q 950 0.4, 1150 1.6 Q 1350 0.2, 1550 1.9 Q 1750 0.3, 1970 1"
            fill="none"
            stroke="url(#navbarSpiralGradient)"
            strokeWidth="2"
            filter="url(#navbarSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isScrolled ? 1 : 0.8 
            }}
            transition={{ 
              duration: 1.5, 
              delay: 0.5, 
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.3 }
            }}
          />
          
          {/* Secondary subtle wave for depth */}
          <motion.path
            d="M -30 1.2 Q 200 0.8, 430 1.5 Q 660 0.6, 890 1.8 Q 1120 0.4, 1350 1.6 Q 1580 0.3, 1950 1.1"
            fill="none"
            stroke="url(#navbarSpiralGradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isScrolled ? 0.6 : 0.4 
            }}
            transition={{ 
              duration: 1.8, 
              delay: 0.7, 
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.3 }
            }}
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl font-bold tracking-tight cursor-pointer focus:outline-none group relative z-10"
          >
            <span 
              className="text-text-primary transition-colors duration-300 group-hover:text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              IRONFORGE
            </span>
            {/* Underline on hover */}
            <motion.div
              className="h-0.5 bg-accent mt-1 hidden lg:block"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Desktop CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 hidden md:block"
          >
            <MagneticButton 
              onClick={scrollToForm}
              className="!px-6 !py-2.5 !text-base"
            >
              Join Waitlist
            </MagneticButton>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-10 p-2 focus:outline-none"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                className="w-full h-0.5 bg-text-primary rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-full h-0.5 bg-text-primary rounded-full"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-full h-0.5 bg-text-primary rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-border-primary/50 mt-4 pb-6"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="pt-6 space-y-4"
              >
                <motion.button
                  onClick={scrollToForm}
                  className="w-full py-4 px-6 bg-accent hover:bg-accent-hover text-text-primary font-bold text-base tracking-wider rounded-lg transition-all duration-300 active:scale-[0.98]"
                  whileTap={{ scale: 0.98 }}
                >
                  Join Waitlist
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}


