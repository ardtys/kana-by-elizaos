import { memo, useState } from 'react'

const PERSONALITY_TRAITS = [
  { text: 'Speed Demon', color: 'solana-green' },
  { text: 'Tsundere', color: 'gaze-red' },
  { text: 'Cold & Calculated', color: 'solana-purple' },
  { text: 'Diamond Hands', color: 'solana-green' },
  { text: 'Analytical', color: 'solana-purple' },
  { text: 'Market Oracle', color: 'gaze-orange' },
]

const TOPICS_OF_INTEREST = [
  'Solana Trading',
  'Mempool Analysis',
  'DeFi Architecture',
  'Zero-Knowledge',
  'Chain Optimization',
  'Liquidity Flows',
]

const AboutMe = () => {
  const [hoveredTrait, setHoveredTrait] = useState<number | null>(null)

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/5 via-transparent to-solana-green/5" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute size-1 rounded-full bg-solana-purple/30 animate-float-particle"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-5 overflow-y-auto flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-solana-purple animate-pulse">◈</span>
          <h2 className="font-mono text-sm font-bold text-foreground uppercase tracking-wider">
            About_Me
          </h2>
        </div>

        {/* Profile Section */}
        <div className="mb-5">
          {/* Avatar and Name */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0 group">
              {/* Rotating Ring */}
              <div className="absolute -inset-1 rounded-full border border-dashed border-solana-purple/40 animate-spin-slow" />

              {/* Avatar */}
              <div className="relative size-16 rounded-full overflow-hidden border-2 border-solana-purple/50 bg-gradient-to-br from-solana-purple/20 to-solana-green/20 shadow-[0_0_20px_rgba(153,69,255,0.4)] group-hover:shadow-[0_0_30px_rgba(153,69,255,0.6)] transition-shadow">
                <img
                  src="/kana-logo.png"
                  alt="KANA"
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -right-1 -bottom-1 size-5 flex items-center justify-center bg-void-black rounded-full border-2 border-solana-green">
                <span className="size-2 rounded-full bg-solana-green animate-pulse" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-mono text-xl font-black bg-gradient-to-r from-solana-purple via-white to-solana-green bg-clip-text text-transparent animate-gradient-x">
                  KANA
                </h3>
                <span className="about-badge font-mono text-[9px] text-solana-purple/80 px-2 py-0.5 rounded-full bg-solana-purple/10 border border-solana-purple/30 font-medium">
                  ElizaOS
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-solana-purple/10 border border-solana-purple/30">
                <span className="size-1.5 rounded-full bg-solana-purple animate-pulse" />
                <span className="font-mono text-[10px] font-medium text-solana-purple uppercase tracking-wider">
                  Solana Entity
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Eyes', value: 'Piercing Red', color: 'gaze-red' },
              { label: 'Hair', value: 'Liquid Data', color: 'foreground' },
              { label: 'Style', value: 'Holographic', color: 'solana-purple' },
              { label: 'Network', value: 'Solana', color: 'solana-green' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg bg-muted/20 p-2.5 border border-solana-purple/10 hover:border-solana-purple/30 transition-all hover:scale-[1.02] group cursor-default"
              >
                <div className="font-mono text-[9px] text-muted-foreground mb-0.5 uppercase tracking-wider">{stat.label}</div>
                <div className={`font-mono text-xs font-semibold text-${stat.color} group-hover:animate-pulse`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <p className="font-sans text-xs text-muted-foreground leading-relaxed border-l-2 border-solana-purple/30 pl-3">
            The embodiment of Solana's High-Speed Network. I don't just trade—I orchestrate the flow of money with cold, calculated precision. Show me your Diamond Hands, Trader. ◆⚡
          </p>
        </div>

        {/* Personality Traits */}
        <div className="mb-4">
          <h4 className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="size-1 rounded-full bg-solana-purple" />
            Personality Traits
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {PERSONALITY_TRAITS.map((trait, index) => (
              <span
                key={index}
                onMouseEnter={() => setHoveredTrait(index)}
                onMouseLeave={() => setHoveredTrait(null)}
                className={`inline-block rounded-md px-2 py-1 bg-gradient-to-r from-${trait.color}/10 to-${trait.color}/5 border border-${trait.color}/20 font-mono text-[10px] font-medium text-${trait.color} transition-all cursor-default ${hoveredTrait === index ? 'scale-105 shadow-[0_0_15px_rgba(153,69,255,0.3)]' : ''}`}
              >
                {trait.text}
              </span>
            ))}
          </div>
        </div>

        {/* Topics of Interest */}
        <div>
          <h4 className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="size-1 rounded-full bg-solana-green" />
            Topics of Interest
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {TOPICS_OF_INTEREST.map((topic, index) => (
              <span
                key={index}
                className="inline-block rounded-md px-2 py-1 bg-muted/20 border border-border font-mono text-[10px] text-solana-green hover:border-solana-green/40 hover:bg-solana-green/5 hover:shadow-[0_0_10px_rgba(20,241,149,0.2)] transition-all cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }
        .animate-float-particle {
          animation: float-particle 5s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease-in-out infinite;
        }
        .about-badge {
          position: relative;
          overflow: hidden;
        }
        .about-badge::after {
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
      `}</style>
    </div>
  )
}

export default memo(AboutMe)
