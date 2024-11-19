import Together from "together-ai";

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
When recommending content, ALWAYS follow this format:

1. First, provide a brief explanation of your recommendations
2. Then, add "---" on a new line
3. Finally, list relevant keywords separated by commas

Example response:
If you enjoy psychological thrillers with mind-bending plots, I recommend watching "Inception" (2010). It's a masterpiece of sci-fi cinema that explores dreams and reality. For a TV series, "Dark" offers a complex narrative about time travel and human nature.
---
psychological, thriller, sci-fi, mind-bending, complex, dreams, time-travel

Remember: Always include the "---" separator and keywords!`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    const augmentedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];
    
    const stream = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      messages: augmentedMessages,
      temperature: 0.7,
      stream: true,
      max_tokens: 800
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const streamChunk = chunk as StreamResponse;
            const content = streamChunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(content);
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
      cancel() {
        console.log('Stream cancelled');
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}