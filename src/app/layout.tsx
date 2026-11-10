import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JASASAJA Starter',
  description: 'Fondasi proyek web JASASAJA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
