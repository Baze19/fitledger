'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Dumbbell,
  Smartphone,
  Terminal,
  Lock,
  ArrowRight,
  TrendingUp,
  Bot,
  QrCode,
  Calendar,
  CheckCircle2,
  DollarSign,
  Zap,
  Building,
  PhoneCall,
  Clock,
  Sparkles,
  Calculator,
  ChevronRight,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export default function CommercialLandingPage() {
  // Interactive ROI Calculator State
  const [memberCount, setMemberCount] = useState(250);
  const [avgFee, setAvgFee] = useState(30000);
  const [activeCompareTab, setActiveCompareTab] = useState<'paper' | 'fitledger'>('fitledger');

  const monthlyGrossRevenue = memberCount * avgFee;
  // Conservative estimate: 10% lost to cash leakage, unrecorded walk-ins, and forgotten expirations
  const estimatedLeakage = Math.round(monthlyGrossRevenue * 0.09);
  const fitledgerCost = 45000;
  const netSaved = Math.max(0, estimatedLeakage - fitledgerCost);
  const roiMultiplier = Math.round((netSaved / fitledgerCost) * 10) / 10;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP LIVE TICKER BAR (Animated Lagos Telemetry)              */}
      {/* ============================================================== */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] py-1.5 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px]">
              Live Lagos Fleet
            </span>
          </div>
          <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none text-zinc-400 flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-500">12s ago:</span>
              <span className="text-zinc-200 font-semibold">VIP Member #124253</span>
              <span>checked into FitLedger Ikorodu (Turnstile Opened)</span>
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-500">45s ago:</span>
              <span className="text-emerald-400 font-semibold">₦45,000 Annual Transfer</span>
              <span>verified via Monnify at IronBase Lekki</span>
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-500">2m ago:</span>
              <span className="text-red-400 font-semibold">Expired Pass Flagged</span>
              <span>at Hardcore Surulere (Cash leakage blocked)</span>
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-zinc-500">5m ago:</span>
              <span className="text-purple-400 font-semibold">WhatsApp AI Closing Summary</span>
              <span>delivered to Chief Tunde (₦310k today)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TOP COMMERCIAL HEADER                                       */}
      {/* ============================================================== */}
      <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">FitLedger</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  OS 2026
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Commercial Gym Operating System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#calculator" className="hover:text-white transition">ROI Calculator</a>
            <a href="#comparison" className="hover:text-white transition">Before vs After</a>
            <a href="#pricing" className="hover:text-white transition">Pricing (NGN)</a>
          </nav>

          {/* Right Action: Sign In */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center space-y-6 relative">
        
        {/* Glow backdrop */}
        <div className="absolute w-[600px] h-[350px] bg-red-600/10 rounded-full blur-3xl -top-10 left-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold shadow-inner relative z-10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>Anti-Theft Engine & Member PWA for Commercial Gyms in Lagos</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] relative z-10">
          Eliminate the Paper Ledger. <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Stop Front-Desk Cash Leakage.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          FitLedger replaces manual paper books with sub-2-second counter check-ins, a zero-download digital member pass, staff shift PIN accountability, and an automated WhatsApp AI auditor.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wide transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Launch Your Gym Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#calculator"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Calculate Cash Recovered</span>
          </a>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left relative z-10">
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Check-In Speed</span>
            <span className="text-2xl font-black text-white">1.8 Seconds</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Sub-2s counter queue</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Leakage Prevented</span>
            <span className="text-2xl font-black text-emerald-400">₦3.8M+</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Across 4 Lagos pilot gyms</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">App Downloads</span>
            <span className="text-2xl font-black text-white">0 MB Required</span>
            <span className="text-[11px] text-blue-400 block mt-0.5">Zero-install WhatsApp PWA</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Owner Peace of Mind</span>
            <span className="text-2xl font-black text-purple-400">9 PM Report</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Daily WhatsApp AI closure</span>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. INTERACTIVE LAGOS GYM ROI & LEAKAGE CALCULATOR              */}
      {/* ============================================================== */}
      <section id="calculator" className="max-w-5xl mx-auto px-6 py-16 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" /> Interactive ROI Model
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">How Much Is Your Front Desk Losing to Paper Ledgers?</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Drag the sliders to see what unrecorded walk-ins, forgotten expirations, and pocketed cash are costing your gym every month.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Sliders Side */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300">Active Gym Members:</span>
                <span className="font-extrabold text-white text-base font-mono">{memberCount} Members</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="w-full accent-red-600 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>50 members</span>
                <span>500 members</span>
                <span>1,000+ members</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300">Average Monthly Fee:</span>
                <span className="font-extrabold text-white text-base font-mono">₦{avgFee.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="60000"
                step="5000"
                value={avgFee}
                onChange={(e) => setAvgFee(Number(e.target.value))}
                className="w-full accent-red-600 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>₦15,000/mo</span>
                <span>₦35,000/mo</span>
                <span>₦60,000/mo</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl text-xs space-y-1.5 text-zinc-400">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Conservative Lagos Fitness Benchmark:
              </p>
              <p className="text-[11px] leading-relaxed">
                Gym owners in Surulere, Ikeja, and Lekki lose between <strong>8% to 12%</strong> of turnover to untracked counter cash, expired passes, and receptionists letting friends train without payment.
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 text-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Estimated Monthly Cash Leakage
              </span>
              <p className="text-3xl sm:text-4xl font-black text-red-500">
                -₦{estimatedLeakage.toLocaleString()}<span className="text-xs text-zinc-400 font-normal"> / mo</span>
              </p>
              <p className="text-[11px] text-zinc-500">Lost to paper records, manual slips & unlogged cash</p>
            </div>

            <div className="border-t border-zinc-800/80 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>FitLedger Growth Plan:</span>
                <span className="font-mono text-zinc-300">₦{fitledgerCost.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-zinc-800/60 pt-2">
                <span>Net Cash Recovered by Owner:</span>
                <span className="font-mono text-emerald-400 text-sm">+₦{netSaved.toLocaleString()}/mo</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 font-black text-sm">
              🚀 {roiMultiplier}x Net Return on Software Investment
            </div>

            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 block cursor-pointer"
            >
              Start Free 14-Day Pilot & Stop Leakage
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. BEFORE VS AFTER INTERACTIVE COMPARISON                      */}
      {/* ============================================================== */}
      <section id="comparison" className="max-w-5xl mx-auto px-6 py-12 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">Operational Contrast</h2>
          <p className="text-2xl sm:text-3xl font-black text-white">Compare: Traditional Paper vs FitLedger OS</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center">
          <div className="bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl flex gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveCompareTab('paper')}
              className={`px-5 py-2.5 rounded-xl transition cursor-pointer ${
                activeCompareTab === 'paper'
                  ? 'bg-red-950/80 text-red-300 border border-red-800 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ❌ Manual Paper Ledgers in Lagos
            </button>
            <button
              onClick={() => setActiveCompareTab('fitledger')}
              className={`px-5 py-2.5 rounded-xl transition cursor-pointer ${
                activeCompareTab === 'fitledger'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ✅ FitLedger Anti-Theft OS
            </button>
          </div>
        </div>

        {/* Content Box */}
        {activeCompareTab === 'paper' ? (
          <div className="bg-zinc-900 border border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>The Hidden Costs of Managing a Gym With Notebooks:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">Cash Pocketing at the Desk</span>
                <p className="text-zinc-400 leading-relaxed">
                  Walk-in visitors pay ₦2,000 cash for a daily workout. Receptionists never record it in the book and pocket the cash.
                </p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">Forgotten Expiry Dates</span>
                <p className="text-zinc-400 leading-relaxed">
                  Members whose ₦30,000 month expired 2 weeks ago keep walking past reception because receptionists don&apos;t check 20 pages of entries.
                </p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">Owner Completely Blind</span>
                <p className="text-zinc-400 leading-relaxed">
                  Unless the gym owner sits at the front desk for 12 hours a day, they never know true daily attendance or actual collections.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>How FitLedger Transforms Your Gym Operations:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">4-Digit Shift PIN Accountability</span>
                <p className="text-zinc-400 leading-relaxed">
                  Every check-in, registration, and payment is permanently stamped with the receptionist&apos;s shift PIN. Shift handovers require cash drawer count.
                </p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">Instant Red Expiry Alarm</span>
                <p className="text-zinc-400 leading-relaxed">
                  When an expired barcode is scanned, the terminal flashes RED with exact due balance and prompts instant Paystack or Monnify payment.
                </p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <span className="font-bold text-white block">Daily 9 PM WhatsApp AI Auditor</span>
                <p className="text-zinc-400 leading-relaxed">
                  Owners receive an unalterable financial summary on WhatsApp every night: Transfers, POS slips, Cash in hand, and member count.
                </p>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ============================================================== */}
      {/* 6. THE 3-PILLAR DEEP DIVE                                      */}
      {/* ============================================================== */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">The 3-Pillar Solution</h2>
          <p className="text-2xl sm:text-3xl font-black text-white">Engineered for Fast-Paced Lagos Workouts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Pillar 1: Front-Desk Speed */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">The 30-Second Front-Desk Rule</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When 5 people walk in at 6 PM, the receptionist doesn&apos;t have time for slow software. Sub-2-second QR barcode check-ins and 45-second new member signups keep the counter moving effortlessly.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Live phone & QR scan validator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Immediate visual active/expired alert</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Offline cache during network blips</li>
            </ul>
          </div>

          {/* Pillar 2: Member PWA Experience */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Zero-Download Member Pass</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Members don&apos;t want to download an 80MB app from the App Store. When they register, an automated WhatsApp link delivers their digital barcode pass, attendance calendar, and PT booking screen.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Digital barcode badge for quick scanning</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Monthly attendance calendar with visit dots</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> 1-Click Paystack self-renewal links</li>
            </ul>
          </div>

          {/* Pillar 3: Anti-Theft & WhatsApp AI */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Anti-Theft & Staff PIN Roster</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stop receptionists from pocketing cash or letting friends train for free. Every check-in, payment, and manual override is stamped with the receptionist’s 4-digit shift PIN and audited.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Shift handover cash count & POS matching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Override alarms sent to Owner feed</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Daily 9 PM WhatsApp closing summary</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. PRICING SECTION                                             */}
      {/* ============================================================== */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 w-full space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">Transparent Pricing</h2>
          <p className="text-2xl sm:text-3xl font-black text-white">Simple Monthly Subscriptions in Naira (NGN)</p>
          <p className="text-xs text-zinc-400">Zero setup fees • 14-Day Free Risk-Free Trial for all new gym branches</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Starter Plan */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-zinc-700 transition">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starter Tier</span>
                <h3 className="text-2xl font-black text-white mt-1">₦25,000<span className="text-xs font-normal text-zinc-400"> / month</span></h3>
                <p className="text-xs text-zinc-400 mt-2">Perfect for single-branch neighborhood fitness centers.</p>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-zinc-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 200 active members</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Front-desk terminal session</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sub-2s QR code check-in</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Shift handover cash count</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition block cursor-pointer"
            >
              Start 14-Day Free Pilot
            </Link>
          </div>

          {/* Growth Plan (Most Popular) */}
          <div className="bg-zinc-900 border-2 border-red-500 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-red-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular in Lagos
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Growth Tier</span>
                <h3 className="text-3xl font-black text-white mt-1">₦45,000<span className="text-xs font-normal text-zinc-400"> / month</span></h3>
                <p className="text-xs text-zinc-400 mt-2">For busy commercial gyms with high foot traffic.</p>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-zinc-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited member database</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited receptionists & staff PINs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated WhatsApp renewal links</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Daily 9 PM WhatsApp AI closing report</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Personal Trainer session scheduling</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs text-center transition shadow-lg shadow-red-600/30 block cursor-pointer"
            >
              Start 14-Day Free Pilot
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-zinc-700 transition">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Enterprise Tier</span>
                <h3 className="text-2xl font-black text-white mt-1">₦95,000<span className="text-xs font-normal text-zinc-400"> / month</span></h3>
                <p className="text-xs text-zinc-400 mt-2">For multi-branch gym chains & premium fitness hubs.</p>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-zinc-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-branch cross-access roaming</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hardware turnstile gate integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated account manager in Lagos</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom branding & member domain</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition block cursor-pointer"
            >
              Contact Enterprise Sales
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="mt-auto border-t border-zinc-900 py-8 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">FitLedger OS</span>
            <span>• Built for Commercial Fitness Centers in Lagos, Nigeria</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#calculator" className="hover:text-white transition">ROI Calculator</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
