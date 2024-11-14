import React, { useState } from 'react';
import { ShowCard } from '../components/ShowCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useMovies } from '../hooks/useMovies';
import { ShowCardSkeleton } from '../components/Skeletons';

type MovieFilter = 'all' | 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

export function Movies() {
  const [filter, setFilter] = useState<MovieFilter>('all');
  const [page, setPage] = useState(1);
  const { movies, loading, error, hasMore } = useMovies(filter, page);

  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  const filterOptions: { value: MovieFilter; label: string }[] = [
    { value: 'all', label: 'All Movies' },
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'now_playing', label: 'Now Playing' },
    { value: 'upcoming', label: 'Upcoming' }
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
        <h1 className="text-3xl font-bold">Movies</h1>
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
        {movies.map((movie: any) => (
          <ShowCard
            key={movie.id}
            id={movie.id}
            name={movie.title}
            posterPath={movie.poster_path}
            voteAverage={movie.vote_average}
            releaseDate={movie.release_date}
            mediaType="movie"
            watchProviders={movie.watchProviders}
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
            Load More Movies
          </button>
        </div>
      )}
    </div>
  );
}