import React from 'react';
import { ShowCard } from '../components/ShowCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useShows } from '../hooks/useShows';

export function Home() {
  const { shows, loading, error } = useShows();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Trending Shows</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shows.map((show: any) => (
            <ShowCard
              key={show.id}
              id={show.id}
              name={show.name}
              posterPath={show.poster_path}
              voteAverage={show.vote_average}
              firstAirDate={show.first_air_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}