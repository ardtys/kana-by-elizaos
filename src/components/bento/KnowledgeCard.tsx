import { memo } from 'react'

interface KnowledgeCardProps {
  title: string
  description?: string
  tags?: string[]
  imageUrl?: string
  href?: string
  date?: string
}

const KnowledgeCard = memo<KnowledgeCardProps>(({
  title,
  description,
  tags = [],
  imageUrl,
  href = '#',
  date,
}) => {
  return (
    <a
      href={href}
      className="bento-card group relative flex size-full flex-col overflow-hidden transition-all duration-300"
    >
      {/* Background Image (Grayscale) */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 grayscale transition-opacity duration-300 group-hover:opacity-30"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex size-full flex-col p-5">
        {/* Header with Date */}
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-solana-purple uppercase tracking-wider">
            Knowledge_Base
          </span>
          {date && (
            <span className="font-mono text-xs text-muted-foreground">
              {date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 font-mono text-base font-medium text-foreground leading-snug group-hover:text-mint-green transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mb-4 font-sans text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="code-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Arrow */}
        <div className="absolute right-4 bottom-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-mint-green"
          >
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </a>
  )
})

export default KnowledgeCard
