'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { ContentRow } from '@/components/ContentRow';
import { HeroSection } from '@/components/HeroSection';
import { useShows } from '@/hooks/useShows';
import { useMovies } from '@/hooks/useMovies';
import { categories } from '@/constants/categories';

export default function HomePage() {
  const { shows: trendingShows, loading: loadingShows } = useShows('tv', 'trending');
  const { movies: popularMovies, loading: loadingMovies } = useMovies('popular');

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Movie & TV Show Guide
              </h2>
              <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-2xl">
                Discover detailed information about movies and TV shows, including ratings, cast, trailers, and where to watch them legally. 
                <span className="text-xs text-gray-500 ml-1">
                  Powered by <a href="https://www.themoviedb.org" className="text-red-500 hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">TMDB</a>
                </span>
              </p>
              <span className="text-xs text-gray-500">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex flex-col items-center px-4 py-2 bg-zinc-800/50 rounded-lg">
                <span className="text-2xl font-bold text-white">10K+</span>
                <span className="text-xs">Movies</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 bg-zinc-800/50 rounded-lg">
                <span className="text-2xl font-bold text-white">5K+</span>
                <span className="text-xs">TV Shows</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 px-4">
        <section>
          <SectionHeader title="Trending Shows" viewAllLink="/shows" />
          <ContentRow items={trendingShows} loading={loadingShows} mediaType="tv" />
        </section>

        <section>
          <SectionHeader title="Popular Movies" viewAllLink="/movies" />
          <ContentRow items={popularMovies} loading={loadingMovies} mediaType="movie" />
        </section>

        <section className="pb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}?type=${category.mediaType}`}
                className="relative aspect-video rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                              group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />
                <Image
                  src={`https://image.tmdb.org/t/p/w780${category.backdropPath}` || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
                  alt={category.name}
                  width={1920}
                  height={1080}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
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