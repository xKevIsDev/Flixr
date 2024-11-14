import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  Tv2, Search, BookMarked, User, Menu, X,
  Film, TrendingUp, Clock, Award, Heart,
  ChevronDown
} from 'lucide-react';
import { fetchGenres } from '../services/api';
import { SearchBar } from './SearchBar';

// Separate genre IDs for movies and TV shows
const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const tvGenres = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' }
];

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv'>('tv');

  // Choose genre list based on selected media type
  const genres = selectedMediaType === 'movie' ? movieGenres : tvGenres;

  // Add useEffect to fetch and verify genres on component mount
  useEffect(() => {
    const verifyGenres = async () => {
      try {
        const tvGenreList = await fetchGenres('tv');
        console.log('Fetched TV Genres:', tvGenreList);
      } catch (error) {
        console.error('Error verifying genres:', error);
      }
    };

    verifyGenres();
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-zinc-900 border-b border-gray-800 z-50">
        <div className="max-w-full px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-zinc-900 md:hidden"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center ml-2">
                <span className="mr-4 text-3xl font-bold">Fl<span className="text-red-600">i</span>xr</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-full max-w-md hidden sm:block">
                <SearchBar />
              </div>
            </div>
          </div>
          {/* Mobile Search Bar */}
          <div className="pb-3 px-2 sm:hidden">
            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-zinc-900 border-r border-gray-800 
          transition-all duration-300 z-40 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          w-64 md:w-64`}
      >
        <div className="overflow-y-auto h-full">
          <div className="p-4 space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full text-sm font-semibold text-gray-400 uppercase">
                <span>Categories</span>
              </div>
              {showCategories && (
                <div className="space-y-1">
                  {genres.map(genre => (
                    <NavLink
                      key={genre.id}
                      to={`/category/${genre.id}?type=${selectedMediaType}`}
                      className={({ isActive }) =>
                        `block p-2 rounded-lg transition-colors ${
                          isActive ? 'bg-red-600' : 'hover:bg-white hover:text-red-600'
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      {genre.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main 
        className={`pt-16 min-h-screen transition-all duration-300
          ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} 
          ${isSidebarOpen ? 'sm:ml-0 md:ml-64' : 'ml-0'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}