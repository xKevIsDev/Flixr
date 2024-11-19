import { useState, useEffect } from 'react';
import { getTrendingMovies, getMovies } from '../services/api';

export function useMovies(filter: string = 'popular', page: number = 1) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let data;
        
        if (filter === 'trending') {
          data = await getTrendingMovies();
        } else {
          data = await getMovies(filter, page);
        }
        
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }
        
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filter, page]);

  return { movies, loading, error, hasMore };
} 