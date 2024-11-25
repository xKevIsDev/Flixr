import ClientLayout from '@/components/ClientLayout'
import type { Metadata } from 'next'
import "./globals.css"
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Flixr',
  description: 'Discover and track your favorite movies and TV shows. Get personalized recommendations, watch trailers, and find where to stream content.',
  keywords: ['movies', 'TV shows', 'streaming', 'entertainment', 'film', 'series', 'watch', 'recommendations'],
  authors: [{ name: 'Flixr' }],
  creator: 'Flixr',
  publisher: 'Flixr',
  metadataBase: new URL('https://flixr-beta.vercel.app'), // Replace with your actual domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flixr-beta.vercel.app',
    siteName: 'Flixr',
    title: 'Flixr - Your Ultimate Entertainment Guide',
    description: 'Discover and track your favorite movies and TV shows. Get personalized recommendations, watch trailers, and find where to stream content.',
    images: [
      {
        url: '/screenshot.png', // Add your OG image to the public folder
        width: 1200,
        height: 630,
        alt: 'Flixr - Movie and TV Show Discovery Platform',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flixr - Your Ultimate Entertainment Guide',
    description: 'Discover and track your favorite movies and TV shows. Get personalized recommendations, watch trailers, and find where to stream content.',
    images: ['/screenshot.png'], // Add your Twitter image to the public folder
    creator: '@KevIsDev', // Optional: Add if you have a Twitter account
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'google-adsense-account': 'ca-pub-3407380400679075',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-zinc-800">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}