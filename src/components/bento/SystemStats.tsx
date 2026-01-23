import { useState, useEffect, memo, useCallback } from 'react'

interface SolanaStats {
  tps: number
  blockHeight: number
  networkStatus: number
  epoch: number
  slotTime: number
}

// Multiple RPC endpoints to try
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
  'https://rpc.ankr.com/solana',
]

// Generate realistic simulated data
const generateSimulatedStats = (): SolanaStats => {
  const baseTps = 2500 + Math.floor(Math.random() * 1500)
  const baseSlot = 312000000 + Math.floor(Math.random() * 100000)
  const baseEpoch = 730 + Math.floor(Math.random() * 20)

  return {
    tps: baseTps,
    blockHeight: baseSlot,
    networkStatus: baseTps > 2000 ? 95 : baseTps > 1000 ? 80 : 60,
    epoch: baseEpoch,
    slotTime: 400 + Math.floor(Math.random() * 50),
  }
}

const SystemStats = () => {
  const [stats, setStats] = useState<SolanaStats>(generateSimulatedStats())
  const [isLoading, setIsLoading] = useState(true)
  const [animatedTps, setAnimatedTps] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 5000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  }

  const fetchSolanaStats = useCallback(async () => {
    let success = false

    // Try each RPC endpoint
    for (const endpoint of RPC_ENDPOINTS) {
      if (success) break

      try {
        // Fetch all data in parallel
        const [perfResponse, slotResponse, epochResponse] = await Promise.all([
          fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'getRecentPerformanceSamples',
              params: [1],
            }),
          }),
          fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 2,
              method: 'getSlot',
            }),
          }),
          fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 3,
              method: 'getEpochInfo',
            }),
          }),
        ])

        const [perfData, slotData, epochData] = await Promise.all([
          perfResponse.json(),
          slotResponse.json(),
          epochResponse.json(),
        ])

        // Validate responses
        if (perfData.result?.[0] && slotData.result && epochData.result) {
          const sample = perfData.result[0]
          const tps = Math.round(sample.numTransactions / sample.samplePeriodSecs)
          const slotTime = Math.round((sample.samplePeriodSecs / sample.numSlots) * 1000)

          if (tps > 0) {
            setStats({
              tps,
              blockHeight: slotData.result,
              networkStatus: tps > 2000 ? 95 : tps > 1000 ? 80 : tps > 500 ? 60 : 40,
              epoch: epochData.result.epoch,
              slotTime,
            })
            setIsLive(true)
            setLastUpdate(new Date())
            success = true
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error)
        continue
      }
    }

    // If all endpoints failed, use simulated data with slight variations
    if (!success) {
      setStats(prev => ({
        tps: prev.tps + Math.floor(Math.random() * 200) - 100,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 10) + 1,
        networkStatus: 85 + Math.floor(Math.random() * 10),
        epoch: prev.epoch,
        slotTime: 400 + Math.floor(Math.random() * 50),
      }))
      setIsLive(false)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchSolanaStats()

    // Refresh every 5 seconds
    const interval = setInterval(fetchSolanaStats, 5000)

    return () => clearInterval(interval)
  }, [fetchSolanaStats])

  // Animate TPS counter
  useEffect(() => {
    if (stats.tps > 0 && animatedTps !== stats.tps) {
      const duration = 800
      const steps = 20
      const stepValue = (stats.tps - animatedTps) / steps
      let current = animatedTps

      const timer = setInterval(() => {
        current += stepValue
        if ((stepValue > 0 && current >= stats.tps) || (stepValue < 0 && current <= stats.tps)) {
          setAnimatedTps(stats.tps)
          clearInterval(timer)
        } else {
          setAnimatedTps(Math.round(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [stats.tps, animatedTps])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getHealthLabel = (status: number) => {
    if (status >= 90) return { text: 'OPTIMAL', color: 'text-solana-green', bg: 'bg-solana-green/20' }
    if (status >= 70) return { text: 'HEALTHY', color: 'text-solana-green', bg: 'bg-solana-green/20' }
    if (status >= 50) return { text: 'GOOD', color: 'text-gaze-orange', bg: 'bg-gaze-orange/20' }
    return { text: 'DEGRADED', color: 'text-gaze-red', bg: 'bg-gaze-red/20' }
  }

  const health = getHealthLabel(stats.networkStatus)

  if (isLoading) {
    return (
      <div className="relative h-full p-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-solana-purple animate-pulse">⚡</span>
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              Solana Network
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-solana-purple" />
            <span className="font-mono text-xs text-muted-foreground">Connecting...</span>
          </span>
        </div>
        <div className="relative z-10 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted/20 border border-solana-purple/10" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full p-5 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/10 to-transparent animate-scanline" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-solana-purple text-lg animate-pulse">⚡</span>
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
            Solana Network
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isLive && (
            <span className="font-mono text-[9px] text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted/30">
              SIM
            </span>
          )}
          <span className="flex items-center gap-2 rounded-full bg-solana-green/10 px-2.5 py-1 border border-solana-green/30">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-solana-green"></span>
            </span>
            <span className="font-mono text-[10px] font-medium text-solana-green">
              {isLive ? 'LIVE' : 'ACTIVE'}
            </span>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 space-y-3">
        {/* Network Health */}
        <div className="rounded-lg bg-muted/20 p-3 border border-solana-purple/10 hover:border-solana-purple/30 transition-colors group">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Network Health
            </span>
            <span className={`rounded-md ${health.bg} px-2 py-0.5 font-mono text-[10px] font-bold ${health.color}`}>
              {health.text}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-solana-purple to-solana-green transition-all duration-1000"
              style={{ width: `${stats.networkStatus}%` }}
            />
          </div>
        </div>

        {/* TPS - Main Stat */}
        <div className="rounded-lg bg-gradient-to-br from-solana-green/10 to-transparent p-3 border border-solana-green/20 hover:border-solana-green/40 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Transactions/Sec
              </div>
              <div className="font-mono text-3xl font-black tabular-nums text-solana-green group-hover:scale-105 transition-transform origin-left">
                {formatNumber(animatedTps)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-muted-foreground mb-1">Slot Time</div>
              <div className="font-mono text-sm font-bold text-solana-purple">{stats.slotTime}ms</div>
            </div>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-solana-green transition-all duration-500"
              style={{ width: `${Math.min((stats.tps / 5000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Bottom Row - Epoch & Slot */}
        <div className="grid grid-cols-2 gap-2">
          {/* Epoch */}
          <div className="rounded-lg bg-muted/20 p-3 border border-solana-purple/10 hover:border-solana-purple/30 transition-all hover:scale-[1.02] group">
            <div className="font-mono text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Epoch
            </div>
            <div className="font-mono text-xl font-bold tabular-nums text-solana-purple group-hover:text-solana-green transition-colors">
              {formatNumber(stats.epoch)}
            </div>
          </div>

          {/* Slot */}
          <div className="rounded-lg bg-muted/20 p-3 border border-solana-purple/10 hover:border-solana-purple/30 transition-all hover:scale-[1.02] group">
            <div className="font-mono text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Current Slot
            </div>
            <div className="font-mono text-sm font-bold tabular-nums text-foreground group-hover:text-solana-purple transition-colors truncate">
              {formatNumber(stats.blockHeight)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default memo(SystemStats)
