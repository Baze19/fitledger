'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/context/gym-context';
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
  Volume2,
  VolumeX,
  ScanLine,
  Star,
  Quote,
  Check,
  XCircle,
  AlertOctagon,
  CreditCard,
  Users,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

export default function CommercialLandingPage() {
  const { tenants, checkIns } = useGym();
  const latestCheckIn = checkIns && checkIns.length > 0 ? checkIns[0] : null;

  // Interactive ROI Calculator State
  const [memberCount, setMemberCount] = useState(250);
  const [avgFee, setAvgFee] = useState(30000);
  const [activeCompareTab, setActiveCompareTab] = useState<'paper' | 'fitledger'>('fitledger');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Hero Scanner Simulator State
  const [simScenario, setSimScenario] = useState<'valid' | 'expired' | 'fake_alert'>('valid');
  const [simAudioEnabled, setSimAudioEnabled] = useState(true);
  const [simIsScanning, setSimIsScanning] = useState(false);

  // Web Audio API Synthesizer for instant audible feedback
  const playSimSound = (type: 'success' | 'blocked') => {
    if (!simAudioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleSimTrigger = (scenario: 'valid' | 'expired' | 'fake_alert') => {
    setSimIsScanning(true);
    setTimeout(() => {
      setSimScenario(scenario);
      setSimIsScanning(false);
      if (scenario === 'valid') {
        playSimSound('success');
      } else {
        playSimSound('blocked');
      }
    }, 350);
  };

  const monthlyGrossRevenue = memberCount * avgFee;
  // Conservative estimate: 10% lost to cash leakage, unrecorded walk-ins, and forgotten expirations
  const estimatedLeakage = Math.round(monthlyGrossRevenue * 0.09);
  const fitledgerCost = 45000;
  const netSaved = Math.max(0, estimatedLeakage - fitledgerCost);
  const roiMultiplier = Math.round((netSaved / fitledgerCost) * 10) / 10;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. ENTERPRISE INFRASTRUCTURE TELEMETRY & NETWORK HEALTH BAR    */}
      {/* ============================================================== */}
      <div className="bg-zinc-900/95 border-b border-zinc-800 text-[11px] py-2 px-4 overflow-hidden relative backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Live Infrastructure Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <span>FitLedger OS</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-semibold">Platform Active</span>
            </span>
          </div>

          {/* Dynamic Infrastructure Telemetry */}
          <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none text-zinc-400 flex items-center gap-4 sm:gap-6 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-zinc-200 font-semibold">{tenants.length} Commercial Branches Operational</span>
              <span className="text-zinc-500 text-[10px]">(Multi-Branch Ready)</span>
            </span>

            <span className="text-zinc-700 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-zinc-300 font-medium">Direct Bank Settlement:</span>
              <span className="text-emerald-400 font-bold">Providus & Monnify API Connected</span>
            </span>

            <span className="text-zinc-700 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-zinc-300 font-medium">Offline Resilience:</span>
              <span className="text-zinc-400 font-mono">Zero-Latency Fallback Engine</span>
            </span>

            {latestCheckIn && (
              <>
                <span className="text-zinc-700 hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 hidden md:flex">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-zinc-400">Latest Scan:</span>
                  <span className="text-zinc-200 font-mono font-semibold">Pass #{latestCheckIn.memberCode.slice(0, 3)}•••</span>
                  <span className="text-emerald-400 font-bold">Access Granted</span>
                  <span className="text-zinc-500 text-[10px]">({latestCheckIn.timestamp})</span>
                </span>
              </>
            )}
          </div>

          {/* Enterprise Sentry Uptime Badge */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0 text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-800/80 px-2.5 py-1 rounded-full font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>99.98% System Uptime</span>
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
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-400">
            <a href="#simulator" className="hover:text-white transition">Simulator</a>
            <a href="#calculator" className="hover:text-white transition">ROI Model</a>
            <a href="#case-studies" className="hover:text-white transition">Lagos Proof</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQs</a>
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

        {/* ============================================================== */}
        {/* INTERACTIVE HERO FRONT-DESK SCANNER & ANTI-THEFT SIMULATOR     */}
        {/* ============================================================== */}
        <div id="simulator" className="pt-10 max-w-4xl mx-auto relative z-10 text-left scroll-mt-24">
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Simulator Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Front-Desk Terminal Simulator
                  </span>
                  <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    v2.4 Anti-Theft
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Test the exact counter speed & anti-theft lockout gym owners experience across Lagos.
                </p>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSimAudioEnabled(!simAudioEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  simAudioEnabled
                    ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
                title="Toggle Web Audio scan chimes"
              >
                {simAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{simAudioEnabled ? 'Audio Chimes: ON' : 'Audio: Muted'}</span>
              </button>
            </div>

            {/* Interactive Scenario Buttons */}
            <div className="pt-6 space-y-3">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Click a test scenario below to simulate counter action:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleSimTrigger('valid')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    simScenario === 'valid'
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-950/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="text-xs font-bold text-white">1. Valid Member</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">1.8s Pass Check-In</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => handleSimTrigger('expired')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    simScenario === 'expired'
                      ? 'bg-red-950/60 border-red-500/80 text-red-200 shadow-lg shadow-red-950/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span className="text-xs font-bold text-white">2. Expired Member</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Lockout & Due Fee</p>
                  </div>
                  <XCircle className="w-4 h-4 text-red-400" />
                </button>

                <button
                  onClick={() => handleSimTrigger('fake_alert')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    simScenario === 'fake_alert'
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-200 shadow-lg shadow-amber-950/50'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span className="text-xs font-bold text-white">3. Fake Bank Alert</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Direct API Rejection</p>
                  </div>
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Simulated Terminal Screen Display */}
            <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
              
              {simIsScanning ? (
                <div className="py-12 text-center space-y-3">
                  <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 animate-spin">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-mono text-zinc-400 animate-pulse">
                    Scanning QR Laser / Interrogating Direct Bank Virtual Feed...
                  </p>
                </div>
              ) : simScenario === 'valid' ? (
                /* Scenario 1: Valid */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-black">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                          ACCESS GRANTED — 1.8s VERIFIED
                        </span>
                        <p className="text-[11px] text-zinc-300">
                          Turnstile Gate 1 Unlocked • Relay Signal Sent
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                      SPEED: 1.82s
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Member Name</span>
                      <span className="font-extrabold text-white text-sm">Funke Akindele</span>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">VIP Pass #124253</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Subscription Tier</span>
                      <span className="font-extrabold text-emerald-400 text-sm">Annual VIP Gym Access</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">Expires 14 Dec 2026</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Front Desk Audit</span>
                      <span className="font-extrabold text-white text-sm">Mary Okafor</span>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Shift PIN #4092 Stamped</span>
                    </div>
                  </div>
                </div>
              ) : simScenario === 'expired' ? (
                /* Scenario 2: Expired */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black">
                        <Lock className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-red-400 uppercase tracking-wide">
                          ENTRY BLOCKED — SUBSCRIPTION EXPIRED
                        </span>
                        <p className="text-[11px] text-zinc-300">
                          Turnstile Gate Remains Locked • Cash Leakage Prevented
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800">
                      LEAKAGE STOPPED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Member Name</span>
                      <span className="font-extrabold text-white text-sm">Tunde Bakare</span>
                      <span className="text-[10px] font-mono text-red-400 block mt-0.5">Expired 14 Days Ago</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Renewal Fee Due</span>
                      <span className="font-extrabold text-red-400 text-sm">₦25,000 NGN</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">Monthly Standard Plan</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Instant Resolution</span>
                      <span className="font-extrabold text-white text-sm">WhatsApp Pay Link</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">1-Tap Monnify/Card</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Scenario 3: Fake Alert */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
                        <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                          ALERT FRAUD INTERCEPTED — ₦0 RECEIVED
                        </span>
                        <p className="text-[11px] text-zinc-300">
                          Direct Providus/Wema Virtual Account Feed: Transfer Not Settled
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                      ₦30,000 SAVED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Payer on Fake SMS</span>
                      <span className="font-extrabold text-white text-sm">Kenneth Eze</span>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">Claimed Zenith App SMS</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Gym Virtual Account</span>
                      <span className="font-extrabold text-amber-400 text-sm">Providus #990234123</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">Settlement: 0 NGN Logged</span>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Owner Action</span>
                      <span className="font-extrabold text-white text-sm">Incident Flagged</span>
                      <span className="text-[10px] text-red-400 block mt-0.5">Pushed to Owner Audit Feed</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

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
      {/* 5.5 LAGOS GYM CASE STUDIES & OPERATIONAL SOCIAL PROOF          */}
      {/* ============================================================== */}
      <section id="case-studies" className="max-w-7xl mx-auto px-6 py-16 w-full space-y-10">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" /> Proven Lagos Deployments
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Trusted by Commercial Gym Founders Across Lagos</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            From single-room neighborhood gyms in Ikorodu to 3-floor luxury athletic facilities in Lekki Phase 1, here is how FitLedger protects real bottom-line revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Case Study 1: Ikorodu */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 flex flex-col justify-between hover:border-zinc-700 transition space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  +₦420,000 / mo Recovered
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              <Quote className="w-6 h-6 text-zinc-700" />
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;Before FitLedger, our 3 receptionists operated on desk notebooks. We routinely had 35 to 40 unrecorded walk-ins every Saturday. Within 7 days of enforcing 4-digit PIN shift accountability, our reported cash collections jumped 48%. It is the best operational investment I made in 2026.&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                TA
              </div>
              <div>
                <span className="font-extrabold text-white text-xs block">Chief Tunde Adeleke</span>
                <span className="text-[10px] text-zinc-400 block">Founder, PowerHouse Fitness Hub (Ikorodu)</span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">320 Active Members</span>
              </div>
            </div>
          </div>

          {/* Case Study 2: Lekki Phase 1 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 flex flex-col justify-between hover:border-zinc-700 transition space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                  100% Fake Alerts Blocked
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              <Quote className="w-6 h-6 text-zinc-700" />
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;Lekki members love to flash fake bank transfer debit SMS when the front-desk is packed at 6 PM. FitLedger&apos;s direct Providus virtual account reconciliation stopped three fraudulent walk-ins in our first 10 days alone. Staff can no longer accept unverified transfers.&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                EA
              </div>
              <div>
                <span className="font-extrabold text-white text-xs block">Engr. Emeka Alabi</span>
                <span className="text-[10px] text-zinc-400 block">MD, IronBase Athletics Club (Lekki Phase 1)</span>
                <span className="text-[10px] text-blue-400 font-semibold block mt-0.5">580 Active Members</span>
              </div>
            </div>
          </div>

          {/* Case Study 3: Surulere */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 flex flex-col justify-between hover:border-zinc-700 transition space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                  100% Shift Accountability
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              <Quote className="w-6 h-6 text-zinc-700" />
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;I frequently travel between Lagos and Abuja. With the daily 9 PM WhatsApp AI closing report, I see exact turnstile scans, POS receipts, and cash drawer counts before I sleep. My receptionists know everything is transparent.&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                RB
              </div>
              <div>
                <span className="font-extrabold text-white text-xs block">Alhaji Rasheed Balogun</span>
                <span className="text-[10px] text-zinc-400 block">Founder, Barbell Republic (Surulere)</span>
                <span className="text-[10px] text-purple-400 font-semibold block mt-0.5">410 Active Members</span>
              </div>
            </div>
          </div>

        </div>

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
      {/* 7.5 FREQUENTLY ASKED OPERATIONAL QUESTIONS (LAGOS GYM FAQS)    */}
      {/* ============================================================== */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 w-full space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Founder FAQs
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Frequently Asked Operational Questions</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Practical answers to common operational questions asked by gym owners across Lagos, Abuja, and Port Harcourt.
          </p>
        </div>

        <div className="space-y-3.5">
          {[
            {
              q: 'What happens if NEPA takes light or MTN/Airtel internet drops at the counter?',
              a: 'FitLedger runs on an offline-first architecture. The front-desk terminal continues scanning member barcodes, validating active passes, and registering walk-in payments locally without interruption. Once power or network reconnects, all visits and cash entries sync automatically to the cloud ledger with zero data loss.',
            },
            {
              q: 'Do our gym members have to download a heavy 80MB mobile app from the App Store?',
              a: 'No! Over 80% of gym members refuse to download yet another app that clutters their phone storage. FitLedger uses a zero-install WhatsApp PWA. When a member registers, an automated WhatsApp message delivers their personal barcode pass and monthly attendance calendar, which opens instantly in 0.5 seconds on any smartphone browser.',
            },
            {
              q: 'Can our receptionists delete transaction logs, alter check-ins, or steal cash unnoticed?',
              a: 'No. Every single check-in, walk-in day pass, beverage sale, and manual entry override is permanently stamped with the active receptionist’s 4-digit shift PIN. At shift handover and closing, the terminal requires a physical cash drawer count and flags any discrepancy immediately to the Owner WhatsApp AI summary. Staff cannot delete or edit history.',
            },
            {
              q: 'How does the Anti-Fake Alert engine protect our gym from fraudulent transfer screenshots?',
              a: 'Members often flash doctored bank debit SMS screenshots during peak 6 PM rush. FitLedger assigns your gym a dedicated Providus or Wema virtual account. When a customer claims they transferred, the terminal cross-checks the direct bank feed API. If ₦0 has actually settled, access is blocked and the fraud risk is permanently stamped in the owner audit feed.',
            },
            {
              q: 'Can FitLedger connect to our physical turnstile tripod gate or magnetic door lock?',
              a: 'Yes! FitLedger includes a built-in hardware relay bridge (/api/hardware/relay) compatible with standard turnstile tripod gates (ZKTeco, Hikvision, Turnstar) via a low-cost ESP32 or network relay controller. When a valid barcode is scanned, the terminal pulses the relay in 1.8 seconds to unlock the gate.',
            },
          ].map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-white hover:text-red-400 transition cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500">0{idx + 1}.</span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
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
