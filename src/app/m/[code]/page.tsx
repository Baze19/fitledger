'use client';

import React, { useState, Suspense } from 'react';
import { useGym } from '@/context/gym-context';
import { useParams } from 'next/navigation';
import { QrCode, Calendar, Dumbbell, Users, CreditCard, CheckCircle2, Sparkles, ArrowLeft, Zap } from 'lucide-react';
import { initializePaystackPayment } from '@/lib/paystack';
import Link from 'next/link';

function MemberPassContent() {
  const params = useParams();
  const code = (params?.code as string) || '124253';
  const { members, renewMember } = useGym();

  const member = members.find((m) => m.memberCode === code) || members[0];
  const [showPtModal, setShowPtModal] = useState(false);
  const [ptBooked, setPtBooked] = useState(false);

  const handleMemberPaystackRenewal = () => {
    initializePaystackPayment({
      email: member.email || 'member@fitledger.ng',
      amountInNaira: 30000,
      fullName: member.fullName,
      planName: 'VIP All-Access Monthly Pass Renewal',
      gymName: 'FitZone Elite Fitness',
      onSuccess: (ref) => {
        renewMember(member.id, 'plan_monthly_vip', 'paystack_online');
        alert(`✓ Payment Confirmed via Paystack!\n\nRef: ${ref}\nYour VIP Membership has been extended by 30 days!`);
      },
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

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans">
      
      {/* Mobile Shell */}
      <div className="w-full max-w-md min-h-screen bg-black border-x border-zinc-900 flex flex-col justify-between relative">
        
        <div>
          {/* iOS Status Bar */}
          <div className="flex justify-between items-center text-xs px-5 pt-3 pb-2 text-zinc-400">
            <span className="font-semibold text-white">13:40</span>
            <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto"></div>
            <span className="font-semibold text-emerald-400">4G 46%</span>
          </div>

          {/* Red Club Header (Matching i-Fitness Screenshot 2) */}
          <div className="bg-red-600 px-4 py-3 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="p-1 hover:bg-red-700 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight leading-tight">FitLedger Gym Ikorodu</h1>
                <p className="text-[10px] text-red-100">138 Ikorodu - Shagamu Road</p>
              </div>
            </div>
            <span className="text-[10px] bg-red-800/80 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              VIP PASS
            </span>
          </div>

          {/* Mobile Body */}
          <div className="p-4 space-y-4">
            
            {/* Member Profile Card (Matching Screenshot 1) */}
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-red-500 overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
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
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-xl font-bold border border-zinc-700">
                Monthly VIP
              </span>
            </div>

            {/* High Contrast Digital Barcode (Tap to Scan - Screenshot 3) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold uppercase tracking-wider text-[10px]">Access Badge</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">Auto Brightness Active</span>
              </div>

              {/* Barcode */}
              <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center justify-center gap-[2.5px] h-14 w-full">
                  <span className="w-1.5 h-full bg-black"></span><span className="w-3 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-2 h-full bg-black"></span>
                  <span className="w-1 h-full bg-black"></span><span className="w-4 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                  <span className="w-3 h-full bg-black"></span><span className="w-1.5 h-full bg-black"></span><span className="w-2.5 h-full bg-black"></span><span className="w-1 h-full bg-black"></span>
                  <span className="w-4 h-full bg-black"></span><span className="w-1 h-full bg-black"></span><span className="w-2 h-full bg-black"></span><span className="w-3 h-full bg-black"></span>
                </div>
                <p className="text-[11px] font-mono font-black text-black tracking-widest">
                  {member.memberCode}-ABIODUN-VIP
                </p>
              </div>
              <p className="text-[11px] text-zinc-400">Hold near scanner or counter to enter</p>
            </div>

            {/* Quick Actions (Screenshot 3) */}
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
                onClick={handleMemberPaystackRenewal}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:border-emerald-500 cursor-pointer transition"
              >
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-emerald-400">Paystack</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowPtModal(true)}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              Book a PT Session ({member.remainingPtSessions} Left)
            </button>

            {/* Attendance Calendar (October 2026 - Screenshot 2 & 3) */}
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
                  const isToday = day === 22;

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

            {/* AI Coach Nudge */}
            <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/20 p-3.5 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">AI Coach Insights</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                  "You've crushed 3 workouts this week! Coach Tunde recommends hitting lower body tomorrow to keep your streak going."
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* PT Modal */}
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
                  <h4 className="font-bold text-sm text-emerald-400">Session Confirmed!</h4>
                  <p className="text-xs text-zinc-400">Coach Tunde has been notified on WhatsApp for Friday, 6:00 PM.</p>
                  <button
                    onClick={() => {
                      setPtBooked(false);
                      setShowPtModal(false);
                    }}
                    className="w-full py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white mt-2"
                  >
                    Done
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
