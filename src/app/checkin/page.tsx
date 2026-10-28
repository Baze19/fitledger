'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useGym } from '@/context/gym-context';
import { useSearchParams } from 'next/navigation';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

function CheckInContent() {
  const searchParams = useSearchParams();
  const gymSlug = searchParams.get('gym') || searchParams.get('tenant') || '';

  const {
    activeTenant,
    tenants,
    switchTenant,
    members,
    checkInMember,
    recordSelfCheckIn,
  } = useGym();

  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<{
    status: 'success' | 'expired' | 'cross_tenant' | 'not_found' | 'idle';
    message: string;
    member?: any;
  }>({ status: 'idle', message: '' });

  // If gym query param passed, switch to that gym
  useEffect(() => {
    if (gymSlug) {
      const matched = tenants.find(
        (t) => t.slug.toLowerCase() === gymSlug.toLowerCase() || t.id === gymSlug
      );
      if (matched && matched.id !== activeTenant.id) {
        switchTenant(matched.id);
      }
    }
  }, [gymSlug, tenants, activeTenant.id, switchTenant]);

  const playChime = (type: 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const handleCheckIn = (codeOrPhone: string) => {
    const query = codeOrPhone.trim();
    if (!query) return;

    const res = checkInMember(query, 'phone_lookup');

    if (res.success && res.member) {
      playChime('success');
      setResult({
        status: 'success',
        message: `Welcome to ${activeTenant.name}, ${res.member.fullName}! Entry verified.`,
        member: res.member,
      });
      setInputVal('');
    } else if (res.reason === 'CROSS_TENANT_UNAUTHORIZED') {
      playChime('error');
      setResult({
        status: 'cross_tenant',
        message: `Member is registered at a different gym branch. Access to ${activeTenant.name} requires a Multi-Club Roaming Pass.`,
        member: res.member,
      });
    } else if (res.reason === 'EXPIRED' || res.reason === 'EXPIRED_DAY_PASS') {
      playChime('error');
      setResult({
        status: 'expired',
        message: `Membership expired on ${res.member?.subscriptionEndDate || 'today'}. Please renew your pass to enter.`,
        member: res.member,
      });
    } else {
      playChime('error');
      setResult({
        status: 'not_found',
        message: `No active member pass found matching "${query}". Check your number or contact the front desk.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckIn(inputVal);
  };

  // Sample quick test members strictly belonging to this gym
  const quickMembers = members
    .filter((m) => !m.tenantId || m.tenantId === activeTenant.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-6 pt-4">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 px-3 py-1 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Counter Express Check-In
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {activeTenant.name}
          </h1>
          <p className="text-xs text-zinc-400">
            {activeTenant.location}
          </p>
        </div>

        {/* Result Card Banner */}
        {result.status === 'success' && result.member && (
          <div className="bg-emerald-950/40 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={result.member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250'}
                alt={result.member.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-emerald-400 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black rounded-full p-1 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ACCESS GRANTED
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                {result.member.fullName}
              </h2>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">
                Pass #{result.member.memberCode} • Active until {result.member.subscriptionEndDate}
              </p>
            </div>

            <p className="text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
              Have an awesome workout today! Floor & locker access unlocked. 🔥
            </p>

            <Link
              href={`/m/${result.member.memberCode}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 underline"
            >
              <span>View Full Digital Barcode Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {result.status === 'expired' && (
          <div className="bg-amber-950/40 border-2 border-amber-500 rounded-3xl p-5 text-center space-y-3 shadow-2xl animate-shake">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-black text-amber-300">Membership Expired</h3>
            <p className="text-xs text-zinc-300">{result.message}</p>
            <div className="pt-2">
              <Link
                href={`/m/${result.member?.memberCode || '124253'}`}
                className="inline-block px-5 py-2.5 bg-amber-500 text-black font-black text-xs rounded-xl shadow-lg hover:bg-amber-400 transition"
              >
                Renew via Paystack Online
              </Link>
            </div>
          </div>
        )}

        {result.status === 'cross_tenant' && (
          <div className="bg-red-950/60 border-2 border-red-500 rounded-3xl p-5 text-center space-y-3 shadow-2xl animate-shake">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <span className="bg-red-500/20 text-red-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-red-500/40">
              Cross-Branch Access Denied
            </span>
            <h3 className="text-lg font-black text-white mt-1">Belongs to Another Gym</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{result.message}</p>
            <p className="text-[11px] text-zinc-500">
              FitLedger tenant isolation protects member rosters and prevents unbilled club roaming.
            </p>
          </div>
        )}

        {result.status === 'not_found' && (
          <div className="bg-red-950/40 border-2 border-red-500 rounded-3xl p-5 text-center space-y-2 shadow-2xl animate-shake">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-black text-red-300">Member Not Recognized</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{result.message}</p>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-500" />
              <span>Enter Phone Number or Pass Code</span>
            </label>
            <p className="text-[11px] text-zinc-400">
              Type your WhatsApp number (e.g. 0803 456 7890) or 6-digit pass code:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 0803 456 7890 or 124253"
              className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-red-500 rounded-2xl p-4 text-lg font-mono font-bold text-white placeholder-zinc-600 focus:outline-none transition"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Clock In Now</span>
            </button>
          </form>

          {/* Quick 1-Tap Test Buttons */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Quick 1-Tap Member Passes (Test Drive):
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleCheckIn(m.memberCode)}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{m.fullName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">#{m.memberCode} • {m.phoneNumber}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {m.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-zinc-600 pt-6">
        Protected by FitLedger OS • Lagos Anti-Theft & Express Gym Architecture
      </div>
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Express Check-In...</div>}>
      <CheckInContent />
    </Suspense>
  );
}
