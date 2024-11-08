import { useState, useEffect } from 'react';
import { getTopRatedShows, getTopRatedMovies } from '../services/api';

export function useTopRated(type: 'tv' | 'movie' = 'tv') {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = type === 'tv' 
          ? await getTopRatedShows()
          : await getTopRatedMovies();
        setShows(data.results);
      } catch (err) {
        setError('Failed to fetch top rated');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [type]);

  return { shows, loading, error };
}