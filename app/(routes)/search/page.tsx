'use client';

import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
} 