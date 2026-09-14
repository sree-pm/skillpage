import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary, ToastProvider } from '@skillpage/ui';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillPage — Your skills deserve more than a marketplace profile',
  description: 'Build your SkillPage. Find trusted work. Keep 100% of your price.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
