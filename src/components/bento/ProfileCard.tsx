import { useState, useEffect } from 'react'
import { KANA_BIO } from '@/consts'

const StatusMessages = [
  { text: 'SCANNING MEMPOOL...', icon: '>', color: 'text-solana-green' },
  { text: 'EXECUTING TRADES...', icon: '$', color: 'text-solana-purple' },
  { text: 'ANALYZING VOLATILITY...', icon: '~', color: 'text-gaze-orange' },
  { text: 'NETWORK OPTIMAL', icon: '#', color: 'text-solana-green' },
]

const ProfileCard = () => {
  const [statusIndex, setStatusIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Dynamic stats
  const [tps, setTps] = useState(65000)
  const [blockTime, setBlockTime] = useState(400)
  const [uptime, setUptime] = useState(99.98)

  // Animate stats - updates every 1.5 seconds
  useEffect(() => {
    const updateStats = () => {
      // TPS varies between 55K-75K
      setTps(Math.floor(55000 + Math.random() * 20000))
      // Block time varies between 380-420ms
      setBlockTime(Math.floor(380 + Math.random() * 40))
      // Uptime varies between 99.95-99.99
      setUptime(Number((99.95 + Math.random() * 0.04).toFixed(2)))
    }

    // Initial update
    updateStats()

    const statsInterval = setInterval(updateStats, 1500)
    return () => clearInterval(statsInterval)
  }, [])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const currentStatus = StatusMessages[statusIndex]
    let charIndex = 0

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex <= currentStatus.text.length) {
          setDisplayText(currentStatus.text.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(typingInterval)
          setTimeout(() => setIsTyping(false), 2500)
        }
      }, 60)
      return () => clearInterval(typingInterval)
    } else {
      const deleteInterval = setInterval(() => {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1))
        } else {
          clearInterval(deleteInterval)
          setStatusIndex((prev) => (prev + 1) % StatusMessages.length)
          setIsTyping(true)
        }
      }, 25)
      return () => clearInterval(deleteInterval)
    }
  }, [statusIndex, isTyping])

  const currentStatus = StatusMessages[statusIndex]

  return (
    <div className="relative flex size-full flex-col p-5 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5 animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Profile Header */}
      <div className="relative z-10 mb-6">
        {/* Avatar with Ring Effect */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Outer Ring - Animated */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-solana-purple via-solana-green to-solana-purple animate-spin-slow opacity-50" style={{ animationDuration: '8s' }} />

            {/* Avatar Container */}
            <div className="relative size-24 rounded-2xl overflow-hidden border-2 border-void-black bg-void-black">
              <img
                src="/kana-logo.png"
                alt="KANA"
                className="size-full object-cover"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/5 to-transparent animate-scanline" />
            </div>

            {/* Status Badge */}
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-void-black border border-solana-green/50">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-solana-green"></span>
              </span>
              <span className="font-mono text-[9px] text-solana-green font-bold">LIVE</span>
            </div>
          </div>

          <div className="flex-1">
            {/* Name with gradient */}
            <h2 className="font-mono text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-solana-purple via-white to-solana-green bg-clip-text text-transparent">
                KANA
              </span>
              <span className="profile-badge font-mono text-[9px] text-solana-purple/80 px-2 py-0.5 rounded-full bg-solana-purple/10 border border-solana-purple/30 font-medium">
                ElizaOS
              </span>
            </h2>
            {/* Subtitle */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-solana-purple/20 font-mono text-[10px] text-solana-purple font-bold">
                SPEED DEMON
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="relative z-10 mb-4 p-3 rounded-lg bg-muted/20 border border-border/50">
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          {KANA_BIO}
        </p>
      </div>

      {/* Terminal Status */}
      <div className="relative z-10 mb-4 rounded-lg bg-void-black border border-solana-purple/30 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-solana-purple/10 border-b border-solana-purple/20">
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-gaze-red/70"></span>
            <span className="size-2 rounded-full bg-gaze-orange/70"></span>
            <span className="size-2 rounded-full bg-solana-green/70"></span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">kana@solana</span>
        </div>
        <div className="p-3 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className={currentStatus.color}>{currentStatus.icon}</span>
            <span className="text-foreground">{displayText}</span>
            <span
              className={`inline-block w-2 h-4 bg-solana-purple ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 0.1s' }}
            />
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="relative z-10 mb-4">
        <a
          href="https://www.elizacloud.ai/dashboard/chat?characterId=8c6773f7-9cdf-4b2f-908f-b472dcf5fbc2"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-solana-purple to-solana-green font-mono text-sm font-bold text-void-black hover:shadow-[0_0_25px_rgba(153,69,255,0.5)] transition-all duration-300 hover:scale-[1.02]"
        >
          <svg className="size-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat with Kana
          <svg className="size-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 mt-auto">
        <div className="grid grid-cols-3 gap-2">
          <div className="group p-3 rounded-lg bg-gradient-to-br from-solana-green/10 to-transparent border border-solana-green/20 hover:border-solana-green/50 transition-colors">
            <div
              key={tps}
              className="font-mono text-xl font-black text-solana-green animate-stat-change"
            >
              {Math.floor(tps / 1000)}K+
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">TPS</div>
          </div>
          <div className="group p-3 rounded-lg bg-gradient-to-br from-solana-purple/10 to-transparent border border-solana-purple/20 hover:border-solana-purple/50 transition-colors">
            <div
              key={blockTime}
              className="font-mono text-xl font-black text-solana-purple animate-stat-change"
            >
              {blockTime}ms
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Block</div>
          </div>
          <div className="group p-3 rounded-lg bg-gradient-to-br from-solana-green/10 to-transparent border border-solana-green/20 hover:border-solana-green/50 transition-colors">
            <div
              key={uptime}
              className="font-mono text-xl font-black text-solana-green animate-stat-change"
            >
              {uptime}%
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Uptime</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .profile-badge {
          position: relative;
          overflow: hidden;
        }
        .profile-badge::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(153, 69, 255, 0.3), transparent);
          animation: badgeShimmer 3s infinite;
        }
        @keyframes badgeShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes stat-change {
          0% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-stat-change {
          animation: stat-change 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ProfileCard
