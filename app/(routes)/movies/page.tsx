'use client';

import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import MoviesContent from './MoviesContent';

export default function MoviesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MoviesContent />
    </Suspense>
  );
} 