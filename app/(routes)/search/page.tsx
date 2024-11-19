'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShowCard } from '@/components/ShowCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { searchMultiContent } from '@/services/api';
import { ShowCardSkeleton } from '@/components/Skeletons';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [filter, setFilter] = useState<'all' | 'tv' | 'movie'>('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const searchMedia = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const data = await searchMultiContent(query, page);
        
        const filteredResults = data.results.filter((item: any) => {
          if (filter === 'all') return item.media_type === 'tv' || item.media_type === 'movie';
          return item.media_type === filter;
        });

        if (page === 1) {
          setResults(filteredResults);
        } else {
          setResults(prev => [...prev, ...filteredResults]);
        }
        
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError('Failed to search content');
      } finally {
        setLoading(false);
      }
    };

    searchMedia();
  }, [query, filter, page]);

  const handleFilterChange = (newFilter: 'all' | 'tv' | 'movie') => {
    setFilter(newFilter);
    setPage(1);
    setResults([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">
          {query ? `Search Results for "${query}"` : 'Search Results'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('tv')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'tv' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            TV Shows
          </button>
          <button
            onClick={() => handleFilterChange('movie')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'movie' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Movies
          </button>
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <ShowCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">{error}</div>
      ) : results.length === 0 && query ? (
        <div className="text-center text-gray-400 p-8">
          No results found for "{query}"
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item: any) => (
              <ShowCard
                key={item.id}
                id={item.id}
                name={item.media_type === 'tv' ? item.name : item.title}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                firstAirDate={item.media_type === 'tv' ? item.first_air_date : undefined}
                releaseDate={item.media_type === 'movie' ? item.release_date : undefined}
                mediaType={item.media_type}
                watchProviders={item.watchProviders}
              />
            ))}
          </div>

          {loading && <LoadingSpinner />}

          {hasMore && !loading && results.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-6 py-3 bg-red-600 hover:bg-white hover:text-black rounded-lg transition-colors"
              >
                Load More Results
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}