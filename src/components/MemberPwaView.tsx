'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { QrCode, Calendar, Dumbbell, Users, CreditCard, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export function MemberPwaView() {
  const { members, renewMember } = useGym();
  // We showcase Abiodun Oludolapo (#124253) from the screenshots!
  const member = members.find((m) => m.memberCode === '124253') || members[0];
  const [showPtModal, setShowPtModal] = useState(false);
  const [ptBooked, setPtBooked] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-4">
      
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

        {/* Club Header (Red banner matching i-Fitness Screenshot 2 & 3) */}
        <div className="bg-red-600 -mx-4 -mt-1 px-4 py-3 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-1 hover:bg-red-700 rounded-lg cursor-pointer">
              <span className="block w-4 h-0.5 bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-white"></span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight leading-tight">FitLedger Gym Ikorodu</h2>
              <p className="text-[10px] text-red-100">138 Ikorodu - Shagamu Road</p>
            </div>
          </div>
          <span className="text-[10px] bg-red-800/80 px-2 py-0.5 rounded-full font-bold">VIP</span>
        </div>

        {/* Scrollable Container */}
        <div className="space-y-4 pt-3 pb-6 text-zinc-100 max-h-[640px] overflow-y-auto pr-1">

          {/* Member Card Profile (Matching Screenshot 1) */}
          <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-red-500 overflow-hidden bg-zinc-800 flex-shrink-0">
                <img src={member.photoUrl} alt="Abiodun" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white leading-tight">{member.fullName}</h3>
                <p className="text-xs text-zinc-400 font-mono">#{member.memberCode}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active until {member.subscriptionEndDate}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-xl font-bold border border-zinc-700">
              Monthly VIP
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
                {member.memberCode}-ABIODUN-VIP
              </p>
            </div>
            <p className="text-[11px] text-zinc-400">Hold near counter scanner or turnstile to clock in</p>
          </div>

          {/* Quick Action Icons Grid (Matching Screenshot 3) */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition">
              <QrCode className="w-5 h-5 text-red-500" />
              <span className="font-medium text-zinc-300">Scan</span>
            </div>
            <div
              onClick={() => setShowPtModal(true)}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition"
            >
              <Dumbbell className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-zinc-300">PT Book</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-zinc-300">Refer</span>
            </div>
            <div
              onClick={() => renewMember(member.id, 'plan_monthly_vip', 'paystack_online')}
              className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-red-500 cursor-pointer transition"
            >
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-zinc-300">Renew</span>
            </div>
          </div>

          {/* CTA: Book a PT Session Button (Red Pill like Screenshot 3) */}
          <button
            onClick={() => setShowPtModal(true)}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <Dumbbell className="w-4 h-4" />
            Book a PT Session ({member.remainingPtSessions} Left)
          </button>

          {/* Attendance Visit History Calendar (Matching Screenshot 2 & 3) */}
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

              {/* Offset for Oct 1, 2026 (Thursday -> 3 empty slots) */}
              <div className="p-1"></div>
              <div className="p-1"></div>
              <div className="p-1"></div>

              {daysInOctober.map((day) => {
                const visited = isVisitDay(day);
                const pt = isPtDay(day);
                const isToday = day === 22;

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

            {/* Consistency Badge */}
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Visits This Month:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{member.totalVisitsThisMonth} Workouts 🔥</span>
            </div>
          </div>

          {/* 2026 AI Motivator Widget (Something i-Fitness doesn't have) */}
          <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/20 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Coach Insights</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                "You've crushed 3 workouts this week! Coach Tunde recommends hitting lower body tomorrow to keep your consistency streak going."
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Book PT Session Modal */}
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
                  className="w-full py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white mt-2"
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
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-md shadow-red-600/20"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
