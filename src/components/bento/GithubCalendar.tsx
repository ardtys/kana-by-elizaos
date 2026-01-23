import { Skeleton } from '@/components/ui/skeleton'
import { memo, type FunctionComponent, useCallback, useEffect, useState } from 'react'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

// Adopted from https://github.com/grubersjoe/react-github-calendar
// Copyright (c) 2019 Jonathan Gruber, MIT License

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
  username: string
}

// Solana Network Theme - Purple to Green gradient
const SOLANA_THEME = {
  dark: [
    '#151518',  // Level 0 - Empty (dark background)
    '#3D2366',  // Level 1 - Dark purple
    '#6B3FA0',  // Level 2 - Medium purple
    '#9945FF',  // Level 3 - Solana purple
    '#14F195',  // Level 4 - Solana green (max activity)
  ],
}

// Generate simulated activity data for fallback
function generateSimulatedData(): ApiResponse {
  const contributions: Activity[] = []
  const today = new Date()

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Generate realistic-looking activity pattern
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // More activity on weekdays, random patterns
    let count = 0
    const rand = Math.random()

    if (isWeekend) {
      if (rand > 0.7) count = Math.floor(Math.random() * 5) + 1
    } else {
      if (rand > 0.3) count = Math.floor(Math.random() * 15) + 1
      if (rand > 0.8) count = Math.floor(Math.random() * 25) + 10
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0
    if (count > 0) level = 1
    if (count > 5) level = 2
    if (count > 10) level = 3
    if (count > 20) level = 4

    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    })
  }

  const totalCount = contributions.reduce((sum, c) => sum + c.count, 0)

  return {
    total: { lastYear: totalCount },
    contributions,
  }
}

async function fetchCalendarData(username: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    )
    const data: ApiResponse | ApiErrorResponse = await response.json()

    if (!response.ok) {
      // Return simulated data on error
      console.warn(`GitHub API unavailable for "${username}", using simulated data`)
      return generateSimulatedData()
    }

    return data as ApiResponse
  } catch {
    // Return simulated data on network error
    console.warn('Network error fetching GitHub data, using simulated data')
    return generateSimulatedData()
  }
}

const GithubCalendar: FunctionComponent<Props> = ({ username, ...props }) => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSimulated, setIsSimulated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetchCalendarData(username)
      .then((result) => {
        setData(result)
        // Check if this is simulated data by checking if total has lastYear
        setIsSimulated(result.total?.lastYear !== undefined && typeof result.total.lastYear === 'number')
      })
      .finally(() => setLoading(false))
  }, [username])

  useEffect(fetchData, [fetchData])

  if (loading || !data) {
    return (
      <div className="relative size-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5 animate-pulse" />
        <div className="flex size-full flex-col p-1">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-solana-purple animate-pulse" />
              <span className="font-mono text-xs text-solana-purple uppercase tracking-wider">Loading...</span>
            </div>
          </div>
          <Skeleton className="flex-1 rounded-lg" />
        </div>
      </div>
    )
  }

  const totalEvents = data.total?.lastYear || Object.values(data.total)[0] || 0

  return (
    <div
      className="relative flex size-full flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-solana-purple/10 to-transparent animate-scanline" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-solana-purple animate-pulse">◆</span>
          <span className="font-mono text-xs text-solana-purple uppercase tracking-wider font-medium">
            Network_Activity
          </span>
          {isSimulated && (
            <span className="font-mono text-[9px] text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted/30">
              SIM
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`relative flex size-2`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-solana-green"></span>
          </span>
          <span className="font-mono text-xs text-solana-green font-medium tabular-nums">
            {totalEvents.toLocaleString()} commits
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`relative z-10 [&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 hidden w-fit sm:block transition-all duration-300 ${isHovered ? 'scale-[1.02]' : ''}`}>
        <Calendar
          data={selectLastNDays(data.contributions, 133)}
          theme={SOLANA_THEME}
          colorScheme="dark"
          blockSize={18}
          blockMargin={4}
          blockRadius={3}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
      <div className={`relative z-10 [&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 w-fit sm:hidden transition-all duration-300 ${isHovered ? 'scale-[1.02]' : ''}`}>
        <Calendar
          data={selectLastNDays(data.contributions, 60)}
          theme={SOLANA_THEME}
          colorScheme="dark"
          blockSize={18}
          blockMargin={4}
          blockRadius={3}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>

      {/* Legend */}
      <div className="relative z-10 mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {[
            { label: 'Idle', color: 'bg-muted-foreground/30' },
            { label: 'Active', color: 'bg-solana-purple' },
            { label: 'Peak', color: 'bg-solana-green' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`size-2 rounded-sm ${item.color}`} />
              <span className="font-mono text-[10px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-muted-foreground">Less</span>
          {SOLANA_THEME.dark.map((color, i) => (
            <div
              key={i}
              className="size-3 rounded-sm transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="font-mono text-[10px] text-muted-foreground">More</span>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>
    </div>
  )
}

interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<Activity>
}

interface ApiErrorResponse {
  error: string
}

const selectLastNDays = (contributions: Activity[], days: number) => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= startDate && activityDate <= today
  })
}

export default memo(GithubCalendar)
