import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useMagneticHover } from '../hooks/useMagneticHover'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// YouTube IFrame API types
declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string | HTMLElement, config: any) => any
      PlayerState: {
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

const YOUTUBE_VIDEO_ID = 'LDuqpxZf88c'
const YOUTUBE_URL = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`
const PREVIEW_DURATION = 180 // 3 minutes in seconds

// Get the correct origin for YouTube embed
const getYouTubeEmbedUrl = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  // YouTube requires the origin to match exactly, including protocol
  return `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&origin=${encodeURIComponent(origin)}&autoplay=0&controls=1&rel=0`
}

export default function FounderVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showYouTubeCTA, setShowYouTubeCTA] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useMagneticHover(0.15)
  const { ref, controls } = useScrollAnimation(0.3)
  const playerRef = useRef<any>(null)
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Wait for YouTube API to be ready
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT)
        if (iframeRef.current && isPlaying && !playerRef.current) {
          initializePlayer()
        }
      }
    }, 100)

    return () => clearInterval(checkYT)
  }, [isPlaying])

  // Initialize YouTube player
  const initializePlayer = () => {
    if (!iframeRef.current || playerRef.current) return
    
    // Wait for YouTube API to be ready
    if (window.YT && window.YT.Player) {
      try {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready')
              // Don't autoplay - let user control it
              // Set timer to show CTA after preview duration
              previewTimerRef.current = setTimeout(() => {
                setShowYouTubeCTA(true)
                try {
                  event.target.pauseVideo()
                } catch (e) {
                  console.error('Error pausing video:', e)
                }
              }, PREVIEW_DURATION * 1000)
            },
            onStateChange: (event: any) => {
              // If video ends naturally before preview duration, show CTA
              if (event.data === window.YT?.PlayerState.ENDED) {
                setShowYouTubeCTA(true)
                if (previewTimerRef.current) {
                  clearTimeout(previewTimerRef.current)
                }
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event)
            }
          }
        })
      } catch (error) {
        console.error('Error initializing YouTube player:', error)
      }
    } else {
      // Retry after a short delay if API not ready
      setTimeout(() => {
        if (window.YT && window.YT.Player && !playerRef.current) {
          initializePlayer()
        }
      }, 500)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        scale: 0.98,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          // Ensure container doesn't hide children after animation
          if (containerRef.current) {
            containerRef.current.style.setProperty('opacity', '1', 'important')
            containerRef.current.style.setProperty('visibility', 'visible', 'important')
          }
        }
      })
    }
  }, [])

  const handlePlay = () => {
    setIsPlaying(true)
    
    // Fade out play button
    if (playButtonRef.current) {
      gsap.to(playButtonRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          if (playButtonRef.current?.parentElement) {
            playButtonRef.current.parentElement.style.display = 'none'
          }
        }
      })
    }
    
    // The iframe will initialize the player when it loads (see onLoad handler)
  }

  const handleWatchFullVideo = () => {
    window.open(YOUTUBE_URL, '_blank', 'noopener,noreferrer')
  }

  // Force iframe visibility with !important when playing - continuous check
  useEffect(() => {
    if (!isPlaying) return
    
    const forceVisibility = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current
        iframe.style.setProperty('display', 'block', 'important')
        iframe.style.setProperty('opacity', '1', 'important')
        iframe.style.setProperty('visibility', 'visible', 'important')
        iframe.style.setProperty('z-index', '10', 'important')
        iframe.style.setProperty('position', 'absolute', 'important')
        iframe.style.setProperty('width', '100%', 'important')
        iframe.style.setProperty('height', '100%', 'important')
        
        // Also set on parent container
        const parent = iframe.parentElement
        if (parent) {
          parent.style.setProperty('display', 'block', 'important')
          parent.style.setProperty('opacity', '1', 'important')
          parent.style.setProperty('visibility', 'visible', 'important')
          parent.style.setProperty('z-index', '10', 'important')
          parent.style.setProperty('position', 'absolute', 'important')
        }
      }
    }
    
    // Force immediately
    forceVisibility()
    
    // Keep forcing every 100ms to prevent anything from hiding it
    const interval = setInterval(forceVisibility, 100)
    
    return () => clearInterval(interval)
  }, [isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current)
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [])

  return (
    <section 
      ref={ref}
      className="py-20 md:py-32 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/30 to-transparent" />

      {/* Premium Spiral Lines - matching Hero section with subtle pulsing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{
            willChange: 'transform',
          }}
        >
          <defs>
            <linearGradient id="founderSpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#DC2626" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
            <filter id="founderSpiralGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main spiral curve - flows toward video */}
          <motion.path
            d="M -100 150 Q 300 100, 600 200 Q 900 300, 1200 400 Q 1500 500, 1920 600 L 2020 600"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="2.5"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ 
              pathLength: { duration: 2.5, delay: 0.8, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          {/* Secondary spiral curve - extends to video area */}
          <motion.path
            d="M -50 350 Q 400 250, 800 350 Q 1200 450, 1600 550 Q 1800 600, 2020 700 L 2020 700"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="2"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ 
              pathLength: { duration: 3, delay: 1, ease: "easeInOut" },
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
          />
          
          {/* Tertiary accent curve */}
          <motion.path
            d="M 0 550 Q 500 450, 1000 550 Q 1400 650, 1920 750 L 2020 750"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="1.5"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ 
              pathLength: { duration: 3.5, delay: 1.2, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
          />

          {/* Additional lines flowing toward video frame */}
          {/* Line 4 - Top to video */}
          <motion.path
            d="M 0 200 Q 400 300, 800 350 Q 1200 400, 1600 450 Q 1920 500, 2020 550"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="2"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{ 
              pathLength: { duration: 3.2, delay: 1.5, ease: "easeInOut" },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
            }}
          />

          {/* Line 5 - Bottom to video */}
          <motion.path
            d="M 100 800 Q 500 700, 900 650 Q 1300 600, 1700 550 Q 1920 500, 2020 450"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="2"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={{ 
              pathLength: { duration: 3.8, delay: 1.8, ease: "easeInOut" },
              opacity: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
            }}
          />

          {/* Line 6 - Left side flowing to video */}
          <motion.path
            d="M 200 0 Q 300 200, 400 400 Q 600 600, 800 700 Q 1000 750, 1200 800 Q 1400 850, 1600 900"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="1.8"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.1, 0.45, 0.1],
            }}
            transition={{ 
              pathLength: { duration: 4, delay: 2, ease: "easeInOut" },
              opacity: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
            }}
          />

          {/* Line 7 - Right side flowing to video */}
          <motion.path
            d="M 1720 0 Q 1620 250, 1520 450 Q 1420 650, 1320 750 Q 1220 800, 1120 850 Q 1020 900, 920 950"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="1.8"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.12, 0.48, 0.12],
            }}
            transition={{ 
              pathLength: { duration: 4.2, delay: 2.2, ease: "easeInOut" },
              opacity: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
            }}
          />

          {/* Line 8 - Center flow converging on video */}
          <motion.path
            d="M 960 0 Q 960 200, 960 400 Q 960 600, 960 800 Q 960 900, 960 1080"
            fill="none"
            stroke="url(#founderSpiralGradient)"
            strokeWidth="1.5"
            filter="url(#founderSpiralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.08, 0.35, 0.08],
            }}
            transition={{ 
              pathLength: { duration: 3.5, delay: 2.5, ease: "easeInOut" },
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-10 md:mb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <div className="inline-block mb-4">
            <span className="px-3 py-1.5 md:px-4 md:py-2 border border-accent/30 bg-accent/5 rounded-full text-accent text-xs md:text-sm font-semibold tracking-wider">
              THE FOUNDATION
            </span>
          </div>
          <h2
            className="font-bold mb-3 md:mb-4"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
          >
            Why Ironforge Exists
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hear directly from the founder about the philosophy behind Ironforge
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className="relative rounded-lg overflow-hidden border border-border-primary group px-4 md:px-0"
          style={{ 
            aspectRatio: '16/9',
            minHeight: '300px',
            maxWidth: '100%',
            margin: '0 auto',
            boxShadow: '0 0 0 1px rgba(31, 41, 55, 0.5), 0 20px 60px rgba(0,0,0,0.3)',
            backgroundColor: '#111827',
            position: 'relative'
          }}
        >
          {/* Video poster/thumbnail - using YouTube thumbnail - only show when NOT playing */}
          <div 
            className="absolute inset-0 w-full h-full flex items-center justify-center" 
            style={{ 
              backgroundColor: '#111827',
              zIndex: isPlaying ? -1 : 1,
              display: isPlaying ? 'none' : 'flex',
              opacity: isPlaying ? 0 : 1,
              pointerEvents: isPlaying ? 'none' : 'auto'
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
              alt="Ironforge Founder"
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`
              }}
              onLoad={() => {
                console.log('YouTube thumbnail loaded successfully')
              }}
            />
          </div>

          {/* YouTube iframe - always in DOM, control visibility */}
          <div 
            ref={(el) => {
              if (el) {
                if (isPlaying) {
                  el.style.setProperty('display', 'block', 'important')
                  el.style.setProperty('opacity', '1', 'important')
                  el.style.setProperty('visibility', 'visible', 'important')
                  el.style.setProperty('z-index', '10', 'important')
                } else {
                  el.style.setProperty('display', 'none', 'important')
                  el.style.setProperty('opacity', '0', 'important')
                  el.style.setProperty('visibility', 'hidden', 'important')
                  el.style.setProperty('z-index', '-1', 'important')
                }
              }
            }}
            className="absolute inset-0 w-full h-full" 
            style={{ 
              minHeight: '400px',
              zIndex: isPlaying ? 10 : -1,
              display: isPlaying ? 'block' : 'none',
              opacity: isPlaying ? 1 : 0,
              visibility: isPlaying ? 'visible' : 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              id="youtube-player"
              src={isPlaying ? getYouTubeEmbedUrl() : 'about:blank'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                minHeight: '400px',
                border: 'none',
                display: 'block',
                opacity: 1,
                visibility: 'visible',
                zIndex: 10
              }}
              onLoad={() => {
                if (isPlaying) {
                  console.log('YouTube iframe loaded, isPlaying:', isPlaying)
                  // Force visibility after load with !important
                  if (iframeRef.current) {
                    iframeRef.current.style.setProperty('display', 'block', 'important')
                    iframeRef.current.style.setProperty('opacity', '1', 'important')
                    iframeRef.current.style.setProperty('visibility', 'visible', 'important')
                    iframeRef.current.style.setProperty('z-index', '10', 'important')
                    iframeRef.current.style.setProperty('position', 'absolute', 'important')
                    iframeRef.current.style.setProperty('width', '100%', 'important')
                    iframeRef.current.style.setProperty('height', '100%', 'important')
                  }
                  setTimeout(() => {
                    initializePlayer()
                  }, 1000)
                }
              }}
            />
          </div>

          {/* YouTube CTA Overlay - shown after preview ends */}
          {showYouTubeCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="text-center px-8 max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Watch the Full Story
                </h3>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                  You've seen a preview. Watch the complete founder's story on YouTube to learn more about the philosophy behind Ironforge.
                </p>
                <motion.button
                  onClick={handleWatchFullVideo}
                  className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch on YouTube
                </motion.button>
                <button
                  onClick={() => {
                    setShowYouTubeCTA(false)
                    if (playerRef.current) {
                      playerRef.current.playVideo()
                    }
                  }}
                  className="mt-4 text-gray-400 hover:text-white transition-colors"
                >
                  Continue Preview
                </button>
              </div>
            </motion.div>
          )}

          {/* Vignette overlay - only show when video is playing */}
          {isPlaying && !showYouTubeCTA && (
            <div 
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)'
              }}
            />
          )}

          {/* Play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-overlay z-20 pointer-events-auto">
              <motion.button
                ref={playButtonRef as React.Ref<HTMLButtonElement>}
                onClick={handlePlay}
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(220,38,38,0.4)] md:group-hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] active:scale-95"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Play video"
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 ml-1 text-text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  animate={{
                    scale: [1, 1.5, 1.5],
                    opacity: [0.8, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

