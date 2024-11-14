import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedContent } from '../hooks/useFeaturedContent';
import { PlayIcon, StopCircleIcon, InfoIcon } from 'lucide-react';
import { WatchProviders } from '../components/WatchProviders';

export function HeroSection() {
  const { featured, loading } = useFeaturedContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (featured.length === 0 || isVideoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % featured.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featured.length, isVideoPlaying]);

  if (loading || featured.length === 0) {
    return (
      <div className="relative h-[56.25vw] max-h-[80vh] min-h-[400px] mb-8 bg-zinc-900 animate-pulse">
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
    <div className="relative h-[56.25vw] max-h-[80vh] min-h-[400px] mb-8 group overflow-hidden">
      {/* Background Container */}
      <div className="absolute inset-0">
        {isVideoPlaying && trailer ? (
          <div className="relative w-full h-full">
            {/* Background Image */}
            <img
              src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover"
            />
            
            {/* Video Container - Hidden on mobile, adjusted for tablet/desktop */}
            <div className="absolute inset-0 hidden sm:flex items-center">
              <div className="relative w-full md:w-[70%] h-full ml-auto overflow-hidden">
                {/* Video wrapper with gradients */}
                <div className="absolute inset-0">
                  <div className="relative w-full h-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`}
                      className="w-[130%] h-[130%] absolute -top-[15%] -left-[15%] pointer-events-none"
                      allow="autoplay"
                      title="trailer"
                    />
                  </div>
                  {/* Edge gradients - Adjusted for different screen sizes */}
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent 
                                w-1/3 sm:w-1/4 md:w-1/3" />
                  <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 via-transparent to-transparent 
                                w-1/4 ml-auto" />
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-transparent to-zinc-900/30" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
            alt={currentItem.title || currentItem.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Base gradients - Responsive adjustments */}
        <div className="absolute inset-0 bg-gradient-to-t 
                      from-zinc-900 
                      via-zinc-900/60 
                      to-zinc-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r 
                      from-zinc-900 
                      via-zinc-900/90 sm:via-zinc-900/80 
                      to-transparent" />
      </div>

      {/* Content - Responsive layout */}
      <div className="absolute inset-0 flex flex-col justify-end sm:justify-center">
        <div className="p-4 sm:px-8 md:px-20 
                      w-full sm:w-[60%] md:w-[45%] 
                      relative z-10 
                      space-y-3 sm:space-y-4">
          {/* Title - Responsive typography */}
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {currentItem.title || currentItem.name}
          </h1>

          {/* Overview - Responsive text and clamp */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200
                      line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
            {currentItem.overview}
          </p>
          
          {/* Buttons and Info - Responsive layout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            {trailer && (
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="inline-flex items-center px-3 sm:px-4 md:px-6 
                         py-1.5 sm:py-2 md:py-3 
                         bg-red-600 hover:bg-red-700 
                         transition-colors rounded-lg 
                         text-white text-sm sm:text-base font-semibold"
              >
                {isVideoPlaying ? (
                  <>
                    <StopCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                    <span className="hidden sm:inline">Stop</span> Trailer
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                    <span className="hidden sm:inline">Play</span> Trailer
                  </>
                )}
              </button>
            )}
            
            <Link
              to={getDetailsLink(currentItem)}
              className="inline-flex items-center px-3 sm:px-4 md:px-6 
                       py-1.5 sm:py-2 md:py-3 
                       bg-gray-800/80 hover:bg-gray-700/80 
                       transition-colors rounded-lg 
                       text-white text-sm sm:text-base font-semibold"
            >
              <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
              <span className="hidden sm:inline">More</span> Info
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold text-sm sm:text-base">
                {currentItem.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Streaming Providers - Responsive */}
          {currentItem.watchProviders && (
            <div className="flex items-center gap-2 sm:gap-3">
              <WatchProviders 
                providers={currentItem.watchProviders} 
                compact={true}
                maxProviders={window.innerWidth < 640 ? 3 : 4}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dots - Responsive positioning */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 
                    flex space-x-1 sm:space-x-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsVideoPlaying(false);
            }}
            className={`h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 
                      ${index === currentIndex 
                        ? 'bg-red-500 w-4 sm:w-6 md:w-8' 
                        : 'bg-gray-400 hover:bg-gray-300 w-1 sm:w-1.5 md:w-2'}`}
          />
        ))}
      </div>
    </div>
  );
} 