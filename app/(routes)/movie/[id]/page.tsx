'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getMovieDetails } from '@/services/api';
import { getImageUrl } from '@/config/api';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ShowDetailsSkeleton } from '@/components/Skeletons';
import { WatchProviders } from '@/components/WatchProviders';
import Image from 'next/image';

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  if (loading) return <ShowDetailsSkeleton />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!movie) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-4">
      <Link 
        href="/movies" 
        className="inline-flex items-center text-red-600 hover:text-white mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Movies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 rounded-xl overflow-hidden">
            <div className="relative h-96">
              <Image
                src={getImageUrl(movie.backdrop_path, 'original') || ''}
                alt={movie.title}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  {movie.runtime && (
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {movie.videos?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Videos & Trailers</h2>
                  <VideoPlayer videos={movie.videos} />
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 mb-8">{movie.overview}</p>

              {movie.credits?.cast && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movie.credits.cast.slice(0, 10).map((actor: any) => (
                      <div key={actor.id} className="text-center">
                        <Image
                          src={getImageUrl(actor.profile_path, 'w185') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
                          alt={actor.name}
                          width={1920}
                          height={1080}
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <p className="font-semibold">{actor.name}</p>
                        <p className="text-sm text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Watch Providers Card */}
          {movie.watchProviders && (
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Where to Watch</h2>
              <WatchProviders providers={movie.watchProviders} />
            </div>
          )}

          {/* Movie Details Card */}
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Movie Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm">Director</h3>
                <p>{movie.credits?.crew?.find((p: any) => p.job === 'Director')?.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Genres</h3>
                <p>{movie.genres?.map((genre: any) => genre.name).join(', ')}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Release Date</h3>
                <p>{new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Production Companies</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {movie.production_companies?.map((company: any) => (
                    company.logo_path && (
                      <Image
                        key={company.id}
                        src={getImageUrl(company.logo_path, 'w92') || ''}
                        alt={company.name}
                        width={1920}
                        height={1080}
                        className="h-8 object-contain bg-white rounded px-2"
                      />
                    )
                  ))}
                </div>
              </div>
              {movie.budget > 0 && (
                <div>
                  <h3 className="text-gray-400 text-sm">Budget</h3>
                  <p>${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <h3 className="text-gray-400 text-sm">Box Office</h3>
                  <p>${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 