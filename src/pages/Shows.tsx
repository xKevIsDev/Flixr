import React, { useState } from 'react';
import { ShowCard } from '../components/ShowCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useShows } from '../hooks/useShows';
import { ShowCardSkeleton } from '../components/Skeletons';

type ShowFilter = 'all' | 'popular' | 'top_rated' | 'on_the_air' | 'airing_today';

export function Shows() {
  const [filter, setFilter] = useState<ShowFilter>('all');
  const [page, setPage] = useState(1);
  const { shows, loading, error, hasMore } = useShows('tv', filter, page);

  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  const filterOptions: { value: ShowFilter; label: string }[] = [
    { value: 'all', label: 'All Shows' },
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'on_the_air', label: 'Currently Airing' },
  ];

  if (loading && page === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-zinc-800 rounded w-40 animate-pulse" />
          <div className="flex gap-2">
            {filterOptions.map((_, i) => (
              <div key={i} className="h-10 bg-zinc-800 rounded w-24 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <ShowCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">TV Shows</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setPage(1); // Reset page when changing filters
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === option.value
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shows.map((show: any) => (
          <ShowCard
            key={show.id}
            id={show.id}
            name={show.name}
            posterPath={show.poster_path}
            voteAverage={show.vote_average}
            firstAirDate={show.first_air_date}
            mediaType="tv"
            watchProviders={show.watchProviders}
          />
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {hasMore && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-3 bg-red-600 hover:bg-white hover:text-black rounded-lg transition-colors"
          >
            Load More Shows
          </button>
        </div>
      )}
    </div>
  );
}