import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LevelUp AI | Your Learning OS',
  description: 'A gamified AI-powered learning dashboard. Track progress, earn XP, level up, and receive AI mentor feedback — every single day.',
  keywords: 'AI learning, gamified education, XP system, skill tracking, learning dashboard',
  openGraph: {
    title: 'LevelUp AI | Your Learning OS',
    description: 'Gamified AI-powered learning dashboard',
    type: 'website',
  },
};

import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-bg text-text-primary antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}


