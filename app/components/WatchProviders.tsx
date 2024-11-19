'use client';

import { useState, useEffect } from 'react';
import { getAllProviderDetails } from '../services/api';
import { providerUrls, providerNames } from '../constants/streamingUrls';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

interface WatchProvidersProps {
  providers: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
  compact?: boolean;
  maxProviders?: number;
  isStandalone?: boolean;
}

export function WatchProviders({ 
  providers, 
  compact = false,
  maxProviders = Infinity,
  isStandalone = false
}: WatchProvidersProps) {
  const [allProviders, setAllProviders] = useState<Provider[]>([]);

  useEffect(() => {
    getAllProviderDetails().then(providers => {
      setAllProviders(providers);
    });
  }, []);

  if (!providers) return null;

  const getProviderUrl = (providerId: number, providerName: string) => {
    if (providerUrls[providerId]) {
      return providerUrls[providerId];
    }
    return `https://www.google.com/search?q=watch+on+${encodeURIComponent(providerName)}`;
  };

  const renderProvider = (provider: Provider) => {
    const providerUrl = getProviderUrl(provider.provider_id, provider.provider_name);
    const providerName = providerNames[provider.provider_id] || provider.provider_name;

    const content = (
      <div className="group relative" title={`Watch on ${providerName}`}>
        <img
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt={providerName}
          className={`
            ${compact 
              ? 'w-5 h-5 rounded-full border border-zinc-800' 
              : 'w-10 h-10 rounded-lg'
            }
            transform transition-transform group-hover:scale-110 
            group-hover:ring-2 ring-red-500
          `}
        />
        {!compact && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 
                        rounded-full flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-opacity">
            <svg 
              className="w-3 h-3 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </span>
        )}
      </div>
    );

    return isStandalone ? (
      content
    ) : (
      <a
        key={provider.provider_id}
        href={providerUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  };

  const renderProviderSection = (providers: Provider[], title: string) => {
    if (!providers?.length) return null;

    const displayProviders = providers
      .slice(0, maxProviders)
      .sort((a, b) => {
        const priorityA = a.display_priority || 0;
        const priorityB = b.display_priority || 0;
        return priorityA - priorityB;
      });

    return (
      <div>
        {!compact && <h3 className="text-sm text-gray-400 mb-2">{title}</h3>}
        <div className={`flex ${compact ? 'items-center gap-1' : 'flex-wrap gap-2'}`}>
          {compact && <span className="text-xs text-gray-400">{title}:</span>}
          <div className={`flex ${compact ? '-space-x-2' : 'gap-2'}`}>
            {displayProviders.map(renderProvider)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${compact ? 'space-y-1' : 'space-y-4'}`}>
      {renderProviderSection(providers.flatrate || [], 'Stream')}
      {renderProviderSection(providers.rent || [], 'Rent')}
      {!compact && renderProviderSection(providers.buy || [], 'Buy')}
    </div>
  );
} 