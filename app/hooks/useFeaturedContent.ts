import { useState, useEffect } from 'react';
import { 
  getTrendingMovies, 
  getTrendingShows, 
  getVideos, 
  getWatchProviders 
} from '@/services/api';

interface FeaturedItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  videos?: any[];
  watchProviders?: any;
}

export function useFeaturedContent() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        
        // Fetch trending content
        const [moviesData, showsData] = await Promise.all([
          getTrendingMovies(),
          getTrendingShows()
        ]);

        // Combine and prepare items
        const movies = moviesData.results.map((item: any) => ({
          ...item,
          media_type: 'movie'
        }));
        
        const shows = showsData.results.map((item: any) => ({
          ...item,
          media_type: 'tv'
        }));

        const combined = [...movies, ...shows]
          .filter(item => 
            item.backdrop_path && 
            item.overview && 
            item.vote_average >= 7 // Only featured highly-rated content
          )
          .sort(() => Math.random() - 0.5) // Randomize
          .slice(0, 5); // Take top 5

        // Fetch additional data for each item
        const enrichedItems = await Promise.all(
          combined.map(async (item) => {
            try {
              const mediaType = item.title ? 'movie' : 'tv';
              
              const [videos, watchProviders] = await Promise.all([
                getVideos(item.id.toString(), mediaType),
                getWatchProviders(item.id.toString(), mediaType)
              ]);

              return {
                ...item,
                videos,
                watchProviders,
                media_type: mediaType
              };
            } catch (err) {
              console.error(`Error fetching additional data for ${item.id}:`, err);
              return item;
            }
          })
        );

        setFeatured(enrichedItems);
      } catch (err) {
        setError('Failed to fetch featured content');
        console.error('Error in useFeaturedContent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { featured, loading, error };
} 