import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agri-Tech Plant Manager',
  description: 'Plant management dashboard migrated to Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
