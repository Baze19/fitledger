'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { FrontDeskView } from '@/components/FrontDeskView';
import { ShiftCloseModal } from '@/components/ShiftCloseModal';
import { Lock, LogOut, Phone, Dumbbell, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function TerminalPage() {
  const { activeTenant, activeStaff, staffList, switchStaff, isFounderImpersonating } = useGym();
  
  // Terminal Lock Screen State
  const [isLocked, setIsLocked] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(activeStaff);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isShiftCloseOpen, setIsShiftCloseOpen] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      setPinError(false);

      if (newPin.length === 4) {
        const ok = switchStaff(selectedStaff.id, newPin);
        if (ok) {
          setIsLocked(false);
          setEnteredPin('');
        } else {
          setPinError(true);
          setTimeout(() => setEnteredPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(enteredPin.slice(0, -1));
    setPinError(false);
  };

  // Lock Out Barrier: If gym license is suspended or trial expired
  if (activeTenant.status === 'suspended' && !isFounderImpersonating) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-red-500/50 rounded-3xl p-7 text-center space-y-5 shadow-2xl animate-scaleIn">
          <div className="w-16 h-16 bg-red-600/20 text-red-500 border border-red-500/40 rounded-3xl mx-auto flex items-center justify-center text-3xl font-bold">
            🔒
          </div>
          <div className="space-y-2">
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
              Front-Desk Terminal Suspended
            </span>
            <h2 className="text-xl font-black text-white">{activeTenant.name}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Front-desk turnstile access, barcode scanner inputs, and cash drawer reconciliations are locked because this gym license is suspended or trial has ended.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/2348023456789?text=${encodeURIComponent(
                `Hello FitLedger Support! Counter terminal is locked for ${activeTenant.name}. Need license renewal.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Contact FitLedger Billing on WhatsApp</span>
            </a>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold text-xs transition block text-center cursor-pointer"
            >
              Sign Out / Switch Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If locked, render POS Counter Lock Screen
  if (isLocked) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -bottom-20 -right-20"></div>

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight">{activeTenant.name}</h2>
            <p className="text-xs text-zinc-400">Front-Desk Reception Terminal • Select Staff & Enter PIN</p>
          </div>

          {/* Staff Avatars */}
          <div className="grid grid-cols-3 gap-2">
            {staffList.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStaff(s);
                  setEnteredPin('');
                  setPinError(false);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                  selectedStaff.id === s.id
                    ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-200">
                  {s.fullName.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-xs font-bold truncate max-w-[90px]">{s.fullName.split(' ')[0]}</span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">{s.role}</span>
              </button>
            ))}
          </div>

          {/* PIN Indicator Dots */}
          <div className="flex justify-center gap-3 my-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  pinError
                    ? 'border-red-500 bg-red-500 animate-pulse'
                    : enteredPin.length > i
                    ? 'border-red-500 bg-red-500 scale-110'
                    : 'border-zinc-700 bg-zinc-950'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-center text-xs font-semibold text-red-400">
              Incorrect PIN for {selectedStaff.fullName}! Try again.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 text-lg font-bold">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                className="py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-white transition active:scale-95"
              >
                {digit}
              </button>
            ))}
            <div className="py-3.5"></div>
            <button
              onClick={() => handleKeyPress('0')}
              className="py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-white transition active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-zinc-400 hover:text-white transition active:scale-95 flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-zinc-500">
              Active PIN for {selectedStaff.fullName}: <strong className="font-mono text-zinc-300">{selectedStaff.pin}</strong>
            </span>
          </div>

        </div>
      </div>
    );
  }

  // Active Terminal View (Unlocked)
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Front-Desk Top Terminal Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-4 lg:px-8 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-600/30">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-tight">{activeTenant.name}</h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-bold">
                Counter Online
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Reception Desk Terminal • Sub-2s Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active Staff Pill */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              {activeStaff.fullName[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{activeStaff.fullName}</p>
              <p className="text-[9px] text-zinc-400 uppercase font-mono">{activeStaff.role}</p>
            </div>
          </div>

          {/* End-of-Day / Shift Handover Button */}
          <button
            onClick={() => setIsShiftCloseOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>🌙 End Day & Settle</span>
          </button>

          {/* Lock Screen */}
          <button
            onClick={() => setIsLocked(true)}
            className="p-2 bg-zinc-800 hover:bg-red-600 rounded-xl text-zinc-300 hover:text-white transition cursor-pointer"
            title="Lock Terminal"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Front Desk App */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <FrontDeskView onOpenShiftClose={() => setIsShiftCloseOpen(true)} />
      </main>

      <ShiftCloseModal
        isOpen={isShiftCloseOpen}
        onClose={() => setIsShiftCloseOpen(false)}
        onLockTerminal={() => setIsLocked(true)}
      />
    </div>
  );
}
