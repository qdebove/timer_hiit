import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Timer HIIT - PWA',
  description: 'Chronomètres, comptes à rebours et sessions HIIT en PWA.',
  manifest: '/manifest.json',
  themeColor: '#0f172a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white antialiased dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        {children}
      </body>
    </html>
  );
}
