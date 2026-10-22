'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Dumbbell,
  Smartphone,
  Terminal,
  Building2,
  Lock,
  ArrowRight,
  TrendingUp,
  Bot,
  QrCode,
  Calendar,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPortalPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">FitLedger OS</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-zinc-500">Commercial Gym Operating System & Anti-Theft Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-300 transition flex items-center gap-1.5"
            >
              <span>⚡ Founder Admin</span>
            </Link>
            <Link
              href="/owner"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <span>Owner Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Tailored for Commercial Fitness Centers in Lagos & Africa</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Eliminate the Paper Ledger. <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Stop Front-Desk Cash Leakage.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FitLedger provides independent gyms with sub-2-second counter check-ins, a zero-download i-Fitness style member PWA, staff PIN accountability, and an automated WhatsApp AI auditor.
        </p>
      </section>

      {/* 4 Dedicated Role-Based Portal Gateway Cards */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Access Dedicated Portals</h2>
          <p className="text-lg font-black text-white mt-1">Select a role to experience the isolated interface:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Portal 1: Super Admin Platform */}
          <Link
            href="/admin"
            className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                ⚡
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">Route: /admin</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">Founder</span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition">
                  Super Admin HQ
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your platform founder cockpit. Onboard gyms across Lagos, track SaaS MRR, monitor system health, and manage tenant fleet.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>Open Founder Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Portal 2: Gym Owner Suite */}
          <Link
            href="/owner"
            className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🏢
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">Route: /owner</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold">Owner</span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-red-400 transition">
                  Gym Owner Suite
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Full anti-theft revenue telemetry, staff front-desk PIN management ("Add Receptionist"), member directory, and WhatsApp AI bot.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-red-400 group-hover:text-red-300">
              <span>Open Owner Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Portal 3: Front-Desk Terminal */}
          <Link
            href="/terminal"
            className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🖥️
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">Route: /terminal</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">Reception</span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition">
                  Front-Desk Terminal
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Square POS-style 4-digit PIN unlock screen. Sub-2s check-in counter, 45-second member registration, and shift cash drawer handover.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Open Counter Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Portal 4: Standalone Member PWA */}
          <Link
            href="/m/124253"
            className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                📱
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Route: /m/124253</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Member</span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition">
                  Member Mobile PWA
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pure zero-download mobile pass. High-contrast digital barcode, October 2026 visit calendar with red/blue dots, and PT booking.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>View Member Pass</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

        </div>
      </section>

      {/* Feature Value Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 py-12 w-full space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white">Why Paper Ledgers Fail & How FitLedger Wins</h2>
          <p className="text-xs text-zinc-400">The commercial ROI comparison you pitch to gym owners:</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl text-xs">
          <div className="grid grid-cols-3 bg-zinc-950 p-4 border-b border-zinc-800 font-bold uppercase text-[10px] tracking-wider text-zinc-400">
            <div>Feature / Challenge</div>
            <div className="text-red-400">Old Paper Ledger</div>
            <div className="text-emerald-400">FitLedger OS</div>
          </div>

          <div className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Front-Desk Theft & Leakage</span>
              <span className="text-red-400">High: Staff pocket cash & let friends enter</span>
              <span className="text-emerald-400">Zero: Every entry and override is audit-logged</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Member Check-In Speed</span>
              <span className="text-red-400">Slow: Writing name & time in a notebook</span>
              <span className="text-emerald-400">Sub-2 Seconds: QR barcode or phone lookup</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Subscription Expiry Tracking</span>
              <span className="text-red-400">Forgotten: Members train weeks past expiry</span>
              <span className="text-emerald-400">Automated: WhatsApp payment links sent 3d prior</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Owner Remote Visibility</span>
              <span className="text-red-400">Zero: Must travel to gym to count physical cash</span>
              <span className="text-emerald-400">Instant: Daily 9 PM WhatsApp summary & real-time telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 py-6 px-6 text-center text-xs text-zinc-500">
        FitLedger OS • Next-Gen Gym Operating System • Multi-Tenant Architecture • Lagos, Nigeria
      </footer>

    </div>
  );
}
