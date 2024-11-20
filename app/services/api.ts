import { TMDB_API_KEY, TMDB_BASE_URL } from '../config/api';
import { movieGenres, tvGenres } from '../constants/genres';

// Helper function to fetch from TMDB with enhanced error handling
const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const apiKey = TMDB_API_KEY || '';
  
  // Create params object with correct types
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    ...params
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Show and Movie Trending Endpoints
export const getTrendingShows = () => fetchTMDB('/trending/tv/week');
export const getTrendingMovies = () => fetchTMDB('/trending/movie/week');

// Latest and Top-Rated Content
export const getLatestShows = () => fetchTMDB('/tv/on_the_air');
export const getLatestMovies = () => fetchTMDB('/movie/now_playing');
export const getTopRatedShows = () => fetchTMDB('/tv/top_rated');
export const getTopRatedMovies = () => fetchTMDB('/movie/top_rated');

// Show Details and Character Progress Tracking
export const getShowDetails = async (showId: string) => {
  try {
    const [details, credits, videos, watchProviders, externalIds] = await Promise.all([
      fetchTMDB(`/tv/${showId}`),
      fetchTMDB(`/tv/${showId}/credits`),
      fetchTMDB(`/tv/${showId}/videos`),
      fetchTMDB(`/tv/${showId}/watch/providers`),
      fetchTMDB(`/tv/${showId}/external_ids`)
    ]);

    return {
      ...details,
      credits,
      videos: videos.results,
      watchProviders: watchProviders.results?.US || null,
      external_ids: {
        netflix_id: externalIds.netflix_id,
        disney_id: externalIds.disney_id,
        prime_id: externalIds.prime_id,
        // Add other streaming service IDs
      }
    };
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
};

export const getCharacterProgress = async (showId: string, characterId: string, currentSeason: number) => {
  try {
    // First, get the show details to verify it exists
    const showDetails = await fetchTMDB(`/tv/${showId}`);
    
    // Get show credits
    const credits = await fetchTMDB(`/tv/${showId}/credits`);
    const character = credits.cast.find((c: any) => c.id.toString() === characterId);
    
    if (!character) {
      throw new Error('Character not found');
    }

    // Get the specific season details
    const seasonDetails = await fetchTMDB(`/tv/${showId}/season/${currentSeason}`);
    
    return {
      id: character.id,
      name: character.name,
      character: character.character,
      actor: character.name,
      image: character.profile_path,
      seasonDetails,
      currentSeason
    };
  } catch (error) {
    console.error('Error in getCharacterProgress:', error);
    throw error;
  }
};

// Show Category and Search
export const getCategoryShows = (categoryId: string) => 
  fetchTMDB('/discover/tv', { with_genres: categoryId });

export const searchShows = (query: string) => 
  fetchTMDB('/search/multi', { query });

export const getShowCredits = (showId: string) =>
  fetchTMDB(`/tv/${showId}/credits`);

// Add this to your existing API functions
export const getTVShows = async (filter: string = 'popular', page: number = 1) => {
  let endpoint = '/tv/popular'; // default endpoint

  // Map filter values to correct endpoints
  switch (filter) {
    case 'popular':
      endpoint = '/tv/popular';
      break;
    case 'top_rated':
      endpoint = '/tv/top_rated';
      break;
    case 'on_the_air':
      endpoint = '/tv/on_the_air';
      break;
    case 'airing_today':
      endpoint = '/tv/airing_today';
      break;
  }

  return fetchTMDB(endpoint, {
    page: page.toString()
  });
};

// Add these helper functions for discovering all TV shows
export const discoverTVShows = (page: number = 1) => 
  fetchTMDB('/discover/tv', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    'vote_count.gte': '100' // Add minimum vote count to get better quality results
  });

export const getAllTVShows = async (pageLimit: number = 5) => {
  try {
    // First, get the total number of pages
    const firstPage = await discoverTVShows(1);
    const totalPages = Math.min(firstPage.total_pages, pageLimit); // Limit the total pages to avoid too many requests

    // Fetch multiple pages in parallel
    const pagePromises = Array.from(
      { length: totalPages },
      (_, i) => discoverTVShows(i + 1)
    );

    const pages = await Promise.all(pagePromises);
    
    // Combine all results
    const allShows = pages.flatMap(page => page.results);

    return {
      results: allShows,
      total_results: allShows.length,
      total_pages: totalPages
    };
  } catch (error) {
    console.error('Error fetching all TV shows:', error);
    throw error;
  }
};

// Movie endpoints
export const getMovies = async (filter: string = 'popular', page: number = 1) => {
  let endpoint = '/movie/popular'; // default endpoint

  // Map filter values to correct endpoints
  switch (filter) {
    case 'popular':
      endpoint = '/movie/popular';
      break;
    case 'top_rated':
      endpoint = '/movie/top_rated';
      break;
    case 'now_playing':
      endpoint = '/movie/now_playing';
      break;
    case 'upcoming':
      endpoint = '/movie/upcoming';
      break;
  }

  return fetchTMDB(endpoint, {
    page: page.toString()
  });
};

