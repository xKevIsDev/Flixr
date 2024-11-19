import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BotMessageSquare } from 'lucide-react';
import { getSmartRecommendations } from '@/services/api';
import Image from 'next/image';
import { getImageUrl } from '@/config/api';
import { RecommendationCard } from './RecommendationCard';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendations?: any[];
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful movie and TV show recommendation assistant. Help users find content based on their interests, mood, or preferences.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processAIResponse = async (response: string) => {
    console.log('Raw AI response:', response);
    const parts = response.split('---');
    const explanation = parts[0].trim();
    const keywordString = parts[1]?.trim();
    
    try {
      // Extract movie/show titles from the explanation
      const titleRegex = /"([^"]+)"/g;
      const titles = [...explanation.matchAll(titleRegex)].map(match => match[1]);
      console.log('Extracted titles:', titles);
  
      // Extract keywords
      const keywords = keywordString
        ? keywordString.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];
  
      console.log('Keywords for search:', keywords);
  
      // Try to get recommendations for each mentioned title first
      let recommendations = [];
      
      for (const title of titles) {
        const titleRecs = await getSmartRecommendations({
          keywords: [title], // Search by exact title
          type: 'all',      // Don't restrict media type initially
          minRating: 6.0
        });
        
        if (titleRecs.length > 0) {
          recommendations.push(...titleRecs);
        }
      }
  
      // If no recommendations found by titles, try keywords
      if (recommendations.length === 0) {
        console.log('No recommendations found by titles, trying keywords...');
        
        // Try with individual keywords
        for (const keyword of keywords.slice(0, 3)) { // Use first 3 keywords
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
  
      // Remove duplicates and limit to 5 recommendations
      recommendations = [...new Map(recommendations.map(item => [item.id, item])).values()];
      recommendations = recommendations.slice(0, 5);
  
      console.log('Final recommendations:', recommendations);
  
      return {
        explanation,
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return explanation;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
  
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
  
      if (!response.ok || !response.body) {
        throw new Error('Stream error');
      }
  
      // Create a new assistant message for streaming
      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages(prev => [...prev, assistantMessage]);
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
  
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: fullResponse }
          ];
        });
      }
  
      // Process the complete response
      const processedResponse = await processAIResponse(fullResponse);
      
      if (typeof processedResponse === 'string') {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: processedResponse }
        ]);
      } else {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { 
            role: 'assistant', 
            content: processedResponse.explanation,
            recommendations: processedResponse.recommendations 
          }
        ]);
      }
  
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 z-20">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="font-semibold flex items-center"><BotMessageSquare className="h-5 w-5 mr-2 text-red-600" /> Flixr AI</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.slice(1).map((message, i) => (
              <div key={i} className="space-y-3">
                <div className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-red-600'
                      : 'bg-zinc-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
                
                {message.recommendations && (
                  <div className="space-y-2">
                    {message.recommendations.map((item) => (
                      <RecommendationCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for recommendations..."
                className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}