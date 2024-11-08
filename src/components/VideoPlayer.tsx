import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface VideoPlayerProps {
  videos: Video[];
}

export function VideoPlayer({ videos }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  if (!videos || videos.length === 0) return null;

  const handlePlay = (video: Video) => {
    setActiveVideo(video);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveVideo(null);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {videos.slice(0, 3).map((video) => (
          <button
            key={video.id}
            onClick={() => handlePlay(video)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-purple-600 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            {video.type === 'Trailer' ? 'Watch Trailer' : video.type}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isOpen && activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=1`}
                title={activeVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 