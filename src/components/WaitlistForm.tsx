import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { submitToWaitlist } from '../lib/supabase'
import MagneticButton from './MagneticButton'

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { ref, controls } = useScrollAnimation(0.3)

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
      className="py-32 px-8 relative"
    >
      {/* Background gradient with accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-50" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          className="mb-12"
        >
          <div className="inline-block mb-6">
            <span className="px-4 py-2 border border-accent/30 bg-accent/5 rounded-full text-accent text-sm font-semibold tracking-wider">
              JOIN THE WAITLIST
            </span>
          </div>
          <h2
            className="font-bold mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            This is not for everyone.
          </h2>
          
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
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
              className="p-12 border-2 border-success bg-success/5 rounded-lg"
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
              className="space-y-6 bg-bg-secondary/40 border border-border-primary p-8 rounded-lg backdrop-blur-sm"
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
                  className="w-full bg-bg-tertiary/50 border border-border-primary focus:border-accent outline-none py-4 px-4 rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:bg-bg-tertiary focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]"
                  disabled={isSubmitting}
                  aria-label="Name"
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
                  className="w-full bg-bg-tertiary/50 border border-border-primary focus:border-accent outline-none py-4 px-4 rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:bg-bg-tertiary focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]"
                  disabled={isSubmitting}
                  aria-label="Email"
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
              >
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
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


