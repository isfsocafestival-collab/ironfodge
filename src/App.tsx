import { lazy, Suspense } from 'react'
import Hero from './components/Hero'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'

// Lazy load below-the-fold components for better initial performance
const FounderVideo = lazy(() => import('./components/FounderVideo'))
const Philosophy = lazy(() => import('./components/Philosophy'))
const VisualShowcase = lazy(() => import('./components/VisualShowcase'))
const WaitlistBenefits = lazy(() => import('./components/WaitlistBenefits'))
const WaitlistForm = lazy(() => import('./components/WaitlistForm'))
const Footer = lazy(() => import('./components/Footer'))

// Simple loading fallback - minimal visual impact
const SectionLoader = () => null

function App() {
  return (
    <div className="min-h-screen">
      <Cursor />
      <Navbar />
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <FounderVideo />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Philosophy />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <VisualShowcase />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WaitlistBenefits />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WaitlistForm />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App

