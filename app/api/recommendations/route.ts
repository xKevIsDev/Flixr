import { NextResponse } from 'next/server';
import { getSmartRecommendations } from '@/services/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const recommendations = await getSmartRecommendations({
      keywords: body.keywords,
      type: body.type,
      minRating: body.minRating
    });
    
    return NextResponse.json(recommendations);
    
  } catch (error: any) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
} 