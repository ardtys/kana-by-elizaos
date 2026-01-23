import { useState, useEffect } from 'react'

interface BootingAnimationProps {
  onComplete: () => void
}

const BootingAnimation = ({ onComplete }: BootingAnimationProps) => {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)

  const bootMessages = [
    '[ OK ] Initializing KANA Core...',
    '[ OK ] Loading Neural Pathways...',
    '[ OK ] Connecting to Solana Network...',
    '[ OK ] Syncing Blockchain State...',
    '[ OK ] Calibrating Speed Systems...',
    '[ OK ] Optimizing Transaction Engine...',
    '[ OK ] KANA Speed Demon Ready',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 400)

    return () => clearInterval(messageInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-8">
        {/* KANA Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-solana-purple to-solana-green blur-2xl opacity-50" />
            <img
              src="/kana-logo.png"
              alt="KANA"
              className="relative size-32 rounded-full border-2 border-solana-purple/30"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center font-mono text-2xl font-bold text-foreground">
          KANA <span className="text-solana-purple">◆</span> Speed Demon
        </h1>
        <p className="mb-8 text-center font-mono text-sm text-muted-foreground">
          Initializing Systems...
        </p>

        {/* Boot Messages */}
        <div className="mb-6 h-40 space-y-1 overflow-hidden rounded-lg bg-muted/30 p-4 font-mono text-xs">
          {bootMessages.slice(0, currentMessage + 1).map((message, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 transition-opacity ${
                index === currentMessage ? 'text-cyan-glow' : 'text-muted-foreground'
              }`}
            >
              <span className="text-warm-gold">✦</span>
              <span>{message}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-warm-gold to-cyan-glow transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center font-mono text-xs text-muted-foreground">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default BootingAnimation
