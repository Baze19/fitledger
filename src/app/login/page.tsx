'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGym } from '@/context/gym-context';
import { Dumbbell, Lock, ArrowRight, ShieldCheck, Mail, KeyRound, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { authenticateUser } = useGym();

  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = authenticateUser(identifier, credential);

      if (result.success && result.targetUrl) {
        router.push(result.targetUrl);
      } else {
        setError(result.message || 'Invalid credentials. Please verify your email, phone, or 4-digit Shift PIN.');
        setLoading(false);
      }
    }, 450);
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
        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5">
          ← Back to Commercial Website
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto my-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">Sign In to Your Workspace</h1>
          <p className="text-xs text-zinc-400">
            Authorized access for Gym Owners, Staff & Platform Admins
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-2xl text-xs text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block">Authentication Failed</span>
              <span>{error}</span>
            </div>
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
                placeholder="e.g. tunde@fitledger.ng or 0802 345 6789"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs transition"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-300 block mb-1 flex justify-between">
              <span>Password or 4-Digit Shift PIN</span>
              <span className="text-[10px] text-zinc-500 font-normal">PIN for Front Desk</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="password"
                required
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="•••••••• or 4-digit PIN"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs transition font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Workspace Access...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Discreet Test Credentials Accordion for Testing */}
        <div className="border-t border-zinc-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1.5 mx-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide test credentials' : 'Need test credentials? Click to view'}</span>
          </button>

          {showHint && (
            <div className="mt-3 p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400 space-y-2">
              <div className="space-y-0.5">
                <span className="text-purple-400 font-bold block">👑 Founder (Super Admin HQ):</span>
                <code className="text-zinc-300 block">wincodes2@gmail.com / admin</code>
              </div>
              <div className="space-y-0.5">
                <span className="text-red-400 font-bold block">🏢 Gym Owner (Ikorodu Gym):</span>
                <code className="text-zinc-300 block">tunde@fitledger.ng / fitledger2026</code>
              </div>
              <div className="space-y-0.5">
                <span className="text-amber-400 font-bold block">🖥️ Receptionist (Front Desk):</span>
                <code className="text-zinc-300 block">PIN: 4821 (Mary) or 1102 (John)</code>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-600 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Protected by 256-Bit SSL Encryption
        </span>
        <span className="hidden sm:inline">•</span>
        <span>FitLedger OS Lagos, Nigeria</span>
        <span className="hidden sm:inline">•</span>
        <a href="mailto:support@fitledger.ng" className="text-zinc-500 hover:text-zinc-400 underline">
          Platform Support
        </a>
      </footer>

    </div>
  );
}
