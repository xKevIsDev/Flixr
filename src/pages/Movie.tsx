import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getMovieDetails, getVideos } from '../services/api';
import { getImageUrl } from '../config/api';
import { VideoPlayer } from '../components/VideoPlayer';

export function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieData, videosData] = await Promise.all([
          getMovieDetails(id!),
          getVideos(id!, 'movie')
        ]);
        setMovie(movieData);
        setVideos(videosData);
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!movie) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/movies" className="inline-flex items-center text-red-600 hover:text-purple-400 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Movies
      </Link>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="relative h-96">
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
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
          {videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Videos & Trailers</h2>
              <VideoPlayer videos={videos} />
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
                    <img
                      src={getImageUrl(actor.profile_path)}
                      alt={actor.name}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <p className="font-semibold">{actor.name}</p>
                    <p className="text-sm text-gray-400">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.watchProviders && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Where to Watch</h2>
              <div className="space-y-4">
                {movie.watchProviders.flatrate && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Stream</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.watchProviders.flatrate.map((provider: any) => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-10 h-10 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.watchProviders.rent && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Rent</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.watchProviders.rent.map((provider: any) => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-10 h-10 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.watchProviders.buy && (
                  <div>
                    <h3 className="text-sm text-gray-400 mb-2">Buy</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.watchProviders.buy.map((provider: any) => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={provider.provider_name}
                          className="w-10 h-10 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 