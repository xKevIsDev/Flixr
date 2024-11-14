import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedContent } from '../hooks/useFeaturedContent';
import { PlayIcon, StopCircleIcon, InfoIcon } from 'lucide-react';
import { WatchProviders } from '../components/WatchProviders';

export function HeroSection() {
  const { featured, loading } = useFeaturedContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-rotate featured content (only when video isn't playing)
  useEffect(() => {
    if (featured.length === 0 || isVideoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % featured.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featured.length, isVideoPlaying]);

  if (loading || featured.length === 0) {
    return (
      <div className="relative h-[50vh] sm:h-[70vh] mb-8 sm:mb-12 bg-zinc-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-16 max-w-3xl space-y-4">
          <div className="h-8 sm:h-12 w-2/3 bg-zinc-800 rounded" />
          <div className="h-16 sm:h-20 w-full bg-zinc-800 rounded" />
          <div className="h-10 sm:h-12 w-40 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  const currentItem = featured[currentIndex];
  const trailer = currentItem.videos?.[0];

  const getDetailsLink = (item: any) => {
    const mediaType = item.media_type === 'tv' ? 'show' : 'movie';
    const fallbackType = item.title ? 'movie' : 'show';
    
    return `/${item.media_type ? mediaType : fallbackType}/${item.id}`;
  };

  return (
    <div className="relative h-[50vh] sm:h-[70vh] mb-8 sm:mb-12 group">
      {/* Background Content */}
      <div className="absolute inset-0">
        {isVideoPlaying && trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1`}
            className="w-full h-full"
            allow="autoplay"
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
            alt={currentItem.title || currentItem.name}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:px-20 md:py-1 max-w-3xl">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">
          {currentItem.title || currentItem.name}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-0 sm:mb-6 
                     line-clamp-2 sm:line-clamp-3">
          {currentItem.overview}
        </p>
        
        {/* Buttons and Info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {trailer && (
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 
                       bg-red-600 hover:bg-red-700 transition-colors 
                       rounded-lg text-white text-sm sm:text-base font-semibold"
            >
              {isVideoPlaying ? (
                <>
                  <StopCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Stop Trailer
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Play Trailer
                </>
              )}
            </button>
          )}
          
          <Link
            to={getDetailsLink(currentItem)}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 
                     bg-gray-800/80 hover:bg-gray-700/80 transition-colors 
                     rounded-lg text-white text-sm sm:text-base font-semibold"
          >
            <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Details
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold text-sm sm:text-base">
              {currentItem.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Streaming Providers */}
        {currentItem.watchProviders && (
          <div className="flex items-center gap-3">
            <WatchProviders 
              providers={currentItem.watchProviders} 
              compact={true}
              maxProviders={4}
            />
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 right-4 flex space-x-1.5 sm:space-x-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsVideoPlaying(false);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 
                      ${index === currentIndex 
                        ? 'bg-red-500 w-6 sm:w-8' 
                        : 'bg-gray-400 hover:bg-gray-300 w-1.5 sm:w-2'}`}
          />
        ))}
      </div>
    </div>
  );
} 