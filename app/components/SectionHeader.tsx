'use client';

import Link from 'next/link';

export function SectionHeader({ title, viewAllLink }: { title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link
        href={viewAllLink}
        className="text-red-500 hover:text-red-400 transition-colors text-sm font-semibold"
      >
        View All →
      </Link>
    </div>
  );
}