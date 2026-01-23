import { useState, useEffect } from 'react'
import BootingAnimation from './BootingAnimation'

interface HomeWithBootingProps {
  children: React.ReactNode
}

const HomeWithBooting = ({ children }: HomeWithBootingProps) => {
  const [showBooting, setShowBooting] = useState(true)
  const [hasBooted, setHasBooted] = useState(false)

  useEffect(() => {
    // Check if user has already booted in this session
    const booted = sessionStorage.getItem('kana-booted')
    if (booted === 'true') {
      setShowBooting(false)
      setHasBooted(true)
    }
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem('kana-booted', 'true')
    setShowBooting(false)
    setHasBooted(true)
  }

  if (showBooting && !hasBooted) {
    return <BootingAnimation onComplete={handleBootComplete} />
  }

  return <>{children}</>
}

export default HomeWithBooting
