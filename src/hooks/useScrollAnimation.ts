import { useEffect, useRef } from 'react'
import { useInView, useAnimation } from 'framer-motion'

export function useScrollAnimation(amount = 0.2) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount, once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('animate')
    }
  }, [isInView, controls])

  return { ref, controls }
}


