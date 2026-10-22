'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { StaffPinModal } from '@/components/StaffPinModal';
import { ShiftCloseModal } from '@/components/ShiftCloseModal';
import { Dumbbell, UserCheck, Lock, Smartphone, LayoutDashboard, Terminal } from 'lucide-react';

interface NavbarProps {
  activeView: 'terminal' | 'member' | 'owner';
  setActiveView: (view: 'terminal' | 'member' | 'owner') => void;
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
  const { activeStaff } = useGym();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo & Branch */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">FitLedger</h1>
                <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  OS 2026
                </span>
              </div>
              <p className="text-xs text-zinc-400">Ikorodu Commercial Branch • Active Sync</p>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <nav className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveView('terminal')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeView === 'terminal'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>1. Front Desk</span>
            </button>

            <button
              onClick={() => setActiveView('member')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeView === 'member'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>2. Member PWA</span>
            </button>

            <button
              onClick={() => setActiveView('owner')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeView === 'owner'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>3. Owner Hub & AI</span>
            </button>
          </nav>

          {/* Staff Shift / PIN Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition text-left"
              title="Click to Switch Staff PIN"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">
                {activeStaff.fullName.split(' ')[0][0]}
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">{activeStaff.fullName}</p>
                <p className="text-[9px] text-zinc-400 font-mono">PIN: {activeStaff.pin} (Switch)</p>
              </div>
            </button>

            <button
              onClick={() => setIsShiftModalOpen(true)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-amber-400 transition"
              title="Shift Handover & Cash Lock"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Modals */}
      <StaffPinModal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} />
      <ShiftCloseModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </>
  );
}
