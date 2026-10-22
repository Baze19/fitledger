'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { FrontDeskView } from '@/components/FrontDeskView';
import { MemberPwaView } from '@/components/MemberPwaView';
import { OwnerHubView } from '@/components/OwnerHubView';

export default function Home() {
  const [activeView, setActiveView] = useState<'terminal' | 'member' | 'owner'>('terminal');

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeView === 'terminal' && <FrontDeskView />}
        {activeView === 'member' && <MemberPwaView />}
        {activeView === 'owner' && <OwnerHubView />}
      </main>

      <footer className="border-t border-zinc-900 py-4 px-6 text-center text-xs text-zinc-500">
        FitLedger OS • Commercial Gym Operating System • Multi-Tenant Architecture • Lagos, Nigeria
      </footer>
    </div>
  );
}
