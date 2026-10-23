'use client';

import React from 'react';
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
} from 'lucide-react';

export default function CommercialLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. TOP COMMERCIAL HEADER                                       */}
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
            <a href="#anti-theft" className="hover:text-white transition">Anti-Theft Engine</a>
            <a href="#experience" className="hover:text-white transition">Member PWA</a>
            <a href="#pricing" className="hover:text-white transition">Pricing (NGN)</a>
          </nav>

          {/* Right Action: Sign In */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Engineered for Commercial Gyms in Lagos & Across Africa</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Eliminate the Paper Ledger. <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Stop Front-Desk Cash Leakage.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          FitLedger replaces manual paper books with sub-2-second counter check-ins, a zero-download digital member pass, staff shift PIN accountability, and an automated WhatsApp AI auditor.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wide transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm transition"
          >
            View Pricing Plans
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Paystack & Monnify Integrated</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Sub-2-Second Front-Desk Counter</span>
          <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-purple-400" /> WhatsApp AI Executive Auditor</span>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. CORE PILLARS SECTION                                        */}
      {/* ============================================================== */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">The 3-Pillar Solution</h2>
          <p className="text-2xl sm:text-3xl font-black text-white">Built for the Realities of Running a Gym in Nigeria</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Pillar 1: Front-Desk Speed */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">The 30-Second Front-Desk Rule</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When 5 people walk in at 6 PM, the receptionist doesn't have time for slow software. Sub-2-second QR barcode check-ins and 45-second new member signups keep the counter moving effortlessly.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Live phone & QR scan validator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Immediate visual active/expired alert</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Offline PWA cache during network blips</li>
            </ul>
          </div>

          {/* Pillar 2: Member PWA Experience */}
          <div id="experience" className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Zero-Download Member Pass</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Members don't want to download an 80MB app from the App Store. When they register, an automated WhatsApp link delivers their digital barcode pass, attendance calendar, and PT booking screen.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Digital barcode badge for quick scanning</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Monthly attendance calendar with visit dots</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> 1-Click Paystack self-renewal links</li>
            </ul>
          </div>

          {/* Pillar 3: Anti-Theft & WhatsApp AI */}
          <div id="anti-theft" className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition">
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
      {/* 4. ROI COMPARISON TABLE                                         */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-6 py-12 w-full space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">Commercial ROI</h2>
          <p className="text-2xl font-black text-white">Old Paper Ledger vs. FitLedger OS</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-xs">
          <div className="grid grid-cols-3 bg-zinc-950 p-4 border-b border-zinc-800 font-bold uppercase text-[10px] tracking-wider text-zinc-400">
            <div>Operational Challenge</div>
            <div className="text-red-400">Paper Ledger / Notebook</div>
            <div className="text-emerald-400">FitLedger Operating System</div>
          </div>

          <div className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Staff Cash Leakage</span>
              <span className="text-red-400">High: Untracked cash walk-ins pocketed</span>
              <span className="text-emerald-400">Zero: Every transaction logged to staff PIN</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Expired Subscription Enforcement</span>
              <span className="text-red-400">Forgotten: Expired members train for free</span>
              <span className="text-emerald-400">Strict: Screen flags RED with renewal balance</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Member Renewal Friction</span>
              <span className="text-red-400">Manual: Awkward counter confrontation</span>
              <span className="text-emerald-400">Automated: WhatsApp reminder with Paystack link</span>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-bold text-white">Owner Remote Visibility</span>
              <span className="text-red-400">Blind: Owner must physically visit counter</span>
              <span className="text-emerald-400">Total: Real-time telemetry & WhatsApp bot</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PRICING SECTION                                             */}
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
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition block"
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
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs text-center transition shadow-lg shadow-red-600/30 block"
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
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs text-center transition block"
            >
              Contact Enterprise Sales
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FOOTER                                                      */}
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
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
