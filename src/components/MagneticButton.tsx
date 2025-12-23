import { ReactNode, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagneticHover } from '../hooks/useMagneticHover'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function MagneticButton({ 
  children, 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false 
}: MagneticButtonProps) {
  const magneticRef = useMagneticHover(0.25)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleClick = (e: MouseEvent) => {
      if (!rippleRef.current) return
      
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.fromTo(
        rippleRef.current,
        {
          x: x,
          y: y,
          scale: 0,
          opacity: 0.6,
        },
        {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      )
    }

    button.addEventListener('click', handleClick)
    return () => button.removeEventListener('click', handleClick)
  }, [])

  return (
    <motion.button
      ref={(node) => {
        if (node) {
          magneticRef.current = node
          buttonRef.current = node
        }
      }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative px-8 py-5 md:px-14 md:py-7 overflow-hidden rounded-lg
        bg-gradient-to-br from-accent via-accent to-accent-hover
        hover:from-accent-hover hover:via-accent hover:to-accent
        text-text-primary font-bold text-base md:text-lg tracking-[0.1em]
        transition-all duration-700
        disabled:opacity-50 disabled:cursor-not-allowed
        w-full md:w-auto
        min-h-[56px] md:min-h-0
        ${className}
      `}
      style={{
        boxShadow: `
          0 8px 32px rgba(220, 38, 38, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(220, 38, 38, 0.3)
        `,
        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #DC2626 100%)',
      }}
      whileHover={{ 
        scale: 1.06,
        y: -2,
        boxShadow: `
          0 12px 48px rgba(220, 38, 38, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(220, 38, 38, 0.5),
          0 0 40px rgba(220, 38, 38, 0.4)
        `,
      }}
      whileTap={{ scale: 0.98, y: 0 }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Premium animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Premium ripple effect */}
      <span
        ref={rippleRef}
        className="absolute w-6 h-6 bg-white/80 rounded-full pointer-events-none blur-sm"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Premium shine sweep effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Premium inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Premium content container */}
      <span className="relative z-10 flex items-center justify-center gap-4">
        {/* Premium dot indicator with pulse */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="absolute inset-0 w-3 h-3 rounded-full bg-text-primary"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="relative w-3 h-3 rounded-full bg-text-primary block" />
        </motion.div>

        {/* Text with premium styling */}
        <span 
          className="relative"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.1em',
          }}
        >
          {children}
        </span>

        {/* Premium arrow icon with animation */}
        <motion.div
          className="relative"
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.svg
            className="w-6 h-6 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
          {/* Arrow trail effect */}
          <motion.div
            className="absolute inset-0 w-6 h-6 bg-text-primary/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </span>

      {/* Premium corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Premium outer glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(220, 38, 38, 0.1))',
          filter: 'blur(8px)',
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  )
}

