import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider';


export const metadata: Metadata = {
  title: 'Earth Intelligence - Remote Sensing Intelligence',
  description: 'Real-time satellite data. Advanced Earth insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
