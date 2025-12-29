import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [shouldLoadSpirals, setShouldLoadSpirals] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile and defer non-critical work
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Lazy load video when user interacts or scrolls near hero
  useEffect(() => {
    const handleInteraction = () => {
      if (!shouldLoadVideo) {
        setShouldLoadVideo(true)
      }
    }

    // Load video on user interaction
    const events = ['touchstart', 'click', 'scroll']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    // Or load when hero is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shouldLoadVideo) {
          setShouldLoadVideo(true)
        }
      },
      { rootMargin: '50px' }
    )

    if (headlineRef.current) {
      observer.observe(headlineRef.current)
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
      observer.disconnect()
    }
  }, [shouldLoadVideo])

  // Critical: Background parallax (desktop only) - runs immediately
  useEffect(() => {
    if (!backgroundRef.current || isMobile) return

    const scrollTriggers: ScrollTrigger[] = []

    // Advanced parallax background - desktop only
    const bgTween = gsap.to(backgroundRef.current, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: backgroundRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
    if (bgTween.scrollTrigger) scrollTriggers.push(bgTween.scrollTrigger)

    return () => {
      scrollTriggers.forEach(trigger => {
        try {
          if (trigger) trigger.kill()
        } catch (e) {}
      })
    }
  }, [isMobile])

  // Deferred: SVG mask positioning - runs after first paint
  useEffect(() => {
    // Defer SVG mask setup until after initial render
    const setupSVGMask = () => {
      if (!headlineRef.current || !svgMaskRef.current) return

      const headline = headlineRef.current
      const htmlContent = headline.innerHTML
      const lines = htmlContent
        .replace(/<br\s*\/?>/gi, '|||LINEBREAK|||')
        .replace(/<[^>]*>/g, '')
        .split('|||LINEBREAK|||')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      const explicitLines = [
        'Strength forged',
        'in discipline.',
        'Built for longevity.'
      ]
      
      // Get the h1 dimensions and position for SVG mask
      const h1Rect = headline.getBoundingClientRect()
      const sectionRect = headline.closest('section')?.getBoundingClientRect()
      
      if (!sectionRect) return
      
      const svg = svgMaskRef.current
      const computedStyle = window.getComputedStyle(headline)
      const fontSize = computedStyle.fontSize
      
      const textElement = svg.querySelector('#mask-text') as SVGTextElement
      if (textElement) {
        const centerX = sectionRect.width / 2
        const h1Top = h1Rect.top - sectionRect.top
        const h1CenterY = h1Top + h1Rect.height / 2
        
        textElement.innerHTML = ''
        textElement.setAttribute('font-size', fontSize)
        textElement.setAttribute('font-weight', '900')
        textElement.setAttribute('text-anchor', 'middle')
        textElement.setAttribute('dominant-baseline', 'middle')
        textElement.setAttribute('letter-spacing', '-0.02em')
        
        const textLines = lines.length >= 3 ? lines : explicitLines
        
        if (textLines.length >= 3) {
          const fontSizeNum = parseFloat(fontSize)
          if (isNaN(fontSizeNum) || fontSizeNum === 0) {
            textElement.setAttribute('x', centerX.toString())
            textElement.setAttribute('y', (sectionRect.height / 2).toString())
            textElement.textContent = textLines.join(' ')
            return
          }
          
          const lineHeight = fontSizeNum * 1.15
          const totalHeight = lineHeight * (textLines.length - 1)
          const startY = h1CenterY - (totalHeight / 2)
          
          if (isNaN(startY) || isNaN(centerX) || isNaN(lineHeight)) {
            textElement.setAttribute('x', centerX.toString())
            textElement.setAttribute('y', (sectionRect.height / 2).toString())
            textElement.textContent = textLines.join(' ')
            return
          }
          
          if (textLines.length < 3) {
            while (textLines.length < 3) {
              textLines.push('')
            }
          }
          
          textElement.innerHTML = ''
          
          textLines.forEach((line, i) => {
            const yPos = startY + (i * lineHeight)
            if (!isNaN(yPos) && !isNaN(centerX)) {
              const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
              tspan.setAttribute('x', centerX.toString())
              tspan.setAttribute('y', yPos.toString())
              tspan.textContent = line
              textElement.appendChild(tspan)
            }
          })
        } else {
          const yPos = isNaN(h1CenterY) ? (sectionRect.height / 2) : h1CenterY
          const xPos = isNaN(centerX) ? (sectionRect.width / 2) : centerX
          textElement.setAttribute('x', xPos.toString())
          textElement.setAttribute('y', yPos.toString())
          textElement.textContent = textLines[0] || explicitLines[0]
        }
        
        const videoContainer = svg.querySelector('#video-container') as SVGForeignObjectElement
        if (videoContainer) {
          videoContainer.setAttribute('x', '0')
          videoContainer.setAttribute('y', '0')
          videoContainer.setAttribute('width', sectionRect.width.toString())
          videoContainer.setAttribute('height', sectionRect.height.toString())
        }
      }
    }

    // Defer SVG mask setup until after first paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupSVGMask()
      })
    })
  }, [])

  // Video autoplay - only when video should load
  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return

    const video = videoRef.current
    const playPromise = video.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented, user interaction required
      })
    }
  }, [shouldLoadVideo])

  // Important: Subtitle reveal - runs after first paint
  useEffect(() => {
    if (!subtitleRef.current) return

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
  }, [])

  // Enhancement: Animated grid pattern - deferred
  useEffect(() => {
    if (!floating1Ref.current) return

    const gridPattern = floating1Ref.current
    gsap.to(gridPattern, {
      backgroundPosition: '50px 50px',
      duration: 20,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  // Defer spiral animations until after first paint
  useEffect(() => {
    // Load spirals after a short delay to prioritize content
    const timer = setTimeout(() => {
      setShouldLoadSpirals(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Enhancement: Parallax effects - desktop only, deferred
  useEffect(() => {
    if (isMobile) return

    const scrollTriggers: ScrollTrigger[] = []

    // Parallax effect for spiral lines - desktop only
    if (spiralRef.current) {
      const spiralTween = gsap.to(spiralRef.current, {
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
      if (spiralTween.scrollTrigger) scrollTriggers.push(spiralTween.scrollTrigger)
    }

    // Parallax effects for floating elements - desktop only
    if (floating1Ref.current) {
      const float1Tween = gsap.to(floating1Ref.current, {
        y: -window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: floating1Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (float1Tween.scrollTrigger) scrollTriggers.push(float1Tween.scrollTrigger)
    }

    if (floating2Ref.current) {
      const float2Tween = gsap.to(floating2Ref.current, {
        y: -window.innerHeight * 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: floating2Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (float2Tween.scrollTrigger) scrollTriggers.push(float2Tween.scrollTrigger)
    }

    if (floating3Ref.current) {
      const float3Tween = gsap.to(floating3Ref.current, {
        y: -window.innerHeight * 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: floating3Ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (float3Tween.scrollTrigger) scrollTriggers.push(float3Tween.scrollTrigger)
    }

    return () => {
      scrollTriggers.forEach(trigger => {
        try {
          if (trigger) trigger.kill()
        } catch (e) {}
      })
    }
  }, [isMobile])

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
        className="absolute top-20 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={floating3Ref}
        className="absolute bottom-20 right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
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

      {/* Premium Spiral Line - Spinal Curvature - Deferred for performance */}
      {shouldLoadSpirals && (
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
      )}

      {/* SVG Mask with Video Fill - SVG renders immediately, video loads lazily */}
      {/* Red accent colors are preserved in background layers below */}
      <svg
        ref={svgMaskRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 6 }}
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
          {shouldLoadVideo ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster="/workout-poster.jpg"
              style={{
                width: '110%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '70% center',
                display: 'block',
                marginLeft: '-5%',
              }}
            >
              <source src="/workout1.mp4" type="video/mp4" />
            </video>
          ) : (
            // Fallback: show text color until video loads
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
              }}
            />
          )}
        </foreignObject>
      </svg>

      {/* Premium Content */}
      <div className="relative z-10 text-center px-4 md:px-4 max-w-7xl mx-auto pt-20 pb-20 flex flex-col items-center justify-center" style={{ minHeight: '100vh', paddingTop: 'clamp(3rem, 8vh, 4rem)', paddingBottom: 'clamp(3rem, 8vh, 4rem)' }}>
        {/* Premium badge with glow effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mb-8 md:mb-12"
        >
          
        </motion.div>

        {/* H1 used for positioning SVG mask - video plays through this text */}
        <h1
          ref={headlineRef}
          className="text-balance font-black tracking-[-0.02em] mb-12 relative"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            lineHeight: '1.2',
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
          Strength forged
          <br />
          in discipline.
          <br />
          Built for longevity.
        </h1>

        {/* Premium subtitle with split design */}
        <div
          ref={subtitleRef}
          className="max-w-4xl mx-auto"
          style={{
            marginTop: 'clamp(40rem, 80vh, 70rem)',
            marginBottom: 'clamp(3rem, 8vh, 6rem)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            {/* Left accent line */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            
            {/* Split text design */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <span 
                className="text-text-primary text-lg md:text-lg lg:text-xl font-medium tracking-wider uppercase text-center md:text-left"
                style={{
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.8), 0 0 10px rgba(220, 38, 38, 0.3)',
                }}
              >
                A methodology
              </span>
              <span className="text-accent text-2xl md:text-2xl lg:text-3xl font-light">—</span>
              <span 
                className="text-text-secondary text-lg md:text-lg lg:text-xl font-light italic text-center md:text-left"
                style={{
                  letterSpacing: '0.05em',
                  textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
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
            className="text-text-primary text-2xl md:text-2xl lg:text-3xl font-bold tracking-tight px-4 leading-tight"
            style={{
              letterSpacing: '-0.01em',
              textShadow: '0 2px 25px rgba(0, 0, 0, 0.9), 0 0 20px rgba(220, 38, 38, 0.3)',
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
          className="w-full px-4 md:w-auto md:px-0"
          style={{
            marginTop: 'clamp(2rem, 6vh, 5rem)',
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
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden md:block"
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
