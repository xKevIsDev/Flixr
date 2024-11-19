import { NextResponse } from 'next/server';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/config/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
  const data = await response.json();

  return NextResponse.json(data);
} 