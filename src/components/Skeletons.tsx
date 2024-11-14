import React from 'react';

export function ShowCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-64 bg-zinc-800" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-zinc-800 rounded w-20" />
            <div className="h-4 bg-zinc-800 rounded w-16" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1">
              <div className="h-3 bg-zinc-800 rounded w-12" />
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-zinc-800" />
                <div className="w-5 h-5 rounded-full bg-zinc-800" />
                <div className="w-5 h-5 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShowDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative h-96 bg-zinc-800 rounded-t-xl" />
      <div className="bg-zinc-900 p-6 rounded-b-xl space-y-8">
        <div>
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-zinc-800 rounded w-4/6" />
          </div>
        </div>
        <div>
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-40 bg-zinc-800 rounded" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharacterListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden">
          <div className="aspect-[2/3] bg-zinc-800" />
        </div>
      ))}
    </div>
  );
} 