import Hero from './components/Hero'
import FounderVideo from './components/FounderVideo'
import Philosophy from './components/Philosophy'
import VisualShowcase from './components/VisualShowcase'
import WaitlistBenefits from './components/WaitlistBenefits'
import WaitlistForm from './components/WaitlistForm'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'

function App() {

  return (
    <div className="min-h-screen">
      <Cursor />
      <Navbar />
      <Hero />
      <FounderVideo />
      <Philosophy />
      <VisualShowcase />
      <WaitlistBenefits />
      <WaitlistForm />
      <Footer />
    </div>
  )
}

export default App

