import ClientLayout from '@/components/ClientLayout'
import type { Metadata } from 'next'
import "./globals.css"
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Flixr',
  description: 'Discover movies and TV shows'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3407380400679075"
        crossOrigin="anonymous">
      </Script>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}