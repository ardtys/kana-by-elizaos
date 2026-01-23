import { memo, useState, useEffect } from 'react'

const KANA_MOODS = [
  { text: 'Scanning mempool for alpha...', emoji: '🔍', color: 'solana-purple' },
  { text: 'Executing high-frequency trades', emoji: '⚡', color: 'solana-green' },
  { text: 'Analyzing market volatility', emoji: '📊', color: 'gaze-orange' },
  { text: 'Network status: OPTIMAL', emoji: '🟢', color: 'solana-green' },
  { text: 'Diamond hands activated', emoji: '💎', color: 'solana-purple' },
  { text: 'Watching the charts... always', emoji: '👀', color: 'gaze-red' },
]

const WaveformVisualizer = memo(() => {
  return (
    <div className="flex h-12 items-end gap-1 justify-center">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-solana-purple to-solana-green animate-waveform"
          style={{
            animationDelay: `${i * 0.1}s`,
            height: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  )
})

const CurrentMood = () => {
  const [moodIndex, setMoodIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setMoodIndex((prevIndex) => (prevIndex + 1) % KANA_MOODS.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [isPlaying])

  const currentMood = KANA_MOODS[moodIndex]

  return (
    <div className="relative flex size-full flex-col justify-between p-5 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute size-1 rounded-full bg-solana-purple/50 animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-solana-purple animate-pulse">♪</span>
          <span className="font-mono text-xs text-solana-purple uppercase tracking-wider font-medium">
            Current_Mood
          </span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="size-8 rounded-full bg-muted/30 border border-solana-purple/30 flex items-center justify-center hover:border-solana-purple/60 hover:bg-solana-purple/10 transition-all group"
        >
          <span className="text-sm group-hover:scale-110 transition-transform">
            {isPlaying ? '⏸' : '▶'}
          </span>
        </button>
      </div>

      {/* Waveform Visualizer */}
      <div className="relative z-10 mb-4">
        {isPlaying ? (
          <WaveformVisualizer />
        ) : (
          <div className="flex h-12 items-end gap-1 justify-center">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-1.5 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="relative z-10 space-y-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`relative flex size-2`}>
            {isPlaying && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${currentMood.color} opacity-75`}></span>
            )}
            <span className={`relative inline-flex rounded-full size-2 ${isPlaying ? `bg-${currentMood.color}` : 'bg-muted-foreground'}`}></span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {isPlaying ? 'Active' : 'Paused'}
          </span>
        </div>

        {/* Mood Text */}
        <div className="flex items-center gap-2">
          <span className="text-lg animate-bounce" style={{ animationDuration: '2s' }}>{currentMood.emoji}</span>
          <span className="font-mono text-sm text-foreground leading-snug animate-fadeIn">
            {currentMood.text}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-solana-purple via-solana-green to-solana-purple transition-all duration-100 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundSize: '200% 100%',
              animation: isPlaying ? 'shimmer 2s linear infinite' : 'none',
            }}
          />
        </div>

        {/* Mood Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {KANA_MOODS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setMoodIndex(i); setProgress(0); }}
              className={`size-1.5 rounded-full transition-all ${i === moodIndex ? 'bg-solana-purple scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-3 right-3 opacity-30">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-solana-purple animate-spin-slow"
        >
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <style>{`
        @keyframes waveform {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-waveform {
          animation: waveform 1s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default memo(CurrentMood)
