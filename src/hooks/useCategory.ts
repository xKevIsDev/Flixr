import { useState, useEffect } from 'react';
import { getCategoryItems, getGenreName } from '../services/api';

export function useCategory(categoryId: number, mediaType: 'movie' | 'tv', page: number) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  // Reset items when media type changes
  useEffect(() => {
    setItems([]);
  }, [mediaType]);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching category:', { categoryId, mediaType, page });
        
        const data = await getCategoryItems(categoryId, mediaType, page);
        
        if (isMounted) {
          if (page === 1) {
            setItems(data.results || []);
          } else {
            setItems(prev => [...prev, ...(data.results || [])]);
          }
          setHasMore(data.page < data.total_pages);
          setCategoryName(getGenreName(categoryId, mediaType));
        }
      } catch (err) {
        console.error('Error in useCategory:', err);
        if (isMounted) {
          setError('Failed to fetch items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [categoryId, mediaType, page]);

  return { items, loading, error, hasMore, categoryName };
}