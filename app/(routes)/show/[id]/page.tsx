'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import { getShowDetails, getShowCredits, getVideos } from '@/services/api';
import { getImageUrl } from '@/config/api';
import { CharacterList } from '@/components/CharacterList';
import { VideoPlayer } from '@/components/VideoPlayer';
import { WatchProviders } from '@/components/WatchProviders';
import { ShowDetailsSkeleton } from '@/components/Skeletons';
import Image from 'next/image';
export default function ShowPage() {
  const params = useParams();
  const showId = params.id as string;
  
  const [show, setShow] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        
        const [showData, videosData] = await Promise.all([
          getShowDetails(showId),
          getVideos(showId, 'tv')
        ]);
        
        setShow(showData);
        setVideos(videosData);

        const showCredits = await getShowCredits(showId);
        setCredits(showCredits);

        if (showData.seasons?.length > 0) {
          setSelectedSeason(showData.seasons.length);
        }
      } catch (err) {
        console.error('Error fetching show data:', err);
        setError('Failed to fetch show details');
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchShowData();
    }
  }, [showId]);

  if (loading) return <ShowDetailsSkeleton />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!show) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-red-600 hover:text-white mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Shows
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 rounded-xl overflow-hidden">
            <div className="relative h-96">
              <Image
                src={getImageUrl(show.backdrop_path, 'original') || ''}
                alt={show.name}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="text-4xl font-bold mb-2">{show.name}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(show.first_air_date).getFullYear()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {show.episode_run_time?.[0] || '?'} min
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {show.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {videos && videos.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Videos & Trailers</h2>
                  <VideoPlayer videos={videos} />
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 mb-8">{show.overview}</p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Character Progress</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm text-gray-400">Select season to view character progress:</span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-gray-700 border border-zinc-600 rounded-lg px-3 py-1 text-sm"
                  >
                    {show.seasons.map((season: any) => (
                      <option key={season.season_number} value={season.season_number}>
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                </div>
                {credits ? (
                  <CharacterList
                    showId={showId}
                    characters={credits.cast}
                    currentSeason={selectedSeason}
                  />
                ) : (
                  <p className="text-gray-400">Character information is not available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Watch Providers Card */}
          {show.watchProviders && (
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Where to Watch</h2>
              <WatchProviders providers={show.watchProviders} />
            </div>
          )}

          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Show Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm">Created by</h3>
                <p>{show.created_by?.map((creator: any) => creator.name).join(', ') || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Genres</h3>
                <p>{show.genres?.map((genre: any) => genre.name).join(', ')}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Status</h3>
                <p>{show.status}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">Networks</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {show.networks?.map((network: any) => (
                    <Image
                      key={network.id}
                      src={getImageUrl(network.logo_path, 'w92') || ''}
                      alt={network.name}
                      width={1920}
                      height={1080}
                      className="h-8 object-contain bg-white rounded px-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Seasons</h2>
            <div className="space-y-4">
              {show.seasons?.map((season: any) => (
                <div key={season.id} className="flex gap-4">
                  <Image
                    src={getImageUrl(season.poster_path, 'w92') || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
                    alt={season.name || 'Season Poster'}
                    width={1920}
                    height={1080}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{season.name}</h3>
                    <p className="text-sm text-gray-400">
                      {season.episode_count} episodes • {season.air_date?.split('-')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}