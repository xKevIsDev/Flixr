'use client';

import { ShowCard } from './ShowCard';
import { ShowCardSkeleton } from './Skeletons';

export function ContentRow({ items, loading, mediaType = 'tv' }: { 
  items: any[]; 
  loading: boolean; 
  mediaType?: 'movie' | 'tv' 
}) {
  if (loading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-[250px] flex-shrink-0">
            <ShowCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {items.map((item) => (
          <div key={item.id} className="w-[140px] sm:w-[200px] md:w-[250px] flex-shrink-0">
            <ShowCard
              id={item.id}
              name={item.name || item.title}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              firstAirDate={item.first_air_date || item.release_date}
              mediaType={mediaType}
            />
          </div>
        ))}
      </div>
    </div>
  );
}