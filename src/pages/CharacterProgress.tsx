import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getCharacterProgress } from '../services/api';
import { getImageUrl } from '../config/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function CharacterProgress() {
  const { id, characterId } = useParams();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!id || !characterId) {
        setError('Invalid show or character ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCharacterProgress(id, characterId, 1); // Start with season 1
        setProgress(data);
      } catch (err) {
        console.error('Error fetching character progress:', err);
        setError('Failed to fetch character progress. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [id, characterId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!progress) return <div className="text-center p-8">No character data found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={`/show/${id}`} className="inline-flex items-center text-red-600 hover:text-purple-400 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Show
      </Link>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="relative h-64">
          <img
            src={getImageUrl(progress.image) || undefined}
            alt={progress.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold mb-2">{progress.character}</h1>
            <p className="text-gray-300">Played by {progress.actor}</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Season {progress.currentSeason} Progress</h2>
          {progress.seasonDetails && (
            <div className="space-y-4">
              {progress.seasonDetails.episodes?.map((episode: any) => (
                <div key={episode.id} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold">Episode {episode.episode_number}: {episode.name}</h3>
                  <p className="text-gray-300 text-sm mt-2">{episode.overview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}