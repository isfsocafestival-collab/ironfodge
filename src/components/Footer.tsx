import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Footer() {
  const { ref, controls } = useScrollAnimation(0.3)

  return (
    <footer 
      ref={ref}
      className="py-12 md:py-16 px-4 md:px-8 border-t border-border-primary"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <p className="text-text-secondary text-sm mb-2">
            Strength. Discipline. Longevity.
          </p>
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} Ironforge
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

