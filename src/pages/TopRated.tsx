import React, { useState } from 'react';
import { ShowCard } from '../components/ShowCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useTopRated } from '../hooks/useTopRated';

export function TopRated() {
  const [mediaType, setMediaType] = useState<'tv' | 'movie'>('tv');
  const { shows, loading, error } = useTopRated(mediaType);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Top Rated</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMediaType('tv')}
            className={`px-4 py-2 rounded-lg ${
              mediaType === 'tv' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            TV Shows
          </button>
          <button
            onClick={() => setMediaType('movie')}
            className={`px-4 py-2 rounded-lg ${
              mediaType === 'movie' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Movies
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shows.map((show: any) => (
          <ShowCard
            key={show.id}
            id={show.id}
            name={mediaType === 'tv' ? show.name : show.title}
            posterPath={show.poster_path}
            voteAverage={show.vote_average}
            firstAirDate={mediaType === 'tv' ? show.first_air_date : show.release_date}
            mediaType={mediaType}
            watchProviders={show.watchProviders}
          />
        ))}
      </div>
    </div>
  );
}