'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { getImageUrl } from '../config/api';
import { WatchProviders } from '../components/WatchProviders';

interface ShowCardProps {
  id: number;
  name?: string;
  title?: string;
  posterPath: string;
  voteAverage: number;
  firstAirDate?: string;
  releaseDate?: string;
  mediaType?: 'movie' | 'tv';
  watchProviders?: {
    flatrate?: Array<{
      logo_path: string;
      provider_name: string;
      provider_id: number;
      display_priority?: number;
    }>;
    rent?: Array<{
      logo_path: string;
      provider_name: string;
      provider_id: number;
      display_priority?: number;
    }>;
    buy?: Array<{
      logo_path: string;
      provider_name: string;
      provider_id: number;
      display_priority?: number;
    }>;
  };
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
    <div className="bg-zinc-900 rounded-xl overflow-hidden group">
      <div className="relative">
        <Link href={linkPath}>
          <img 
            src={getImageUrl(posterPath) || ''}
            alt={displayName}
            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
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
          </div>
        </Link>
        
        {/* Watch Providers outside of Link but still in overlay */}
        {watchProviders && (
          <div className="absolute bottom-4 right-4 right-4 mt-auto">
            <div className="scale-90 origin-left">
              <WatchProviders 
                providers={watchProviders} 
                compact={true}
                maxProviders={3}
                isStandalone={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}