export const discoverMovies = (page: number = 1) => 
  fetchTMDB('/discover/movie', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    'vote_count.gte': '100', // Add minimum vote count for better quality results
    include_adult: 'false',  // Filter out adult content
    with_original_language: 'en' // Optional: filter for English language movies
  });

// You can also add more specific movie endpoints as needed
export const getMovieDetails = async (movieId: string) => {
  try {
    const [details, credits, videos, watchProviders] = await Promise.all([
      fetchTMDB(`/movie/${movieId}`),
      fetchTMDB(`/movie/${movieId}/credits`),
      fetchTMDB(`/movie/${movieId}/videos`),
      fetchTMDB(`/movie/${movieId}/watch/providers`)
    ]);

    return {
      ...details,
      credits,
      videos: videos.results,
      watchProviders: watchProviders.results?.US || null
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieCredits = (movieId: string) => 
  fetchTMDB(`/movie/${movieId}/credits`);

export const getSimilarMovies = (movieId: string) => 
  fetchTMDB(`/movie/${movieId}/similar`);

export const getMovieRecommendations = (movieId: string) => 
  fetchTMDB(`/movie/${movieId}/recommendations`);

// Update the video endpoint to better handle both movies and TV shows
export const getVideos = async (id: string, mediaType: 'movie' | 'tv') => {
  try {
    // Add check for valid ID and mediaType
    if (!id || !mediaType) {
      console.warn('Missing id or mediaType in getVideos');
      return [];
    }

    const data = await fetchTMDB(`/${mediaType}/${id}/videos`);
  

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Filter for YouTube trailers and teasers
    const videos = data.results.filter((video: any) => 
      video.site.toLowerCase() === 'youtube' && 
      ['trailer', 'teaser'].includes(video.type.toLowerCase())
    );

    // Sort by newest first
    return videos.sort((a: any, b: any) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  } catch (error) {
    console.error(`Error fetching videos for ${mediaType} ${id}:`, error);
    return []; // Return empty array instead of throwing
  }
};

// Add or update these functions
export const getCategoryItems = async (categoryId: number, mediaType: 'movie' | 'tv', page: number = 1) => {
  try {

    // Handle the Action/Adventure case for movies
    let genreId = categoryId.toString();
    if (mediaType === 'movie' && categoryId === 10759) {
      // If it's the TV "Action & Adventure" ID, convert to movie "Action" ID
      genreId = '28';  // Use movie Action genre ID
    }

    if (mediaType === 'movie' && categoryId === 10768) {
      // If it's the TV "War & Politics" ID, convert to movie "War" ID
      genreId = '10752';  // Use movie War genre ID
    }

    if (mediaType === 'movie' && categoryId === 10765) {
      // If it's the TV "Sci-Fi & Fantasy" ID, convert to movie "Sci-Fi & Fantasy" ID
      genreId = '878';  // Use movie Sci-Fi & Fantasy genre ID
    }

    const baseParams: Record<string, string> = {
      include_adult: 'false',
      language: 'en-US',
      page: page.toString(),
      sort_by: 'popularity.desc',
      with_genres: genreId,  // Use the potentially converted ID
      'vote_count.gte': '50'
    };

    // Add media-specific parameters
    if (mediaType === 'tv') {
      Object.assign(baseParams, {
        include_null_first_air_dates: 'false'
      });
    } else {
      Object.assign(baseParams, {
        include_video: 'false'
      });
    }

    const data = await fetchTMDB(`/discover/${mediaType}`, baseParams);
    
    // Fetch watch providers for each item
    const itemsWithProviders = await Promise.all(
      data.results.map(async (item: any) => {
        const providers = await getWatchProviders(item.id.toString(), mediaType);
        return {
          ...item,
          watchProviders: providers
        };
      })
    );

    return {
      ...data,
      results: itemsWithProviders
    };
  } catch (error) {
    console.error('Error fetching category items:', error);
    throw error;
  }
};

// Helper function to get genre name
export const getGenreName = (categoryId: string | number, mediaType: 'movie' | 'tv'): string => {
  const genres = mediaType === 'movie' ? movieGenres : tvGenres;
  const genre = genres.find(g => g.id === Number(categoryId));
  return genre?.name || 'Category';
};

export const getGenres = async (mediaType: 'movie' | 'tv') => {
  const data = await fetchTMDB(`/genre/${mediaType}/list`);
  return data.genres;
};


// Add this function to fetch genre lists
export const fetchGenres = async (mediaType: 'movie' | 'tv') => {
  try {
    const data = await fetchTMDB(`/genre/${mediaType}/list`);
    return data.genres;
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error);
    throw error;
  }
};

// Add this function to get watch providers
export const getWatchProviders = async (id: string, mediaType: 'movie' | 'tv') => {
  try {
    const data = await fetchTMDB(`/${mediaType}/${id}/watch/providers`);
    return data.results?.US || null;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
};

// Add this search function to your API service
export const searchContent = async (query: string, mediaType: 'movie' | 'tv' = 'tv', page: number = 1) => {
  try {
    const data = await fetchTMDB(`/search/${mediaType}`, {
      query,
      page: page.toString(),
      include_adult: 'false',
      language: 'en-US'
    });

    // Fetch watch providers for each result
    const resultsWithProviders = await Promise.all(
      data.results.map(async (item: any) => {
        const providers = await getWatchProviders(item.id.toString(), mediaType);
        return {
          ...item,
          watchProviders: providers
        };
      })
    );

    return {
      ...data,
      results: resultsWithProviders
    };
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Update the search function to handle multiple media types
export const searchMultiContent = async (query: string, page: number = 1) => {
  try {
    // Use the /search/multi endpoint to search across all types
    const data = await fetchTMDB('/search/multi', {
      query,
      page: page.toString(),
      include_adult: 'false',
      language: 'en-US'
    });

    // Fetch watch providers for each result
    const resultsWithProviders = await Promise.all(
      data.results.map(async (item: any) => {
        // Only fetch providers for movies and TV shows
        if (item.media_type === 'movie' || item.media_type === 'tv') {
          const providers = await getWatchProviders(item.id.toString(), item.media_type);
          return {
            ...item,
            watchProviders: providers
          };
        }
        return item;
      })
    );

    return {
      ...data,
      results: resultsWithProviders
    };
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Add these functions to fetch watch providers

export async function getMovieWatchProviders(movieId: string) {
  const response = await fetchTMDB(`/movie/${movieId}/watch/providers`);
  const providers = response.results?.US || null;
  
  // Include the JustWatch link if available
  if (providers) {
    providers.link = response.results?.US?.link || null;
  }
  
  return providers;
}

export async function getShowWatchProviders(showId: string) {
  const response = await fetchTMDB(`/tv/${showId}/watch/providers`);
  const providers = response.results?.US || null;
  
  // Include the JustWatch link if available
  if (providers) {
    providers.link = response.results?.US?.link || null;
  }
  
  return providers;
}

interface TMDBSearchParams {
  keywords: string[];
  type?: 'movie' | 'tv' | 'all';
  year?: number | undefined;
  genres?: number[];
  minRating?: number;
}

// Add this interface for the search parameters
interface SmartSearchParams {
  keywords: string[];
  type?: 'movie' | 'tv' | 'all';
  year?: number;
  minRating?: number;
}

export const getSmartRecommendations = async ({ 
  keywords, 
  type = 'all', 
  year,
  minRating = 6.0 
}: SmartSearchParams) => {
  try {
    // Start with a search for each keyword
    const searchPromises = keywords.map(keyword => 
      fetchTMDB('/search/multi', {
        query: keyword,
        include_adult: 'false',
        language: 'en-US',
        year: year?.toString() || ''
      })
    );

    const searchResults = await Promise.all(searchPromises);
    
    // Combine and filter results
    let combinedResults = searchResults.flatMap(result => result.results || [])
      .filter(item => {
        // Filter by media type if specified
        if (type !== 'all' && item.media_type !== type) return false;
        
        // Filter by minimum rating
        const rating = item.vote_average || 0;
        if (rating < minRating) return false;
        
        // Filter by year if specified
        if (year) {
          const itemYear = new Date(
            item.release_date || item.first_air_date || ''
          ).getFullYear();
          if (itemYear !== year) return false;
        }
        
        return true;
      });

    // Remove duplicates
    combinedResults = [...new Map(
      combinedResults.map(item => [item.id, item])
    ).values()];

    // Enrich top 5 results with details and watch providers
    const enrichedResults = await Promise.all(
      combinedResults.slice(0, 5).map(async (item) => {
        try {
          const [details, watchProviders] = await Promise.all([
            item.media_type === 'movie' 
              ? getMovieDetails(item.id.toString())
              : getShowDetails(item.id.toString()),
            getWatchProviders(item.id.toString(), item.media_type)
          ]);

          return {
            ...item,
            ...details,
            watchProviders,
            details: {
              rating: details.vote_average || item.vote_average || 0,
              runtime: details.runtime || (details.episode_run_time?.[0] || 0)
            }
          };
        } catch (error) {
          console.error(`Error enriching item ${item.id}:`, error);
          return item;
        }
      })
    );

    return enrichedResults;
  } catch (error) {
    console.error('Error in getSmartRecommendations:', error);
    return [];
  }
};

// Debug function to help build our streamingUrls mapping
export async function getAllProviderDetails() {
  try {
    const response = await fetchTMDB('/watch/providers/movie');
    return response.results;
  } catch (error) {
    console.error('Error fetching provider details:', error);
    return [];
  }
}