import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/config/api'
import { Star, Clock, Film, Tv } from 'lucide-react'

interface RecommendationItem {
  id: number | string
  title?: string
  name?: string
  posterPath: string
  media_type: 'movie' | 'tv'
  overview: string
  details: {
    rating: number
    runtime: number
  }
  watchProviders?: Record<string, any>
  aiReason?: string
}

interface RecommendationCardProps {
  item: RecommendationItem
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  const title = item.title || item.name || 'Untitled'
  const imageUrl = item.posterPath
    ? getImageUrl(item.posterPath, 'w185')
    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'
  
  const href = `/${item.media_type === 'tv' ? 'show' : 'movie'}/${item.id}`

  return (
    <Link href={href} className="block">
      <article className="flex gap-3 bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition-all duration-300 cursor-pointer group">
        <div className="flex-shrink-0 w-16 md:w-24 h-24 md:h-36 relative rounded-md overflow-hidden">
          <Image
            src={imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
            alt={`Poster for ${title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 64px, 96px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:text-red-500 transition-colors">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-zinc-400">
            {item.media_type === 'movie' ? (
              <span className="flex items-center gap-1 text-xs">
                <Film className="w-3 h-3" /> Movie
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs">
                <Tv className="w-3 h-3" /> TV Show
              </span>
            )}
            {item.details?.rating && (
              <span className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 text-yellow-400" />
                {item.details.rating.toFixed(1)}
              </span>
            )}
            {item.details?.runtime > 0 && (
              <span className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                {item.details.runtime} min
              </span>
            )}
          </div>

          {item.aiReason && (
            <p className="text-xs block md:text-sm text-zinc-300 mt-1.5 line-clamp-2 italic">
              &quot;{item.aiReason}&quot;
            </p>
          )}

          {/* <p className="hidden md:block text-xs text-zinc-400 mt-1.5 line-clamp-2">
            {item.overview}
          </p> */}
        </div>
      </article>
    </Link>
  )
}