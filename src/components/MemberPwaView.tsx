'use client';

import React, { useState, useRef } from 'react';
import { useGym } from '@/context/gym-context';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import { 
  QrCode, Calendar, Dumbbell, Users, CreditCard, ChevronRight, 
  CheckCircle2, Clock, Sparkles, Camera, Zap, Share2, Copy, 
  Check, Maximize2, ScanLine, Gift, X 
} from 'lucide-react';

export function MemberPwaView() {
  const { members, renewMember, activeTenant, updateMemberPhoto, recordSelfCheckIn } = useGym();
  // We showcase active member (#124253)
  const member = members.find((m) => m.memberCode === '124253') || members[0];
  
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

  // Audio Chime for Self Check-in
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateMemberPhoto(member.id, dataUrl);
        setPhotoToast('✓ Profile photo updated!');
        setTimeout(() => setPhotoToast(null), 3000);
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

  // October 2026 calendar days
  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);

  const isVisitDay = (day: number) => {
    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return member.visitDates.includes(dateStr);
  };

  const isPtDay = (day: number) => {
    const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
    return member.ptSessionDates.includes(dateStr);
  };

  const isDayPass = member.currentPlanId === 'plan_daily' || member.memberCode.startsWith('DAY-');
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isExpired = todayStr > member.subscriptionEndDate || new Date(member.subscriptionEndDate) < new Date(todayStr);

  const memberBarcodeTag = isDayPass
    ? `${member.memberCode}-${member.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase()}-DAYPASS`
    : `${member.memberCode}-${member.fullName.replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase()}-VIP`;

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-4 font-sans">
      
      {/* Hidden Photo Upload Input */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* PWA Explainer Pill */}
      <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span><strong>Zero-Download PWA:</strong> Accessed via WhatsApp short link, saves offline on iPhone/Android.</span>
      </div>

      {/* iPhone 16 Mockup Frame */}
      <div className="w-full max-w-sm bg-black border-4 border-zinc-800 rounded-[44px] shadow-2xl p-4 overflow-hidden relative text-white">
        
        {/* Dynamic Island / Status Bar */}
        <div className="flex justify-between items-center text-xs px-4 pt-1 pb-3 text-zinc-400">
          <span className="font-semibold text-white">13:40</span>
          <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span>
          </div>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">4G 46%</span>
        </div>

        {/* Club Header */}
        <div className={`${isDayPass ? 'bg-amber-600' : 'bg-red-600'} -mx-4 -mt-1 px-4 py-3 flex items-center justify-between text-white shadow-md transition-colors`}>
          <div className="flex items-center gap-2">
            <div className="p-1 hover:bg-black/20 rounded-lg cursor-pointer">
              <span className="block w-4 h-0.5 bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight leading-tight">{activeTenant.name}</h2>
              <p className="text-[10px] text-white/80">{activeTenant.location}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
            isDayPass ? 'bg-black/40 text-amber-200' : 'bg-red-800/80 text-white'
          }`}>
            {isDayPass ? '1-DAY PASS' : 'VIP'}
          </span>
        </div>

        {/* Toast Notification */}
        {photoToast && (
          <div className="mx-2 mt-2 bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-xl text-center text-xs font-bold text-emerald-300">
            {photoToast}
          </div>
        )}

        {/* Scrollable Container */}
        <div className="space-y-4 pt-3 pb-6 text-zinc-100 max-h-[640px] overflow-y-auto pr-1">

          {/* Member Card Profile (Tap Photo to Update/Snap) */}
          <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setIsCameraOpen(true)}
                className="relative cursor-pointer group flex-shrink-0"
                title="Tap to snap selfie or change photo"
              >
                <div className={`w-12 h-12 rounded-full border-2 ${isDayPass ? 'border-amber-500' : 'border-red-500'} overflow-hidden bg-zinc-800 flex items-center justify-center relative shadow-md`}>
                  <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition">
                    <Camera className="w-4 h-4 text-white" />
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
                  {isExpired ? <Clock className="w-3 h-3 text-red-400" /> : isDayPass ? <Clock className="w-3 h-3 text-amber-400" /> : <CheckCircle2 className="w-3 h-3" />}
                  <span>
                    {isExpired
                      ? `Expired on ${member.subscriptionEndDate}`
                      : isDayPass
                      ? `Valid Today • Expires at 11:59 PM`
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

          {/* Digital Access Badge (Barcode / QR - Tap to Scan) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold uppercase tracking-wider text-[10px]">Digital Access Badge</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">Tap to Brighten</span>
            </div>

            {/* High Contrast Barcode */}
            <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
              <div className="flex items-center justify-center gap-[2.5px] h-12 w-full">
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
                ⚠️ Single-Day Pass • Valid Today Until 11:59 PM
              </div>
            )}

            <p className="text-[11px] text-zinc-400">Hold near counter scanner or turnstile to clock in</p>
          </div>

          {/* Quick Action Icons Grid (All 4 Fully Functional) */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div
              onClick={() => setShowScanModal(true)}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition active:scale-95"
            >
              <QrCode className="w-5 h-5 text-red-500" />
              <span className="font-medium text-zinc-300">Scan</span>
            </div>

            <div
              onClick={() => setShowPtModal(true)}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-blue-500 cursor-pointer transition active:scale-95"
            >
              <Dumbbell className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-zinc-300">PT Book</span>
            </div>

            <div
              onClick={() => setShowReferModal(true)}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-purple-500 cursor-pointer transition active:scale-95"
            >
              <Users className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-zinc-300">Refer</span>
            </div>

            <div
              onClick={() => renewMember(member.id, 'plan_monthly_vip', 'paystack_online')}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-emerald-500 cursor-pointer transition active:scale-95"
            >
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-emerald-400">Renew</span>
            </div>
          </div>

          {/* CTA: Book a PT Session Button */}
          <button
            onClick={() => setShowPtModal(true)}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dumbbell className="w-4 h-4" />
            Book a PT Session ({member.remainingPtSessions} Left)
          </button>

          {/* Attendance Visit History Calendar */}
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

            {/* Calendar Grid (Mon to Sun) */}
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
                    className={`p-1 rounded-xl flex flex-col items-center justify-center min-h-[32px] transition ${
                      isToday
                        ? 'bg-red-500/20 border border-red-500/50 text-white font-black'
                        : visited || pt
                        ? 'bg-zinc-800/80 text-white'
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
                "You've crushed {member.totalVisitsThisMonth} workouts this month! Coach Tunde recommends hitting lower body tomorrow to keep your consistency streak going."
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ----------------- MODAL 1: SCAN (Self Check-in & Zoom Barcode) ----------------- */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl">
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
                <div className="relative w-52 h-52 mx-auto bg-zinc-900 border-2 border-red-500/60 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-inner">
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                  <div className="absolute w-full h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]"></div>
                  <ScanLine className="w-10 h-10 text-zinc-600 mb-2" />
                  <p className="text-[11px] font-bold text-zinc-300">Point at Counter QR</p>
                  <p className="text-[9px] text-zinc-500">{activeTenant.name}</p>
                </div>

                <p className="text-xs text-zinc-400">
                  Scan the counter QR code at the desk to clock in instantly.
                </p>

                <button
                  onClick={handleSelfCheckInTrigger}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  ⚡ Tap to Clock In (Simulate Desk Scan)
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="bg-white p-4 rounded-2xl space-y-2 shadow-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">High Contrast Laser Pass</p>
                  <div className="w-36 h-36 mx-auto bg-black p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-[3px] h-10 w-full pt-1">
                    <span className="w-2 h-full bg-black"></span><span className="w-4 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-3 h-full bg-black"></span>
                    <span className="w-1.5 h-full bg-black"></span><span className="w-5 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                  </div>
                  <p className="font-mono font-black text-black text-xs tracking-widest">{member.memberCode}</p>
                </div>
                <p className="text-xs text-zinc-400">Hold near scanner or counter to enter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: REFER A WORKOUT BUDDY ----------------- */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl">
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

            <div className="bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 p-4 rounded-2xl text-center space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Gym Loyalty Program</p>
              <h4 className="font-black text-base text-white">Give ₦2,000 Off, Get 5 Free Days! 🔥</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Invite your friends to workout at <strong>{activeTenant.name}</strong>. When they sign up using your code, they get ₦2,000 off, and you get 5 free workout days!
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center">Your Unique Referral Code</p>
              <div className="bg-black border border-purple-500/50 p-2.5 rounded-xl text-center">
                <span className="font-mono font-black text-xl text-purple-300 tracking-wider">#{member.memberCode}</span>
              </div>
            </div>

            <div className="space-y-2">
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

            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Your Referral Stats:</span>
              <span className="font-bold text-white">0 Friends • 0 Days Earned</span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: PT BOOKING ----------------- */}
      {showPtModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-xs w-full text-white space-y-4">
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
                <h4 className="font-bold text-sm text-emerald-400">PT Session Booked!</h4>
                <p className="text-xs text-zinc-400">Coach Tunde has been notified on WhatsApp for Friday, 6:00 PM.</p>
                <button
                  onClick={() => {
                    setPtBooked(false);
                    setShowPtModal(false);
                  }}
                  className="w-full py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white mt-2 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400">Select Date & Time:</label>
                  <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1">
                    <option>Tomorrow (Friday) — 07:00 AM</option>
                    <option>Tomorrow (Friday) — 06:00 PM</option>
                    <option>Saturday — 08:30 AM</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400">Workout Focus:</label>
                  <select className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1">
                    <option>Upper Body Strength & Hypertrophy</option>
                    <option>Leg Day & Core Stability</option>
                    <option>HIIT Fat Burn Conditioning</option>
                  </select>
                </div>
                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                  Deducts <strong className="text-white">1 session</strong> from your VIP balance (3 remaining).
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
          setPhotoToast('✓ Profile photo updated!');
          setTimeout(() => setPhotoToast(null), 3000);
        }}
        title="Snap Member Selfie"
        subtitle="Align face to update your digital pass"
      />

    </div>
  );
}
