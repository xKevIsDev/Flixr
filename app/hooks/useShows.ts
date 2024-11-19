import { useState, useEffect } from 'react';
import { getTVShows, discoverTVShows, getWatchProviders } from '../services/api';

export function useShows(type: 'tv' | 'movie' = 'tv', filter: string = 'all', page: number = 1) {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        let data;
        
        if (filter === 'all') {
          data = await discoverTVShows(page);
        } else {
          data = await getTVShows(filter, page);
        }
        
        const showsWithProviders = await Promise.all(
          data.results.map(async (show: any) => {
            const providers = await getWatchProviders(show.id.toString(), 'tv');
            return {
              ...show,
              watchProviders: providers
            };
          })
        );
        
        if (page === 1) {
          setShows(showsWithProviders);
        } else {
          setShows(prev => [...prev, ...showsWithProviders]);
        }
        
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError('Failed to fetch shows');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [type, filter, page]);

  return { shows, loading, error, hasMore };
}