import React from 'react';
import { Link } from 'react-router-dom';
import { ShowCard } from '../components/ShowCard';
import { useShows } from '../hooks/useShows';
import { useMovies } from '../hooks/useMovies';
import { ShowCardSkeleton } from '../components/Skeletons';
import { HeroSection } from '../components/HeroSection';
import { categories } from '../constants/categories';

function SectionHeader({ title, viewAllLink }: { title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link
        to={viewAllLink}
        className="text-red-500 hover:text-red-400 transition-colors text-sm font-semibold"
      >
        View All →
      </Link>
    </div>
  );
}

function ContentRow({ items, loading, mediaType = 'tv' }: { items: any[]; loading: boolean; mediaType?: 'movie' | 'tv' }) {
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

export function Home() {
  const { shows: trendingShows, loading: loadingShows } = useShows('tv', 'trending');
  const { movies: popularMovies, loading: loadingMovies } = useMovies('popular');

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 px-4">
        {/* Trending Shows */}
        <section>
          <SectionHeader title="Trending Shows" viewAllLink="/shows" />
          <ContentRow items={trendingShows} loading={loadingShows} mediaType="tv" />
        </section>

        {/* Popular Movies */}
        <section>
          <SectionHeader title="Popular Movies" viewAllLink="/movies" />
          <ContentRow items={popularMovies} loading={loadingMovies} mediaType="movie" />
        </section>

        {/* Categories Grid */}
        <section className="pb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}?type=${category.mediaType}`}
                className="relative aspect-video rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                              group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />
                <img
                  src={`https://image.tmdb.org/t/p/w780${category.backdropPath}`}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-xl md:text-2xl font-semibold text-center">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 
                                 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore {category.mediaType === 'movie' ? 'Movies' : 'TV Shows'} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}