import ClientLayout from '@/components/ClientLayout'
import type { Metadata } from 'next'
import "./globals.css"
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Flixr',
  description: 'Discover movies and TV shows',
  other: {
    'google-adsense-account': 'ca-pub-3407380400679075'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}