import { useState, useEffect } from 'react';
import { getMovies, discoverMovies, getWatchProviders } from '../services/api';

export function useMovies(filter: string = 'all', page: number = 1) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let data;
        
        if (filter === 'all') {
          data = await discoverMovies(page);
        } else {
          data = await getMovies(filter, page);
        }

        // Fetch watch providers for each movie
        const moviesWithProviders = await Promise.all(
          data.results.map(async (movie: any) => {
            const providers = await getWatchProviders(movie.id.toString(), 'movie');
            return {
              ...movie,
              watchProviders: providers
            };
          })
        );
        
        if (page === 1) {
          setMovies(moviesWithProviders);
        } else {
          setMovies(prev => [...prev, ...moviesWithProviders]);
        }
        
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filter, page]);

  return { movies, loading, error, hasMore };
} 