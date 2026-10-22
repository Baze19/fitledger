import type { Metadata } from 'next';
import './globals.css';
import { GymProvider } from '@/context/gym-context';

export const metadata: Metadata = {
  title: 'FitLedger OS — Gym Operating System & Anti-Theft Engine',
  description: 'Next-generation gym management system built for commercial fitness centers in Lagos & Africa. Sub-2s check-ins, i-Fitness PWA experience, and WhatsApp AI auditor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500 selection:text-white">
        <GymProvider>
          {children}
        </GymProvider>
      </body>
    </html>
  );
}
