import { useState, useEffect } from 'react'

const HeroStats = () => {
  const [tps, setTps] = useState(65000)
  const [blockTime, setBlockTime] = useState(400)
  const [uptime, setUptime] = useState(99.98)

  useEffect(() => {
    const updateStats = () => {
      // TPS: fluctuates between 55,000 - 75,000
      setTps(Math.floor(55000 + Math.random() * 20000))

      // Block time: fluctuates between 380ms - 420ms
      setBlockTime(Math.floor(380 + Math.random() * 40))

      // Uptime: fluctuates between 99.95% - 99.99%
      setUptime(Number((99.95 + Math.random() * 0.04).toFixed(2)))
    }

    // Initial update
    updateStats()

    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatTPS = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K+`
    }
    return `${value}+`
  }

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
      {/* TPS */}
      <div className="stat-item-card text-center group cursor-default px-6 py-4 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-green/10 via-transparent to-solana-green/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 border border-solana-green/20 rounded-xl group-hover:border-solana-green/40 transition-colors"></div>
        <div className="relative z-10">
          <div
            key={tps}
            className="font-mono text-3xl md:text-4xl font-black text-solana-green group-hover:scale-110 transition-all duration-300 animate-statUpdate"
          >
            {formatTPS(tps)}
          </div>
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-solana-green transition-colors">
            TPS
          </div>
        </div>
        {/* Pulse indicator */}
        <div className="absolute top-2 right-2 size-2 rounded-full bg-solana-green animate-pulse"></div>
      </div>

      {/* Block Time */}
      <div className="stat-item-card text-center group cursor-default px-6 py-4 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/10 via-transparent to-solana-purple/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 border border-solana-purple/20 rounded-xl group-hover:border-solana-purple/40 transition-colors"></div>
        <div className="relative z-10">
          <div
            key={blockTime}
            className="font-mono text-3xl md:text-4xl font-black text-solana-purple group-hover:scale-110 transition-all duration-300 animate-statUpdate"
          >
            {blockTime}ms
          </div>
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-solana-purple transition-colors">
            Block Time
          </div>
        </div>
        {/* Pulse indicator */}
        <div className="absolute top-2 right-2 size-2 rounded-full bg-solana-purple animate-pulse"></div>
      </div>

      {/* Uptime */}
      <div className="stat-item-card text-center group cursor-default px-6 py-4 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-green/10 via-transparent to-solana-green/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 border border-solana-green/20 rounded-xl group-hover:border-solana-green/40 transition-colors"></div>
        <div className="relative z-10">
          <div
            key={uptime}
            className="font-mono text-3xl md:text-4xl font-black text-solana-green group-hover:scale-110 transition-all duration-300 animate-statUpdate"
          >
            {uptime}%
          </div>
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-solana-green transition-colors">
            Uptime
          </div>
        </div>
        {/* Live indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="size-2 rounded-full bg-solana-green animate-ping"></span>
          <span className="size-2 rounded-full bg-solana-green absolute"></span>
        </div>
      </div>

      <style>{`
        @keyframes statUpdate {
          0% {
            opacity: 0.7;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-statUpdate {
          animation: statUpdate 0.3s ease-out;
        }
        .stat-item-card {
          background: linear-gradient(180deg, rgba(15, 11, 21, 0.6) 0%, rgba(5, 5, 5, 0.8) 100%);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

export default HeroStats
