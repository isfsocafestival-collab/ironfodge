import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const spiralRef = useRef<SVGSVGElement>(null)
  const floating1Ref = useRef<HTMLDivElement>(null)
  const floating2Ref = useRef<HTMLDivElement>(null)
  const floating3Ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const svgMaskRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!backgroundRef.current) return

    // Advanced parallax background
    gsap.to(backgroundRef.current, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: backgroundRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // SVG mask setup - no animation, just positioning
    if (headlineRef.current && svgMaskRef.current) {
      const headline = headlineRef.current
      // Get original text content - handle <br /> tags properly
      const htmlContent = headline.innerHTML
      const lines = htmlContent
        .replace(/<br\s*\/?>/gi, '|||LINEBREAK|||')
        .replace(/<[^>]*>/g, '')
        .split('|||LINEBREAK|||')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      // Fallback to explicit lines if parsing fails
      const explicitLines = [
        'Strength forged in discipline.',
        'Built for longevity.'
      ]
      
      // Wait for DOM to render, then position SVG mask
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!headlineRef.current || !svgMaskRef.current) return
          
          // Get the h1 dimensions and position for SVG mask
          const h1Rect = headline.getBoundingClientRect()
          const sectionRect = headline.closest('section')?.getBoundingClientRect()
          
          if (!sectionRect) return
          
          // Update SVG mask with text positioning
          const svg = svgMaskRef.current
          const computedStyle = window.getComputedStyle(headline)
          const fontSize = computedStyle.fontSize
          
          // Update text element in SVG mask
          const textElement = svg.querySelector('#mask-text') as SVGTextElement
          if (textElement) {
            // Calculate center position relative to section
            const centerX = sectionRect.width / 2
            const h1Top = h1Rect.top - sectionRect.top
            const h1CenterY = h1Top + h1Rect.height / 2
            
            // Clear any existing content
            textElement.innerHTML = ''
            
            // Set base text attributes
            textElement.setAttribute('font-size', fontSize)
            textElement.setAttribute('font-weight', '900')
            textElement.setAttribute('text-anchor', 'middle')
            textElement.setAttribute('dominant-baseline', 'middle')
            textElement.setAttribute('letter-spacing', '-0.02em')
            
            // Handle line breaks properly with tspan elements
            const textLines = lines.length >= 2 ? lines : explicitLines
            
            if (textLines.length >= 2) {
              const lineHeight = parseFloat(fontSize) * 1.15
              const totalHeight = lineHeight * (textLines.length - 1)
              const startY = h1CenterY - (totalHeight / 2)
              
              // Clear and rebuild tspan elements
              textElement.innerHTML = ''
              
              textLines.forEach((line, i) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
                tspan.setAttribute('x', centerX.toString())
                tspan.setAttribute('y', (startY + (i * lineHeight)).toString())
                tspan.textContent = line
                textElement.appendChild(tspan)
              })
            } else {
              textElement.setAttribute('x', centerX.toString())
              textElement.setAttribute('y', h1CenterY.toString())
              textElement.textContent = textLines[0] || explicitLines[0]
            }
            
            // Update video container to cover the entire section - ensures full text coverage
            const videoContainer = svg.querySelector('#video-container') as SVGForeignObjectElement
            if (videoContainer) {
              // Cover the entire section so video shows through all text without cropping
              videoContainer.setAttribute('x', '0')
              videoContainer.setAttribute('y', '0')
              videoContainer.setAttribute('width', sectionRect.width.toString())
              videoContainer.setAttribute('height', sectionRect.height.toString())
            }
          }
        })
      })
    }

    // Auto-play video when ready
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, user interaction required
      })
    }

    // Subtitle reveal with stagger
    if (subtitleRef.current) {
      const subtitleElements = subtitleRef.current.querySelectorAll('span, p')
      gsap.fromTo(
        subtitleElements,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.2,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }

    // Animated grid pattern
    const gridPattern = document.querySelector('.grid-pattern') as HTMLElement
    if (gridPattern) {
      gsap.to(gridPattern, {
        backgroundPosition: '50px 50px',
        duration: 20,
        repeat: -1,
        ease: 'none',
      })
    }

    // Parallax effect for spiral lines
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

    // Parallax effects for floating elements
    if (floating1Ref.current) {
      gsap.to(floating1Ref.current, {
        y: -window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: floating1Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    if (floating2Ref.current) {
      gsap.to(floating2Ref.current, {
        y: -window.innerHeight * 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: floating2Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    if (floating3Ref.current) {
      gsap.to(floating3Ref.current, {
        y: -window.innerHeight * 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: floating3Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Premium hero image background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
      >
        {/* Hero image - replace with your actual image */}
        <img
          src="/hero-image.jpg"
          alt="Ironforge Strength Training"
          className="w-full h-full object-cover opacity-20"
          onError={(e) => {
            // Fallback to gradient if image doesn't exist
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
        {/* Fallback gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, #111827 0%, #000000 50%, #000000 100%)',
          }}
        />
      </div>

      {/* Animated gradient mesh */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Premium animated grid pattern */}
      <div 
        ref={floating1Ref}
        className="grid-pattern absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          willChange: 'transform',
        }}
      />

      {/* Premium floating accent orbs with parallax */}
      <div
        ref={floating2Ref}
        className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={floating3Ref}
        className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          willChange: 'transform',
        }}
      />

      {/* Premium noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#DC2626" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
            <filter id="spiralGlow">
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
            stroke="url(#spiralGradient)"
            strokeWidth="2.5"
            filter="url(#spiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
          />
          
          {/* Secondary spiral curve - more pronounced */}
          <motion.path
            d="M -50 350 Q 400 250, 800 350 Q 1200 450, 1600 550 Q 1800 600, 2020 700 L 2020 700"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="2"
            filter="url(#spiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          />
          
          {/* Tertiary accent curve - subtle */}
          <motion.path
            d="M 0 550 Q 500 450, 1000 550 Q 1400 650, 1920 750 L 2020 750"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="1.5"
            filter="url(#spiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 3.5, delay: 1.2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* SVG Mask with Video Fill */}
      <svg
        ref={svgMaskRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="text-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <text
              id="mask-text"
              fill="white"
              fontFamily="system-ui, -apple-system, sans-serif"
              style={{ whiteSpace: 'pre' }}
            />
          </mask>
        </defs>
        <foreignObject
          id="video-container"
          mask="url(#text-mask)"
          width="100%"
          height="100%"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          >
            <source src="/workout.mp4" type="video/mp4" />
            {/* Fallback if video doesn't exist - you can add multiple sources */}
          </video>
        </foreignObject>
      </svg>

      {/* Premium Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto pt-20 pb-20 flex flex-col items-center justify-center" style={{ minHeight: '100vh', paddingTop: 'clamp(2rem, 5vh, 4rem)', paddingBottom: 'clamp(2rem, 5vh, 4rem)' }}>
        {/* Premium badge with glow effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mb-12"
        >
          <span 
            className="inline-block px-6 py-3 border border-accent/40 bg-accent/10 rounded-full text-accent text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm"
            style={{
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.2), inset 0 0 20px rgba(220, 38, 38, 0.1)',
            }}
          >
            IRONFORGE
          </span>
        </motion.div>

        {/* Hidden h1 used only for positioning - SVG mask shows the actual text with video */}
        <h1
          ref={headlineRef}
          className="text-balance font-black tracking-[-0.02em] mb-12 relative"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 7rem)',
            lineHeight: '1.15',
            textAlign: 'center',
            width: '100%',
            maxWidth: '90vw',
            marginLeft: 'auto',
            marginRight: 'auto',
            // Completely hide - only used for positioning SVG mask
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          Strength forged in discipline.
          <br />
          Built for longevity.
        </h1>

        {/* Premium subtitle with split design */}
        <div
          ref={subtitleRef}
          className="max-w-4xl mx-auto"
          style={{
            marginTop: 'clamp(28rem, 60vh, 42rem)',
            marginBottom: 'clamp(4rem, 10vh, 6rem)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            {/* Left accent line */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            
            {/* Split text design */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <span 
                className="text-text-primary text-lg md:text-xl font-medium tracking-wider uppercase"
                style={{
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
                }}
              >
                A methodology
              </span>
              <span className="text-accent text-2xl md:text-3xl font-light">—</span>
              <span 
                className="text-text-secondary text-lg md:text-xl font-light italic"
                style={{
                  letterSpacing: '0.05em',
                }}
              >
                designed for those
              </span>
            </div>
            
            {/* Right accent line */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent" />
          </div>
          
          {/* Bottom emphasis line */}
          <p 
            className="text-text-primary text-2xl md:text-3xl font-bold tracking-tight"
            style={{
              letterSpacing: '-0.01em',
              textShadow: '0 0 20px rgba(220, 38, 38, 0.2)',
            }}
          >
            committed to the long game
          </p>
        </div>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.4,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{
            marginTop: 'clamp(3rem, 8vh, 5rem)',
          }}
        >
          <MagneticButton onClick={() => {
            document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Join the Ironforge Waitlist
          </MagneticButton>
        </motion.div>

        {/* Subtle scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-accent/30 via-accent/20 to-transparent"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

