import { memo, useState, useRef, useEffect } from 'react'

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play when component mounts (muted for autoplay policy)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, user needs to click play
        setIsPlaying(false)
      })
    }
  }, [isLoaded])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[400px] lg:min-h-[450px] overflow-hidden rounded-2xl bg-void-black">
      {/* Video Element */}
      {!hasError ? (
        <video
          ref={videoRef}
          src="/video.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
        />
      ) : (
        // Fallback animated background when video fails
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/20 via-void-black to-solana-green/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="size-16 mx-auto mb-4 rounded-full bg-solana-purple/20 flex items-center justify-center">
                <svg className="size-8 text-solana-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-mono text-sm text-muted-foreground">Video unavailable</p>
            </div>
          </div>
          {/* Animated particles fallback */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute size-1 rounded-full bg-solana-purple/50 animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subtle Gradient Overlay - Less dark to show video better */}
      <div className="absolute inset-0 bg-gradient-to-t from-void-black/70 via-transparent to-void-black/30" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/10 to-transparent animate-scanline" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-solana-purple animate-pulse">◆</span>
            <span className="font-mono text-xs text-solana-purple uppercase tracking-wider font-medium">
              Kana_Vision
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="flex size-8 items-center justify-center rounded-full bg-void-black/60 backdrop-blur-sm border border-solana-purple/30 hover:border-solana-purple/60 hover:bg-solana-purple/10 transition-all group"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="size-4 text-solana-purple group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="size-4 text-solana-green group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-void-black/60 px-3 py-1.5 backdrop-blur-sm border border-solana-green/30">
              <span className="relative flex size-2">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full size-2 ${isPlaying ? 'bg-solana-green' : 'bg-muted-foreground'}`}></span>
              </span>
              <span className={`font-mono text-xs ${isPlaying ? 'text-solana-green' : 'text-muted-foreground'}`}>
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <h3 className="mb-1 font-mono text-base md:text-lg font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
              Network Visualization
            </h3>
            <p className="font-mono text-[11px] md:text-xs text-muted-foreground">
              Watch the Solana network in real-time
            </p>
          </div>

          {/* Play Button & Waveform */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={togglePlay}
              className="flex size-12 md:size-14 items-center justify-center rounded-full bg-gradient-to-br from-solana-purple to-solana-green transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(153,69,255,0.5)] active:scale-95 group shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="size-5 md:size-6 text-void-black" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="size-5 md:size-6 text-void-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Waveform Visualization */}
            <div className="flex flex-1 items-center gap-[2px] h-8">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-gradient-to-t from-solana-purple to-solana-green' : 'bg-muted-foreground/30'
                  }`}
                  style={{
                    height: isPlaying ? `${20 + Math.sin(Date.now() / 200 + i) * 40 + 40}%` : '15%',
                    animation: isPlaying ? `waveform 0.8s ease-in-out infinite ${i * 50}ms` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 m-2 md:m-3 size-4 md:size-5 border-l-2 border-t-2 border-solana-purple/60 pointer-events-none" />
      <div className="absolute top-0 right-0 m-2 md:m-3 size-4 md:size-5 border-r-2 border-t-2 border-solana-green/60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 m-2 md:m-3 size-4 md:size-5 border-l-2 border-b-2 border-solana-green/60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 m-2 md:m-3 size-4 md:size-5 border-r-2 border-b-2 border-solana-purple/60 pointer-events-none" />

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        @keyframes waveform {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }
        .animate-float-particle {
          animation: float-particle 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default memo(VideoShowcase)
