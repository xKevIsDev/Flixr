import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BotMessageSquare } from 'lucide-react';
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
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
  
      // Create placeholder message
      setMessages(prev => [...prev, { 
        role: 'assistant',
        content: '',
        recommendations: []
      }]);
  
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Parse the complete buffer if anything remains
          if (buffer) {
            try {
              const finalResponse = JSON.parse(buffer);
              setMessages(prev => [
                ...prev.slice(0, -1),
                { 
                  role: 'assistant',
                  content: finalResponse.explanation,
                  recommendations: finalResponse.recommendations
                }
              ]);
            } catch (e) {
              console.error('Error parsing final buffer:', e);
            }
          }
          break;
        }
  
        // Append new chunk to buffer
        buffer += decoder.decode(value, { stream: true });
  
        // Try to parse complete JSON objects from buffer
        try {
          const parsedResponse = JSON.parse(buffer);
          setMessages(prev => [
            ...prev.slice(0, -1),
            { 
              role: 'assistant',
              content: parsedResponse.explanation,
              recommendations: parsedResponse.recommendations
            }
          ]);
          buffer = ''; // Clear buffer after successful parse
        } catch (e) {
          // Incomplete JSON, continue buffering
          continue;
        }
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
      {/* Chat Button - Adjust size and position for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-red-600 p-3 md:p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
      >
        <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Window - Update height classes */}
          <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 
                        w-full md:w-96 bg-zinc-900 
                        md:rounded-xl shadow-xl border border-zinc-800 
                        flex flex-col z-50
                        md:h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-semibold flex items-center">
                <BotMessageSquare className="h-5 w-5 mr-2 text-red-600" /> 
                Flixr AI
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Container - Update scrolling classes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {messages.slice(1).map((message, i) => (
                <div key={i} className="space-y-4">
                  <div className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-red-600'
                        : 'bg-zinc-800'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                  
                  {message.recommendations && (
                    <div className="grid gap-3">
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

            {/* Input Form - Stick to bottom */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for recommendations..."
                  className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 
                           focus:outline-none focus:ring-2 focus:ring-red-600
                           text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 p-2 rounded-lg hover:bg-red-700 
                           transition-colors disabled:opacity-50
                           flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}