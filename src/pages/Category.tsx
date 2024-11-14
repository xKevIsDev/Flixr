import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShowCard } from '../components/ShowCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useCategory } from '../hooks/useCategory';
import { ShowCardSkeleton } from '../components/Skeletons';

export function Category() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = searchParams.get('type') as 'movie' | 'tv' || 'tv';
  const [page, setPage] = useState(1);

  // Add debug logging
  useEffect(() => {
    console.log('Category Component State:', {
      id,
      mediaType,
      searchParams: Object.fromEntries(searchParams.entries()),
    });
  }, [id, mediaType, searchParams]);

  const handleMediaTypeChange = (newType: 'movie' | 'tv') => {
    console.log('Switching media type to:', newType); // Debug log
    setSearchParams({ type: newType });
    setPage(1);
  };

  const { items, loading, error, hasMore, categoryName } = useCategory(Number(id), mediaType, page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleMediaTypeChange('tv')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mediaType === 'tv'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              TV Shows
            </button>
            <button
              onClick={() => handleMediaTypeChange('movie')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mediaType === 'movie'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              Movies
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No {mediaType === 'tv' ? 'TV shows' : 'movies'} found in this category.
            Try switching to {mediaType === 'tv' ? 'movies' : 'TV shows'}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <ShowCard
              key={item.id}
              id={item.id}
              name={mediaType === 'tv' ? item.name : item.title}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              firstAirDate={mediaType === 'tv' ? item.first_air_date : undefined}
              releaseDate={mediaType === 'movie' ? item.release_date : undefined}
              mediaType={mediaType}
              watchProviders={item.watchProviders}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <ShowCardSkeleton key={i} />
          ))}
        </div>
      )}

      {hasMore && !loading && items.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-3 bg-red-600 hover:bg-white hover:text-black rounded-lg transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}