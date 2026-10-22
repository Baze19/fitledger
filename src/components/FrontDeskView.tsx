'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { ManualOverrideModal } from '@/components/ManualOverrideModal';
import { Member, Transaction } from '@/types';
import { Search, QrCode, UserPlus, CheckCircle2, XCircle, AlertTriangle, CreditCard, Banknote, ShieldAlert } from 'lucide-react';

export function FrontDeskView() {
  const {
    activeScanResult,
    checkInMember,
    registerMember,
    renewMember,
    activeStaff,
    shiftSummary,
    checkIns,
    plans,
    members,
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [overrideModalMember, setOverrideModalMember] = useState<Member | null>(null);

  // Registration Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlanId, setNewPlanId] = useState(plans[1].id);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Transaction['paymentMethod']>('bank_transfer');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    checkInMember(searchQuery, 'phone_lookup');
  };

  const handleScanQuick = (code: string) => {
    setSearchQuery(code);
    checkInMember(code, 'qr_scan');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone) return;

    const newMem = registerMember({
      fullName: newFullName,
      phoneNumber: newPhone,
      planId: newPlanId,
      paymentMethod: newPaymentMethod,
    });

    setRegSuccess(`✓ Registered ${newMem.fullName} (#${newMem.memberCode})! Digital pass sent to WhatsApp ${newMem.phoneNumber}`);
    setNewFullName('');
    setNewPhone('');
    setTimeout(() => setRegSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Shift Live Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-xs text-zinc-400">
              Shift Active: <strong className="text-white">{activeStaff.fullName}</strong> • Started at {shiftSummary.shiftStartTime}
            </p>
            <p className="text-xs text-zinc-500">
              {checkIns.length} check-ins processed • {shiftSummary.overridesCount} overrides flagged
            </p>
          </div>
        </div>

        {/* Shift Cash Tally */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px]">CASH IN DRAWER</span>
            <span className="font-extrabold text-amber-400">₦{shiftSummary.cashExpected.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px]">POS SLIPS</span>
            <span className="font-extrabold text-purple-400">₦{shiftSummary.posExpected.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px]">TRANSFERS</span>
            <span className="font-extrabold text-blue-400">₦{shiftSummary.transferExpected.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Search, Scan Result & Live Stream */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Quick Counter Search Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-red-500" />
                Rapid Member Check-In Counter (Sub-2s)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Press Enter to Validate</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan pass or enter phone/member code (e.g. 124253 or Abiodun)..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/20"
              >
                Validate
              </button>
            </form>

            {/* Demo Quick Scan Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[10px] text-zinc-500">Quick Test Scans:</span>
              <button
                onClick={() => handleScanQuick('124253')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Abiodun #124253 (Active VIP)
              </button>
              <button
                onClick={() => handleScanQuick('108741')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Emeka #108741 (Expired)
              </button>
              <button
                onClick={() => handleScanQuick('119842')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tunde #119842 (Quarterly)
              </button>
            </div>
          </div>

          {/* Verification Feedback Card */}
          {activeScanResult.status === 'allowed' && activeScanResult.member && (
            <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border-2 border-emerald-500/80 rounded-3xl p-6 shadow-xl shadow-emerald-500/10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-emerald-500 overflow-hidden relative flex-shrink-0 shadow-md">
                  <img src={activeScanResult.member.photoUrl} alt="Member" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-center text-[9px] font-black uppercase text-white py-0.5">
                    VERIFIED
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-black text-white">{activeScanResult.member.fullName}</h3>
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                      #{activeScanResult.member.memberCode}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE PLAN
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Expiry Date: <strong className="text-white">{activeScanResult.member.subscriptionEndDate}</strong> ({activeScanResult.message})
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">Total Visits</p>
                      <p className="text-base font-black text-emerald-400">{activeScanResult.member.totalVisitsThisMonth} this month</p>
                    </div>
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">PT Sessions</p>
                      <p className="text-base font-black text-blue-400">{activeScanResult.member.remainingPtSessions} Remaining</p>
                    </div>
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">Locker Number</p>
                      <p className="text-base font-black text-white">{activeScanResult.member.lockerNumber || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeScanResult.status === 'denied' && activeScanResult.member && (
            <div className="bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 border-2 border-red-500 rounded-3xl p-6 shadow-xl shadow-red-500/10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-red-500 overflow-hidden relative flex-shrink-0 grayscale">
                  <img src={activeScanResult.member.photoUrl} alt="Member" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 text-center text-[9px] font-black uppercase text-white py-0.5">
                    EXPIRED
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-black text-white">{activeScanResult.member.fullName}</h3>
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                      #{activeScanResult.member.memberCode}
                    </span>
                    <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> SUBSCRIPTION EXPIRED
                    </span>
                  </div>

                  <p className="text-xs text-red-400 font-medium">
                    Expired on {activeScanResult.member.subscriptionEndDate}. Due renewal balance: <strong>₦30,000</strong>.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <button
                      onClick={() => renewMember(activeScanResult.member!.id, 'plan_monthly_std', 'pos_card')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <CreditCard className="w-4 h-4" /> 1-Click Renew (Collect ₦30,000)
                    </button>

                    <button
                      onClick={() => setOverrideModalMember(activeScanResult.member!)}
                      className="px-4 py-2 bg-red-950/60 border border-red-700/60 hover:bg-red-900/60 text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400" /> Manual Override (Audited)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeScanResult.status === 'not_found' && (
            <div className="bg-zinc-900 border border-amber-500/40 p-4 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>{activeScanResult.message}</p>
            </div>
          )}

          {/* Live Check-in Activity Feed */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Live Front-Desk Access Log</h4>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">● Real-time</span>
            </div>

            <div className="divide-y divide-zinc-800 text-xs max-h-56 overflow-y-auto pr-1">
              {checkIns.map((chk) => (
                <div key={chk.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        chk.status === 'allowed' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-white">{chk.memberName}</span>
                      <span className="text-zinc-500 font-mono text-[10px] ml-1.5">#{chk.memberCode}</span>
                      <span className="text-zinc-400 text-[10px] ml-2">({chk.method.replace('_', ' ')})</span>
                      {chk.denialReason && (
                        <span className="block text-[10px] text-red-400">{chk.denialReason}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">{chk.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Rapid 45-Second Member Registration Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-red-500" />
                New Member Registration
              </h3>
              <p className="text-[11px] text-zinc-400">Rapid 45-second counter signup</p>
            </div>
            <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">
              Sub-45s
            </span>
          </div>

          {regSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs">
              {regSuccess}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-zinc-300">Full Name</label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. Oluwaseun Adeleke"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-300">Phone Number (WhatsApp identifier)</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="0803 123 4567"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-300">Select Plan</label>
              <select
                value={newPlanId}
                onChange={(e) => setNewPlanId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white mt-1 focus:outline-none"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₦{p.price.toLocaleString()} ({p.durationDays}d)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-300">Payment Channel</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'bank_transfer', label: 'Bank Transfer' },
                  { id: 'pos_card', label: 'POS Terminal' },
                  { id: 'cash', label: 'Cash in Hand' },
                  { id: 'paystack_online', label: 'Paystack Link' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`border rounded-xl p-2 flex items-center gap-2 cursor-pointer transition ${
                      newPaymentMethod === item.id
                        ? 'bg-red-600/10 border-red-500 text-white font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="regPaymentMethod"
                      value={item.id}
                      checked={newPaymentMethod === item.id}
                      onChange={() => setNewPaymentMethod(item.id as Transaction['paymentMethod'])}
                      className="accent-red-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/20 mt-2"
            >
              ⚡ Complete & Send WhatsApp Digital Pass
            </button>
          </form>
        </div>

      </div>

      {/* Manual Override Modal */}
      {overrideModalMember && (
        <ManualOverrideModal
          isOpen={true}
          member={overrideModalMember}
          onClose={() => setOverrideModalMember(null)}
        />
      )}

    </div>
  );
}
