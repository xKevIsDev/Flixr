import Image from 'next/image';
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
  item: RecommendationItem;
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <div className="flex gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
      <div className="flex-shrink-0 w-20">
        <Image
          src={getImageUrl(item.poster_path) || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
          alt={item.title || item.name || 'No title'}
          width={80}
          height={120}
          className="rounded-md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">
          {item.title || item.name}
        </h4>
        <p className="text-xs text-gray-400 mb-2">
          {item.media_type === 'movie' ? 'Movie' : 'TV Show'} • 
          ⭐ {item.details.rating.toFixed(1)} •
          {item.details.runtime}min
        </p>
        <p className="text-xs text-gray-300 line-clamp-2">
          {item.overview}
        </p>
        {item.watchProviders && (
          <div className="mt-2">
            <p className="text-xs text-gray-400 mb-1">Available on:</p>
            <div className="flex flex-wrap gap-1">
              {Object.keys(item.watchProviders).map(provider => (
                <span key={provider} className="text-xs bg-zinc-700 px-2 py-1 rounded">
                  {provider}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}