import Together from "together-ai";
import { getSmartRecommendations } from '@/services/api';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY ?? "",
});

interface StreamChoice {
  delta?: {
    content?: string;
  };
  text?: string;
  index: number;
  finish_reason: string | null;
}

interface StreamResponse {
  id: string;
  choices: StreamChoice[];
  created: number;
  model: string;
}

const SYSTEM_PROMPT = `You are a helpful movie and TV show recommendation assistant. 
You MUST respond in this EXACT format, with no deviations:

EXPLANATION
[Your explanation text here]

---RECOMMENDATIONS---
1. TITLE: [Movie/Show Title]
   TYPE: [Movie/TV Show]
   YEAR: [Year]
   REASON: [Brief reason for recommendation]

---KEYWORDS---
[keyword1, keyword2, keyword3, etc.]

IMPORTANT RULES:
- Always include exactly these three sections with the exact headers
- Always use line breaks between sections
- Always number recommendations starting from 1
- Always include TYPE, YEAR, and REASON for each recommendation
- Never deviate from this format

Example response:
EXPLANATION
Based on your interest in science fiction and mind-bending narratives, here are some recommendations.

---RECOMMENDATIONS---
1. TITLE: Inception
   TYPE: Movie
   YEAR: 2010
   REASON: A masterpiece of sci-fi cinema exploring dreams and reality

---KEYWORDS---
psychological, thriller, sci-fi, mind-bending, complex, dreams`

async function processAIResponse(response: string) {
  try {
    // Clean up the response
    const cleanResponse = response.trim();
    
    // Split into main sections
    const sections = cleanResponse.split(/---([A-Z]+)---/).filter(Boolean);
    
    // Extract explanation
    const explanation = sections[0].replace('EXPLANATION', '').trim();
    
    // Find recommendations section
    const recommendationsIndex = sections.findIndex(s => s === 'RECOMMENDATIONS');
    const recommendationsText = recommendationsIndex !== -1 ? sections[recommendationsIndex + 1] : '';
    
    // Parse recommendations
    const recommendations = [];
    if (recommendationsText) {
      const recItems = recommendationsText
        .split(/\d+\.\s+/)
        .filter(item => item.trim().length > 0);

      for (const item of recItems) {
        const titleMatch = item.match(/TITLE:\s*([^\n]+)/);
        const typeMatch = item.match(/TYPE:\s*([^\n]+)/);
        const yearMatch = item.match(/YEAR:\s*([^\n]+)/);
        const reasonMatch = item.match(/REASON:\s*([^\n]+)/);

        if (titleMatch) {
          const title = titleMatch[1].trim();
          const type = typeMatch?.[1].trim().toLowerCase();
          const reason = reasonMatch?.[1].trim();

          const searchResults = await getSmartRecommendations({
            keywords: [title],
            type: type === 'movie' ? 'movie' : 'tv',
            minRating: 6.0
          });

          if (searchResults.length > 0) {
            const result = searchResults[0];
            recommendations.push({
              id: result.id.toString(),
              title: result.title || result.name,
              name: result.name,
              posterPath: result.poster_path,
              media_type: result.media_type || type,
              overview: result.overview,
              details: {
                rating: result.vote_average || result.details?.rating || 0,
                runtime: result.runtime || result.details?.runtime || 0
              },
              watchProviders: result.watchProviders,
              aiReason: reason
            });
          }
        }
      }
    }

    // Find keywords section
    const keywordsIndex = sections.findIndex(s => s === 'KEYWORDS');
    const keywordsText = keywordsIndex !== -1 ? sections[keywordsIndex + 1] : '';
    
    // Parse keywords
    const keywords = keywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    // Fallback to keyword search if no direct matches
    if (recommendations.length === 0 && keywords.length > 0) {
      for (const keyword of keywords.slice(0, 3)) {
        const keywordRecs = await getSmartRecommendations({
          keywords: [keyword],
          type: 'all',
          minRating: 6.0
        });
        
        if (keywordRecs.length > 0) {
          recommendations.push(...keywordRecs);
        }
      }
    }

    // Deduplicate and limit recommendations
    const uniqueRecs = [...new Map(recommendations.map(item => [item.id, item])).values()];
    const finalRecs = uniqueRecs.slice(0, 5);

    return {
      explanation,
      recommendations: finalRecs.length > 0 ? finalRecs : undefined
    };
  } catch (error) {
    console.error('Error processing AI response:', error);
    return {
      explanation: response,
      recommendations: undefined
    };
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    const augmentedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];
    
    // Get the complete AI response first
    const completion = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      messages: augmentedMessages,
      temperature: 0.7,
      stream: false,
      max_tokens: 800
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    
    // Process the response
    const processedResponse = await processAIResponse(aiResponse);

    // Create a stream of the processed response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Stream the processed response as JSON
          const jsonResponse = JSON.stringify(processedResponse);
          controller.enqueue(encoder.encode(jsonResponse));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}