export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Replace with your API key
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string, size: string = 'w500') => 
  path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;