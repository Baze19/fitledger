'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGym } from '@/context/gym-context';
import { Dumbbell, Lock, ArrowRight, ShieldCheck, Mail, KeyRound, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { activeTenant, staffList } = useGym();

  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const id = identifier.trim().toLowerCase();
    const cred = credential.trim();

    // 1. Founder / Super Admin Route
    if (id.includes('founder') || id.includes('admin') || id === 'abiodun') {
      router.push('/admin');
      return;
    }

    // 2. Gym Owner Route
    if (id.includes('owner') || id.includes('tunde') || id === '08023456789') {
      router.push('/owner');
      return;
    }

    // 3. Front Desk Staff PIN Route
    const staffMatch = staffList.find(
      (s) =>
        s.pin === cred ||
        s.phone.replace(/\s+/g, '') === id.replace(/\s+/g, '') ||
        s.fullName.toLowerCase().includes(id)
    );

    if (staffMatch || cred.length === 4) {
      router.push('/terminal');
      return;
    }

    // Default fallback: route to Owner if valid
    if (id.length > 2) {
      router.push('/owner');
      return;
    }

    setError('Please enter your registered email, phone number, or 4-digit PIN.');
  };

  const handleQuickLogin = (role: 'founder' | 'owner' | 'receptionist') => {
    if (role === 'founder') router.push('/admin');
    if (role === 'owner') router.push('/owner');
    if (role === 'receptionist') router.push('/terminal');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl -top-32 -left-32 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -bottom-32 -right-32 pointer-events-none"></div>

      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-600/30">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight">FitLedger OS</span>
        </Link>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition">
          ← Back to Commercial Website
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto my-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">Sign In to Your Workspace</h1>
          <p className="text-xs text-zinc-400">
            Authorized access for Gym Owners, Staff & Administrators
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-2xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">
              Email Address, WhatsApp Number, or Name
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. owner@gym.ng or 0803 123 4567"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1 flex justify-between">
              <span>Password or 4-Digit Shift PIN</span>
              <span className="text-[10px] text-zinc-500 font-normal">PIN for Receptionist</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="password"
                required
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="•••••••• or 4-digit PIN"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Testing Drawer (Discreet) */}
        <div className="border-t border-zinc-800 pt-4 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 text-center">
            One-Click Role Preview for Demo:
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
            <button
              onClick={() => handleQuickLogin('founder')}
              className="py-2 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-purple-500 text-purple-300 hover:text-white transition text-center"
            >
              👑 Founder
            </button>
            <button
              onClick={() => handleQuickLogin('owner')}
              className="py-2 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-red-500 text-red-300 hover:text-white transition text-center"
            >
              🏢 Gym Owner
            </button>
            <button
              onClick={() => handleQuickLogin('receptionist')}
              className="py-2 px-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-amber-300 hover:text-white transition text-center"
            >
              🖥️ Receptionist
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-600">
        FitLedger OS • Protected by 256-Bit SSL Encryption • Lagos, Nigeria
      </footer>

    </div>
  );
}
