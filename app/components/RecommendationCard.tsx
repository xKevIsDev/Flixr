import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/config/api';

interface RecommendationItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  overview: string;
  details: {
    rating: number;
    runtime: number;
  };
  watchProviders?: Record<string, any>;
}

interface RecommendationCardProps {
  item: {
    id: string | number;
    title?: string;
    name?: string;
    posterPath: string;
    poster_path?: string;
    media_type: 'movie' | 'tv';
    overview: string;
    details: {
      rating: number;
      runtime: number;
    };
    watchProviders?: Record<string, any>;
    aiReason?: string;
  };
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  const title = item.title || item.name;
  const posterPath = item.posterPath || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png";
  const imageUrl = getImageUrl(posterPath, 'w185');
  
  // Determine the correct route based on media type
  const href = `/${item.media_type === 'tv' ? 'show' : 'movie'}/${item.id}`;

  return (
    <Link href={href}>
      <div className="flex gap-3 bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer">
        {/* Poster Image */}
        <div className="flex-shrink-0 w-20 h-28 relative rounded-md overflow-hidden">
          <Image
            src={imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
            alt={title || 'No title'}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-semibold text-sm text-white truncate">
            {title}
          </h4>

          {/* Media Type & Year */}
          <p className="text-xs text-zinc-400 mt-1">
            {item.media_type.toUpperCase()} 
            {item.details?.rating && ` • ${item.details.rating.toFixed(1)}/10`}
          </p>

          {/* AI Reason */}
          {item.aiReason && (
            <p className="text-sm text-zinc-300 mt-2 line-clamp-2">
              {item.aiReason}
            </p>
          )}

          {/* Overview */}
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
            {item.overview}
          </p>
        </div>
      </div>
    </Link>
  );
}