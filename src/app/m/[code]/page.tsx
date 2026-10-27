'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useGym } from '@/context/gym-context';
import { useParams } from 'next/navigation';
import { 
  QrCode, Calendar, Dumbbell, Users, CreditCard, CheckCircle2, 
  Sparkles, ArrowLeft, Zap, Camera, Share2, Copy, Check, 
  Maximize2, ScanLine, Gift, X, AlertCircle, Clock
} from 'lucide-react';
import { initializePaystackPayment } from '@/lib/paystack';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import Link from 'next/link';

function MemberPassContent() {
  const params = useParams();
  const code = (params?.code as string) || '124253';
  const { members, renewMember, activeTenant, updateMemberPhoto, recordSelfCheckIn } = useGym();

  const member = members.find((m) => m.memberCode === code) || members[0];
  
  // Modals
  const [showPtModal, setShowPtModal] = useState(false);
  const [ptBooked, setPtBooked] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanTab, setScanTab] = useState<'self_checkin' | 'fullscreen_badge'>('self_checkin');
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  
  const [showReferModal, setShowReferModal] = useState(false);
  const [referCopied, setReferCopied] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Photo Upload State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoToast, setPhotoToast] = useState<string | null>(null);

  // Sound chime for self check-in
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const handleMemberPaystackRenewal = () => {
    initializePaystackPayment({
      email: member.email || 'member@fitledger.ng',
      amountInNaira: 30000,
      fullName: member.fullName,
      planName: 'VIP All-Access Monthly Pass Renewal',
      gymName: activeTenant.name,
      onSuccess: (ref) => {
        renewMember(member.id, 'plan_monthly_vip', 'paystack_online');
        alert(`✓ Payment Confirmed via Paystack!\n\nRef: ${ref}\nYour VIP Membership has been extended by 30 days!`);
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateMemberPhoto(member.id, dataUrl);
        setPhotoToast('✓ Profile photo updated successfully!');
        setTimeout(() => setPhotoToast(null), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfCheckInTrigger = () => {
    const res = recordSelfCheckIn(member.id);
    if (res.success) {
      playChime();
      setScanSuccessMsg(res.message);
      setTimeout(() => {
        setScanSuccessMsg(null);
        setShowScanModal(false);
      }, 2500);
    } else {
      alert(res.message);
    }
  };

  const handleCopyReferral = () => {
    const refUrl = `https://fitledger-v1.vercel.app/m/${member.memberCode}?ref=${member.memberCode}`;
    navigator.clipboard.writeText(refUrl).then(() => {
      setReferCopied(true);
      setTimeout(() => setReferCopied(false), 2500);
    });
  };

  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);

  const isVisitDay = (day: number) => {
    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return member.visitDates.includes(dateStr);
  };

  const isPtDay = (day: number) => {
    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return member.ptSessionDates.includes(dateStr);
  };

  const memberInitials = member.fullName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isDayPass = member.currentPlanId === 'plan_daily' || member.memberCode.startsWith('DAY-');
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isExpired = todayStr > member.subscriptionEndDate || new Date(member.subscriptionEndDate) < new Date(todayStr);

  const memberBarcodeTag = isDayPass
    ? `${member.memberCode}-${member.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase()}-DAYPASS`
    : `${member.memberCode}-${member.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase()}-VIP`;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans">
      
      {/* Hidden Photo Upload Input */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Mobile Shell */}
      <div className="w-full max-w-md min-h-screen bg-black border-x border-zinc-900 flex flex-col justify-between relative">
        
        <div>
          {/* iOS Status Bar */}
          <div className="flex justify-between items-center text-xs px-5 pt-3 pb-2 text-zinc-400">
            <span className="font-semibold text-white">13:40</span>
            <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto"></div>
            <span className="font-semibold text-emerald-400">4G 46%</span>
          </div>

          {/* Club Header */}
          <div className={`${isDayPass ? 'bg-amber-600' : 'bg-red-600'} px-4 py-3 flex items-center justify-between text-white shadow-lg transition-colors`}>
            <div className="flex items-center gap-2.5">
              <Link href="/" className="p-1 hover:bg-black/20 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight leading-tight">{activeTenant.name}</h1>
                <p className="text-[10px] text-white/80">{activeTenant.location}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isDayPass ? 'bg-black/40 text-amber-200' : 'bg-red-800/80 text-white'
            }`}>
              {isDayPass ? '1-DAY PASS' : 'VIP PASS'}
            </span>
          </div>

          {/* Toast Notification */}
          {photoToast && (
            <div className="mx-4 mt-3 bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl text-center text-xs font-bold text-emerald-300 animate-fade-in">
              {photoToast}
            </div>
          )}

          {/* Mobile Body */}
          <div className="p-4 space-y-4">
            
            {/* Member Profile Card with 1-Tap Photo Upload / Selfie */}
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar with Camera badge */}
                <div
                  onClick={() => setIsCameraOpen(true)}
                  className="relative cursor-pointer group flex-shrink-0"
                  title="Tap to snap live selfie or upload photo"
                >
                  <div className={`w-13 h-13 rounded-full border-2 ${isDayPass ? 'border-amber-500' : 'border-red-500'} overflow-hidden bg-zinc-800 flex items-center justify-center relative shadow-md`}>
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className={`font-black text-sm ${isDayPass ? 'text-amber-400' : 'text-red-400'}`}>{memberInitials}</span>
                    )}
                    {/* Camera overlay icon */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition">
                      <Camera className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>
                  <span className={`absolute -bottom-1 -right-1 ${isDayPass ? 'bg-amber-500' : 'bg-red-600'} text-white rounded-full p-1 shadow`}>
                    <Camera className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-sm text-white leading-tight">{member.fullName}</h3>
                  <p className="text-xs text-zinc-400 font-mono">#{member.memberCode}</p>
                  <div className={`flex items-center gap-1 text-[10px] font-bold mt-0.5 ${
                    isExpired ? 'text-red-400' : isDayPass ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {isExpired ? <AlertCircle className="w-3 h-3" /> : isDayPass ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>
                      {isExpired
                        ? `Expired on ${member.subscriptionEndDate}`
                        : isDayPass
                        ? `Valid Today Only • Expires at 11:59 PM`
                        : `Active until ${member.subscriptionEndDate}`}
                    </span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] px-2.5 py-1 rounded-xl font-bold border ${
                isDayPass
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}>
                {isDayPass ? '1-Day Walk-In' : 'Monthly VIP'}
              </span>
            </div>

            {/* High Contrast Digital Barcode */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold uppercase tracking-wider text-[10px]">Access Badge</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">Auto Brightness Active</span>
              </div>

              {/* Barcode Graphic */}
              <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center justify-center gap-[2.5px] h-14 w-full">
                  <span className="w-1.5 h-full bg-black"></span><span className="w-3 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-2 h-full bg-black"></span>
                  <span className="w-1 h-full bg-black"></span><span className="w-4 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                  <span className="w-3 h-full bg-black"></span><span className="w-1.5 h-full bg-black"></span><span className="w-2.5 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                  <span className="w-4 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-3 h-full bg-black"></span>
                </div>
                <p className="text-[11px] font-mono font-black text-black tracking-widest">
                  {memberBarcodeTag}
                </p>
              </div>

              {isDayPass && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg py-1 px-2 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  ⚠️ Single-Day Guest Pass • Valid Today Until 11:59 PM
                </div>
              )}

              <p className="text-[11px] text-zinc-400">Hold near scanner or counter to enter</p>
            </div>

            {/* Quick Actions (All 4 Fully Functional) */}
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              
              {/* 1. SCAN (Self Check-in / Fullscreen Barcode) */}
              <div
                onClick={() => setShowScanModal(true)}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition active:scale-95"
              >
                <QrCode className="w-5 h-5 text-red-500" />
                <span className="font-medium text-zinc-300">Scan</span>
              </div>

              {/* 2. PT BOOK */}
              <div
                onClick={() => setShowPtModal(true)}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-blue-500 cursor-pointer transition active:scale-95"
              >
                <Dumbbell className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-zinc-300">PT Book</span>
              </div>

              {/* 3. REFER (Viral Growth WhatsApp Share) */}
              <div
                onClick={() => setShowReferModal(true)}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-purple-500 cursor-pointer transition active:scale-95"
              >
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-zinc-300">Refer</span>
              </div>

              {/* 4. PAYSTACK (Direct Renewal) */}
              <div
                onClick={handleMemberPaystackRenewal}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-emerald-500 cursor-pointer transition active:scale-95"
              >
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-emerald-400">Paystack</span>
              </div>
            </div>

            {/* CTA Button: Book a PT Session */}
            <button
              onClick={() => setShowPtModal(true)}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Dumbbell className="w-4 h-4" />
              Book a PT Session ({member.remainingPtSessions} Left)
            </button>

            {/* Attendance Calendar (October 2026) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Visit History</h4>
                  <p className="text-[11px] text-zinc-400">October 2026</p>
                </div>
                <div className="flex items-center gap-2.5 text-[10px]">
                  <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Visits
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Bookings
                  </span>
                </div>
              </div>

              {/* Mon to Sun Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <span key={d} className="text-zinc-500 text-[10px] pb-1">
                    {d}
                  </span>
                ))}

                <div className="p-1"></div>
                <div className="p-1"></div>
                <div className="p-1"></div>

                {daysInOctober.map((day) => {
                  const visited = isVisitDay(day);
                  const pt = isPtDay(day);
                  const isToday = day === 22 || day === new Date().getDate();

                  return (
                    <div
                      key={day}
                      className={`p-1 rounded-xl flex flex-col items-center justify-center min-h-[34px] transition ${
                        isToday
                          ? 'bg-red-500/20 border border-red-500/50 text-white font-black'
                          : visited || pt
                          ? 'bg-zinc-800/90 text-white'
                          : 'text-zinc-500 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span className="text-[11px] leading-none">{day}</span>
                      <div className="flex gap-0.5 mt-1">
                        {visited && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        {pt && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Visits This Month:</span>
                <span className="font-extrabold text-emerald-400 text-sm">{member.totalVisitsThisMonth} Workouts 🔥</span>
              </div>
            </div>

            {/* AI Coach Insights */}
            <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/20 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">AI Coach Insights</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                  "You've crushed {member.totalVisitsThisMonth} workouts this month! Coach Tunde recommends hitting lower body tomorrow to keep your streak going."
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- MODAL 1: SCAN (Self Check-in & Zoom Barcode) ----------------- */}
        {showScanModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl animate-scale-up">
              
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Member Scanner</h3>
                    <p className="text-[10px] text-zinc-400">Self Check-In & Scanner Badge</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowScanModal(false);
                    setScanSuccessMsg(null);
                  }}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-bold gap-1">
                <button
                  onClick={() => setScanTab('self_checkin')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    scanTab === 'self_checkin' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Scan Counter QR
                </button>
                <button
                  onClick={() => setScanTab('fullscreen_badge')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    scanTab === 'fullscreen_badge' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Fullscreen Pass
                </button>
              </div>

              {scanSuccessMsg ? (
                <div className="text-center py-6 space-y-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-black text-base text-emerald-400">Check-In Confirmed!</h4>
                  <p className="text-xs text-zinc-300">{scanSuccessMsg}</p>
                </div>
              ) : scanTab === 'self_checkin' ? (
                <div className="space-y-4 text-center">
                  {/* Viewfinder Graphic with Laser Sweep */}
                  <div className="relative w-56 h-56 mx-auto bg-zinc-900 border-2 border-red-500/60 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-inner">
                    {/* Viewfinder Corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>

                    {/* Laser Sweep line */}
                    <div className="absolute w-full h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-laser-sweep"></div>

                    <ScanLine className="w-12 h-12 text-zinc-600 mb-2" />
                    <p className="text-[11px] font-bold text-zinc-300">Point at Front-Desk QR</p>
                    <p className="text-[9px] text-zinc-500">Turnstile or Reception Counter</p>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Skip the front desk queue! Scan the counter QR code at <strong>{activeTenant.name}</strong> to clock in automatically.
                  </p>

                  <button
                    onClick={handleSelfCheckInTrigger}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    ⚡ Tap to Clock In (Simulate Desk QR Scan)
                  </button>
                </div>
              ) : (
                /* Fullscreen Barcode for Counter Laser Gun */
                <div className="space-y-4 text-center">
                  <div className="bg-white p-4 rounded-2xl space-y-2 shadow-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">High Contrast Laser Pass</p>
                    
                    {/* High-Res QR Simulation */}
                    <div className="w-40 h-40 mx-auto bg-black p-2 rounded-xl flex items-center justify-center">
                      <QrCode className="w-36 h-36 text-white" />
                    </div>

                    {/* Barcode */}
                    <div className="flex items-center justify-center gap-[3px] h-12 w-full pt-1">
                      <span className="w-2 h-full bg-black"></span><span className="w-4 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-3 h-full bg-black"></span>
                      <span className="w-1.5 h-full bg-black"></span><span className="w-5 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                      <span className="w-4 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-3 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                    </div>

                    <p className="font-mono font-black text-black text-sm tracking-widest">{member.memberCode}</p>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Hold this high-contrast screen in front of the counter barcode laser scanner or speed turnstile.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ----------------- MODAL 2: REFER A WORKOUT BUDDY ----------------- */}
        {showReferModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl animate-scale-up">
              
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Refer a Workout Buddy</h3>
                    <p className="text-[10px] text-zinc-400">Give ₦2,000, Get 5 Free Days</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReferModal(false)}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Offer Graphic */}
              <div className="bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 p-4 rounded-2xl text-center space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Gym Loyalty Program</p>
                <h4 className="font-black text-base text-white">Give ₦2,000 Off, Get 5 Free Days! 🔥</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Invite your friends to workout at <strong>{activeTenant.name}</strong>. When they sign up using your code, they get ₦2,000 off, and you get 5 free workout days added to your subscription!
                </p>
              </div>

              {/* Referral Code Box */}
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center">Your Unique Referral Code</p>
                <div className="bg-black border border-purple-500/50 p-2.5 rounded-xl text-center">
                  <span className="font-mono font-black text-xl text-purple-300 tracking-wider">#{member.memberCode}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* 1. Share via WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `*Hey! I workout at ${activeTenant.name} (${activeTenant.location})* 🏋️‍♂️💪\n\nJoin me this month and get *₦2,000 off* your VIP membership pass!\n\nUse my referral code *#${member.memberCode}* or view my gym pass here:\n👉 https://fitledger-v1.vercel.app/m/${member.memberCode}\n\nLet's get fit together!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  📱 Share via WhatsApp
                </a>

                {/* 2. Copy Link */}
                <button
                  onClick={handleCopyReferral}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {referCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">✓ Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copy Referral Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Referral Stats */}
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Your Referral Stats:</span>
                <span className="font-bold text-white">0 Friends • 0 Days Earned</span>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- MODAL 3: PT BOOKING ----------------- */}
        {showPtModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full text-white space-y-4 shadow-2xl animate-scale-up">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                  Book Coach Tunde
                </h3>
                <button onClick={() => setShowPtModal(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              {ptBooked ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-400">Session Confirmed!</h4>
                  <p className="text-xs text-zinc-400">Coach Tunde has been notified on WhatsApp for Friday, 6:00 PM.</p>
                  <button
                    onClick={() => {
                      setPtBooked(false);
                      setShowPtModal(false);
                    }}
                    className="w-full py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white mt-2 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 font-semibold">Select Date & Time:</label>
                    <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1">
                      <option>Tomorrow (Friday) — 07:00 AM</option>
                      <option>Tomorrow (Friday) — 06:00 PM</option>
                      <option>Saturday — 08:30 AM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 font-semibold">Workout Focus:</label>
                    <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1">
                      <option>Upper Body Strength & Hypertrophy</option>
                      <option>Leg Day & Core Stability</option>
                      <option>HIIT Fat Burn Conditioning</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setPtBooked(true)}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Selfie Camera Modal */}
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl) => {
            updateMemberPhoto(member.id, dataUrl);
            setPhotoToast('✓ Profile photo updated successfully!');
            setTimeout(() => setPhotoToast(null), 3500);
          }}
          title="Snap Member Selfie"
          subtitle="Align your face to update your digital pass"
        />

      </div>
    </div>
  );
}

export default function MemberPassPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-sm">Loading member pass...</div>}>
      <MemberPassContent />
    </Suspense>
  );
}
