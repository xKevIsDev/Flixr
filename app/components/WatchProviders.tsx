'use client';

import { useState, useEffect } from 'react';
import { getAllProviderDetails } from '../services/api';
import { providerUrls, providerNames } from '../constants/streamingUrls';
import Image from 'next/image';
import { getImageUrl } from '@/config/api';

interface Provider {
  logo_path: string;
  provider_name: string;
  provider_id: number;
  display_priority?: number;
}

interface WatchProvidersProps {
  providers: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
    link?: string; // Make link optional
  };
  compact?: boolean;
  maxProviders?: number;
  isStandalone?: boolean;
}

export function WatchProviders({ 
  providers, 
  compact = false, 
  maxProviders = 4,
  isStandalone = true
}: WatchProvidersProps) {
  const { flatrate, rent, buy, link: justWatchLink } = providers;

  const renderProviders = (providers: Provider[] | undefined, type: string) => {
    if (!providers?.length) return null;

    const displayProviders = providers.slice(0, maxProviders);

    return (
      <div className="space-y-2">
        <h3 className="text-sm text-gray-400">{type}</h3>
        <div className="flex flex-wrap gap-2">
          {displayProviders.map((provider) => (
            <a
              key={provider.provider_id}
              href={justWatchLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
              title={`Find ${provider.provider_name} watching options on JustWatch`}
            >
              <Image
                src={getImageUrl(provider.logo_path, 'w92') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
                alt={provider.provider_name}
                width={35}
                height={35}
                className="rounded-lg"
              />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderProviders(flatrate, "Stream")}
      {renderProviders(rent, "Rent")}
      {renderProviders(buy, "Buy")}
      
      {/* Only show JustWatch attribution if we have a link and it's standalone */}
      {isStandalone && justWatchLink && (
        <div className="text-xs text-gray-400 mt-2">
          <p>Find official streaming options:</p>
          <a 
            href={justWatchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400"
          >
            View legal watching options on JustWatch →
          </a>
          <p className="mt-1">Streaming availability powered by JustWatch</p>
        </div>
      )}
    </div>
  );
} 