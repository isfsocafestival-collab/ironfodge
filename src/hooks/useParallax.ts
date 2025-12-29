import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useParallax(speed: number = 0.5, direction: 'y' | 'x' = 'y') {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      [direction]: () => `-=${window.innerHeight * speed}`,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === ref.current) {
          trigger.kill()
        }
      })
    }
  }, [speed, direction])

  return ref
}











