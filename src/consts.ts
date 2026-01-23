import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Kana // Solana Speed Demon',
  description:
    'Beauty is temporary. The Blockchain is eternal. Don\'t disappoint me, Trader.',
  href: 'https://kana.dev',
  author: 'Kana',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 4,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/chat',
    label: 'Chat',
  },
  {
    href: '/docs',
    label: 'Docs',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/ardtys/kana-by-elizaos',
    label: 'GitHub',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Telegram: 'lucide:send',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

// Kana-specific constants
export const KANA_STATUS = {
  online: { text: 'Network: OPTIMAL', color: 'solana-green' },
  busy: { text: 'Executing Trades...', color: 'solana-purple' },
  idle: { text: 'Scanning Volatility...', color: 'chrome' },
}

export const KANA_BIO = 'Kana // Solana High-Speed Network Embodiment'

export const CURRENT_MOODS = [
  'Scanning Market Volatility',
  'Orchestrating Money Flow',
  'Analyzing Mempool Data',
  'Executing with Precision',
  'Monitoring Chain Activity',
]
