import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { getImageUrl } from '../config/api';

interface WatchProvider {
  logo_path: string;
  provider_name: string;
}

interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

interface ShowCardProps {
  id: number;
  name?: string;
  title?: string;
  posterPath: string;
  voteAverage: number;
  firstAirDate?: string;
  releaseDate?: string;
  mediaType?: 'movie' | 'tv';
  watchProviders?: WatchProviders;
}

export function ShowCard({
  id,
  name,
  title,
  posterPath,
  voteAverage,
  firstAirDate,
  releaseDate,
  mediaType = 'tv',
  watchProviders
}: ShowCardProps) {
  const displayName = title || name;
  const date = releaseDate || firstAirDate;
  const linkPath = mediaType === 'movie' ? `/movie/${id}` : `/show/${id}`;

  return (
    <Link to={linkPath} className="group">
      <div className="bg-zinc-900 rounded-xl overflow-hidden transition-transform hover:scale-105">
        <div className="relative">
          <img 
            src={getImageUrl(posterPath) || ''}
            alt={displayName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-semibold mb-2">{displayName}</h3>
            <div className="flex items-center space-x-4 text-sm mb-2">
              <span className="flex items-center">
                <Play className="h-4 w-4 mr-1" />
                {date ? new Date(date).getFullYear() : 'N/A'}
              </span>
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {voteAverage.toFixed(1)}
              </span>
            </div>
            
            {/* Watch Providers */}
            {watchProviders && (
              <div className="space-y-1">
                {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Stream:</span>
                    <div className="flex -space-x-2">
                      {watchProviders.flatrate.slice(0, 3).map((provider) => (
                        <img
                          key={provider.provider_name}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-5 h-5 rounded-full border border-zinc-800"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {watchProviders.rent && watchProviders.rent.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Rent:</span>
                    <div className="flex -space-x-2">
                      {watchProviders.rent.slice(0, 3).map((provider) => (
                        <img
                          key={provider.provider_name}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-5 h-5 rounded-full border border-zinc-800"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}