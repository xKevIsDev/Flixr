'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../config/api';

interface Character {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface CharacterListProps {
  showId: string;
  characters: Character[];
  currentSeason: number;
}

export function CharacterList({ showId, characters, currentSeason }: CharacterListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {characters.map((character) => (
        <Link
          key={character.id}
          href={`/show/${showId}/character/${character.id}`}
          className="bg-zinc-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all"
        >
          <div className="aspect-[2/3] relative">
            <Image
              src={getImageUrl(character.profile_path) || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/800px-No-Image-Placeholder.svg.png'}
              alt={character.name}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-semibold text-sm">{character.name}</h3>
              <p className="text-sm text-gray-300">{character.character}</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-red-600 rounded-full text-xs">
                  View Progress up to S{currentSeason}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}