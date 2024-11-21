'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, BotMessageSquare, Loader2, User } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/config/api'
import { RecommendationCard } from './RecommendationCard'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  recommendations?: any[]
  isLoadingRecommendations?: boolean
  status?: 'processing' | 'complete' | 'error'
}

interface ProcessedResponse {
  recommendations?: any[]
  status?: 'processing' | 'complete' | 'error'
}

async function processAIResponse(response: string): Promise<ProcessedResponse> {
  try {
    const cleanResponse = response.trim()
    const sections = cleanResponse.split(/---([A-Z]+)---/).filter(Boolean)
    
    const recommendationsIndex = sections.findIndex(s => s === 'RECOMMENDATIONS')
    const recommendationsText = recommendationsIndex !== -1 ? sections[recommendationsIndex + 1] : ''
    
    const recommendations = []
    if (recommendationsText) {
      const recItems = recommendationsText
        .split(/\d+\.\s+/)
        .filter(item => item.trim().length > 0)

      for (const item of recItems) {
        const titleMatch = item.match(/TITLE:\s*([^\n]+)/)
        const typeMatch = item.match(/TYPE:\s*([^\n]+)/)
        const yearMatch = item.match(/YEAR:\s*([^\n]+)/)
        const reasonMatch = item.match(/REASON:\s*([^\n]+)/)

        if (titleMatch) {
          try {
            const title = titleMatch[1].trim()
            const type = typeMatch?.[1].trim().toLowerCase()
            const reason = reasonMatch?.[1].trim()

            const response = await fetch('/api/recommendations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                keywords: [title],
                type: type === 'movie' ? 'movie' : 'tv',
                minRating: 6.0
              })
            })

            if (!response.ok) {
              throw new Error(`Recommendations API error: ${response.statusText}`)
            }

            const searchResults = await response.json()

            if (searchResults && searchResults.length > 0) {
              const result = searchResults[0]
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
              })
            }
          } catch (error) {
            console.error('Error processing recommendation:', error)
            continue
          }
        }
      }
    }

    return {
      recommendations: recommendations.length > 0 ? recommendations : undefined,
      status: 'complete'
    }
  } catch (error) {
    console.error('Error processing AI response:', error)
    return {
      recommendations: undefined,
      status: 'error'
    }
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful movie and TV show recommendation assistant. Help users find content based on their interests, mood, or preferences.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
  
    const userMessage: Message = { 
      role: 'user', 
      content: input 
    }
    
    const assistantMessage: Message = { 
      role: 'assistant',
      content: '',
      isLoadingRecommendations: true,
      status: 'processing'
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
    setLoading(true)
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            messages[0],
            ...messages.slice(1),
            userMessage
          ]
        })
      })
  
      if (!response.ok || !response.body) {
        throw new Error('Stream error')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            
            if (data.type === 'complete') {
              const processedResponse = await processAIResponse(data.content)
              setMessages(prev => [
                ...prev.slice(0, -1),
                { 
                  role: 'assistant',
                  content: '',
                  recommendations: processedResponse.recommendations,
                  isLoadingRecommendations: false,
                  status: 'complete'
                } as Message
              ])
            }
          } catch (e) {
            continue
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          status: 'error'
        } as Message
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderMessage = (message: Message, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {(message.role === 'user' || message.content) && (
        <div className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[85%] rounded-lg p-3 flex items-start space-x-3 ${
            message.role === 'user' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white'
          }`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <BotMessageSquare className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      )}
      
      {message.isLoadingRecommendations && (
        <div className="space-y-2">
          <div className="grid gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-zinc-800 rounded-lg p-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-20 h-28 bg-zinc-700 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-700 rounded w-3/4" />
                    <div className="h-3 bg-zinc-700 rounded w-1/4" />
                    <div className="h-3 bg-zinc-700 rounded w-full" />
                    <div className="h-3 bg-zinc-700 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {message.recommendations && (
        <div className="grid gap-3 ">
          {message.recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'fixed'} bottom-4 right-4 md:bottom-6 md:right-6 bg-red-600 p-3 md:p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-2 md:inset-auto ${isOpen ? 'md:bottom-6' : 'md:bottom-24'} md:right-6 
                        w-auto md:w-96 bg-zinc-900 
                        rounded-xl shadow-xl border border-zinc-800 
                        flex flex-col z-50
                        md:h-[600px]`}
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h3 className="font-semibold flex items-center text-lg text-white">
                  <BotMessageSquare className="h-5 w-5 mr-2 text-red-600" /> 
                  Flixr AI
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {messages.slice(1).map((message, i) => renderMessage(message, i))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for recommendations..."
                    className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 
                             text-white placeholder-zinc-500
                             focus:outline-none focus:ring-2 focus:ring-red-600
                             text-sm md:text-base"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 p-2 rounded-lg hover:bg-red-700 
                             transition-colors disabled:opacity-50
                             flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Send className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}