'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X
} from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv'>('tv');
  const pathname = usePathname();

  const genres = selectedMediaType === 'movie' ? movieGenres : tvGenres;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOverlayClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      <nav className="fixed top-0 w-full bg-zinc-900 border-b border-zinc-800 z-50">
        <div className="max-w-full px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-zinc-900 md:hidden"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="flex items-center ml-2">
                <span className="mr-4 text-3xl font-bold">Fl<span className="text-red-600">i</span>xr</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-full max-w-md hidden sm:block">
                <SearchBar />
              </div>
            </div>
          </div>
          <div className="pb-3 px-2 sm:hidden">
            <SearchBar />
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-zinc-900 border-r border-zinc-800 
          transition-all duration-300 z-40 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          w-64 md:w-64`}
      >
        <div className="overflow-y-auto h-full">
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full text-sm font-semibold text-gray-400 uppercase">
                <span>Categories</span>
              </div>
              {showCategories && (
                <div className="space-y-1">
                  {genres.map(genre => (
                    <Link
                      key={genre.id}
                      href={`/category/${genre.id}?type=${selectedMediaType}`}
                      className={`block p-2 rounded-lg transition-colors ${
                        pathname === `/category/${genre.id}` ? 'bg-red-600' : 'hover:bg-white hover:text-red-600'
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main 
        className={`pt-16 min-h-screen transition-all duration-300
          ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} 
          ${isSidebarOpen ? 'sm:ml-0 md:ml-64' : 'ml-0'}
        `}
      >
        {children}
      </main>
    </div>
  );
}