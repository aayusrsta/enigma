import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aayu Shrestha — Software Engineer',
  description: 'Software Engineer specialising in React, React Native and Next.js. Based in Kathmandu, Nepal.',
  openGraph: {
    title: 'Aayu Shrestha — Software Engineer',
    description: 'Software Engineer specialising in React, React Native and Next.js. Based in Kathmandu, Nepal.',
    url: 'https://aayu.com.np',
    siteName: 'Aayu Shrestha',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
