import { useState, useEffect } from 'react';
import { getLatestShows, getLatestMovies } from '../services/api';

export function useLatest(type: 'tv' | 'movie' = 'tv') {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = type === 'tv' 
          ? await getLatestShows()
          : await getLatestMovies();
        setShows(data.results);
      } catch (err) {
        setError('Failed to fetch latest releases');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [type]);

  return { shows, loading, error };
}