'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { ManualOverrideModal } from '@/components/ManualOverrideModal';
import { Member, Transaction, PaymentMethod } from '@/types';
import { initializePaystackPayment } from '@/lib/paystack';
import {
  Search,
  QrCode,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Banknote,
  ShieldAlert,
  ShoppingBag,
  Volume2,
  Sparkles,
  Zap,
  Receipt,
  Printer,
  Send,
} from 'lucide-react';

interface FrontDeskViewProps {
  onOpenShiftClose?: () => void;
}

export function FrontDeskView({ onOpenShiftClose }: FrontDeskViewProps = {}) {
  const {
    activeTenant,
    activeScanResult,
    checkInMember,
    registerMember,
    renewMember,
    activeStaff,
    shiftSummary,
    checkIns,
    plans,
    members,
    retailItems,
    sellRetailItem,
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [overrideModalMember, setOverrideModalMember] = useState<Member | null>(null);

  // Right column tab: 'register' | 'proshop'
  const [rightTab, setRightTab] = useState<'register' | 'proshop'>('register');

  // Registration Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlanId, setNewPlanId] = useState(plans[1]?.id || 'plan_monthly_std');
  const [newPaymentMethod, setNewPaymentMethod] = useState<Transaction['paymentMethod']>('bank_transfer');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Retail State
  const [selectedRetailItem, setSelectedRetailItem] = useState(retailItems[0]?.id || 'ret_energy');
  const [retailPayMethod, setRetailPayMethod] = useState<PaymentMethod>('cash');
  const [retailSuccess, setRetailSuccess] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<{
    txId: string;
    itemName: string;
    amount: number;
    paymentMethod: PaymentMethod;
    staffName: string;
    staffPin: string;
    timestamp: string;
  } | null>(null);

  // Audio synthesis using browser Web Audio API
  const playChime = (type: 'success' | 'error') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.15); // E3
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // AudioContext unavailable or restricted by browser
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = checkInMember(searchQuery, 'phone_lookup');
    if (res.success) {
      playChime('success');
    } else {
      playChime('error');
    }
  };

  const handleScanQuick = (code: string) => {
    setSearchQuery(code);
    const res = checkInMember(code, 'qr_scan');
    if (res.success) {
      playChime('success');
    } else {
      playChime('error');
    }
  };

  const handlePaystackDirectRenewal = (targetMember: Member) => {
    initializePaystackPayment({
      email: targetMember.email || 'member@fitledger.ng',
      amountInNaira: 30000,
      fullName: targetMember.fullName,
      planName: 'Monthly Access Pass Renewal',
      gymName: activeTenant.name,
      onSuccess: (ref) => {
        renewMember(targetMember.id, 'plan_monthly_std', 'paystack_online');
        playChime('success');
      },
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone) return;

    const plan = plans.find((p) => p.id === newPlanId) || plans[1];

    if (newPaymentMethod === 'paystack_online') {
      initializePaystackPayment({
        email: `${newFullName.toLowerCase().replace(/\s+/g, '.')}@gymmember.ng`,
        amountInNaira: plan.price,
        fullName: newFullName,
        planName: plan.name,
        gymName: activeTenant.name,
        onSuccess: (ref) => {
          const newMem = registerMember({
            fullName: newFullName,
            phoneNumber: newPhone,
            planId: newPlanId,
            paymentMethod: 'paystack_online',
          });
          playChime('success');
          setRegSuccess(`✓ Registered ${newMem.fullName} (#${newMem.memberCode}) via Paystack! Ref: ${ref}`);
          setNewFullName('');
          setNewPhone('');
          setTimeout(() => setRegSuccess(null), 5000);
        },
      });
      return;
    }

    const newMem = registerMember({
      fullName: newFullName,
      phoneNumber: newPhone,
      planId: newPlanId,
      paymentMethod: newPaymentMethod,
    });

    playChime('success');
    setRegSuccess(`✓ Registered ${newMem.fullName} (#${newMem.memberCode})! Digital pass sent to WhatsApp ${newMem.phoneNumber}`);
    setNewFullName('');
    setNewPhone('');
    setTimeout(() => setRegSuccess(null), 5000);
  };

  const handleRetailSale = (e: React.FormEvent) => {
    e.preventDefault();
    const item = retailItems.find((r) => r.id === selectedRetailItem);
    if (!item) return;

    if (retailPayMethod === 'paystack_online') {
      initializePaystackPayment({
        email: 'walkin@fitledger.ng',
        amountInNaira: item.price,
        fullName: `Walk-in Guest (${item.name})`,
        planName: item.name,
        gymName: activeTenant.name,
        onSuccess: (ref) => {
          const tx = sellRetailItem(item.id, 'paystack_online');
          playChime('success');
          setLastReceipt({
            txId: tx.reference,
            itemName: item.name,
            amount: item.price,
            paymentMethod: 'paystack_online',
            staffName: activeStaff.fullName,
            staffPin: activeStaff.pin,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          setRetailSuccess(`✓ Sold ${item.name} for ₦${item.price.toLocaleString()} via Paystack! Ref: ${ref}`);
        },
      });
      return;
    }

    const tx = sellRetailItem(item.id, retailPayMethod);
    playChime('success');
    setLastReceipt({
      txId: tx.reference,
      itemName: item.name,
      amount: item.price,
      paymentMethod: retailPayMethod,
      staffName: activeStaff.fullName,
      staffPin: activeStaff.pin,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setRetailSuccess(`✓ Sold ${item.name} for ₦${item.price.toLocaleString()} via ${retailPayMethod.toUpperCase()}! Cash in drawer updated.`);
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
              Counter Active: <strong className="text-white">{activeStaff.fullName}</strong> • Shift Started at {shiftSummary.shiftStartTime}
            </p>
            <p className="text-xs text-zinc-500">
              {checkIns.length} counter check-ins • {shiftSummary.overridesCount} overrides flagged in permanent audit
            </p>
          </div>
        </div>

        {/* Shift Cash Tally */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">CASH IN DRAWER</span>
            <span className="font-black text-amber-400 text-sm">₦{shiftSummary.cashExpected.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">POS SLIPS</span>
            <span className="font-black text-purple-400 text-sm">₦{shiftSummary.posExpected.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">TRANSFERS</span>
            <span className="font-black text-blue-400 text-sm">₦{shiftSummary.transferExpected.toLocaleString()}</span>
          </div>

          {onOpenShiftClose && (
            <button
              onClick={onOpenShiftClose}
              type="button"
              className="px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title="Close Day & Settle Drawer with Owner WhatsApp Report"
            >
              <span>🌙 Settle Drawer & End Day</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Search, Scan Result & Live Stream */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Quick Counter Search Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-red-500" />
                Rapid Counter Validator (Sub-2s)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Press Enter or Scan Barcode</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan pass barcode or enter member code/phone (e.g. 124253 or Abiodun)..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Validate
              </button>
            </form>

            {/* Quick Test Scans */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">1-Tap Scan Simulation:</span>
              <button
                onClick={() => handleScanQuick('124253')}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Abiodun #124253 (Active VIP Pass)</span>
              </button>
              <button
                onClick={() => handleScanQuick('108741')}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-red-500 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Emeka #108741 (Expired Subscription)</span>
              </button>
            </div>
          </div>

          {/* Verification Feedback Card (Active Pass) */}
          {activeScanResult.status === 'allowed' && activeScanResult.member && (
            <div className="bg-gradient-to-br from-emerald-950/50 via-zinc-900 to-zinc-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-emerald-500 overflow-hidden relative flex-shrink-0 shadow-lg">
                  <img src={activeScanResult.member.photoUrl} alt="Member" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-center text-[9px] font-black uppercase text-white py-0.5">
                    TURNSTILE OPENED
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-black text-white">{activeScanResult.member.fullName}</h3>
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                      #{activeScanResult.member.memberCode}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACCESS GRANTED
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Expiry Date: <strong className="text-white">{activeScanResult.member.subscriptionEndDate}</strong> ({activeScanResult.message})
                  </p>

                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-2xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">Total Visits</p>
                      <p className="text-base font-black text-emerald-400">{activeScanResult.member.totalVisitsThisMonth} this month</p>
                    </div>
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-2xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">PT Sessions</p>
                      <p className="text-base font-black text-blue-400">{activeScanResult.member.remainingPtSessions} Remaining</p>
                    </div>
                    <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-2xl text-center">
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">Locker</p>
                      <p className="text-base font-black text-white">{activeScanResult.member.lockerNumber || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Feedback Card (Expired Pass) */}
          {activeScanResult.status === 'denied' && activeScanResult.member && (
            <div className="bg-gradient-to-br from-red-950/50 via-zinc-900 to-zinc-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl shadow-red-500/10 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-red-500 overflow-hidden relative flex-shrink-0 grayscale shadow-lg">
                  <img src={activeScanResult.member.photoUrl} alt="Member" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-red-600 text-center text-[9px] font-black uppercase text-white py-0.5 animate-pulse">
                    ENTRY BLOCKED
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

                  <div className="flex flex-wrap gap-2.5 pt-3">
                    <button
                      onClick={() => handlePaystackDirectRenewal(activeScanResult.member!)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-yellow-300" /> Pay with Paystack (Card / USSD)
                    </button>

                    <button
                      onClick={() => renewMember(activeScanResult.member!.id, 'plan_monthly_std', 'pos_card')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" /> 1-Click Renew (Collect ₦30,000)
                    </button>

                    <button
                      onClick={() => setOverrideModalMember(activeScanResult.member!)}
                      className="px-4 py-2.5 bg-red-950/60 border border-red-700/60 hover:bg-red-900/60 text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400" /> Manual Override (Audited with PIN)
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Live Front-Desk Access Log</h4>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                ● Turnstile Sync Active
              </span>
            </div>

            <div className="divide-y divide-zinc-800 text-xs max-h-52 overflow-y-auto pr-1">
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

        {/* Right Column (1 Col): Toggle between Member Registration & Pro-Shop Retail POS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          
          <div>
            {/* Header Switcher */}
            <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800 gap-1 text-xs font-bold mb-4">
              <button
                onClick={() => setRightTab('register')}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  rightTab === 'register' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Signup</span>
              </button>
              <button
                onClick={() => setRightTab('proshop')}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  rightTab === 'proshop' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pro-Shop POS</span>
              </button>
            </div>

            {/* TAB A: 45-SECOND MEMBER SIGNUP */}
            {rightTab === 'register' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h3 className="font-extrabold text-sm text-white">Rapid 45s Member Registration</h3>
                  <p className="text-[11px] text-zinc-400">Issues digital WhatsApp barcode pass immediately</p>
                </div>

                {regSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs">
                    {regSuccess}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. Oluwaseun Adeleke"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="0803 123 4567"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Select Membership Plan</label>
                    <select
                      value={newPlanId}
                      onChange={(e) => setNewPlanId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl p-2.5 text-white focus:outline-none"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₦{p.price.toLocaleString()} ({p.durationDays}d)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
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
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition shadow-lg shadow-red-600/20 mt-2 cursor-pointer"
                  >
                    ⚡ Register & Issue WhatsApp Pass
                  </button>
                </form>
              </div>
            )}

            {/* TAB B: SQUARE/TOAST-STYLE QUICK RETAIL POS */}
            {rightTab === 'proshop' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <h3 className="font-extrabold text-sm text-white">Counter Retail & Daily Passes</h3>
                  <p className="text-[11px] text-zinc-400">Eliminates unrecorded cash from drinks and guest entries</p>
                </div>

                {retailSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs">
                    {retailSuccess}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-semibold text-zinc-300 text-xs block">Select Item to Sell:</label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {retailItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedRetailItem(item.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          selectedRetailItem === item.id
                            ? 'bg-red-600/15 border-red-500 text-white shadow-md'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <span className="font-bold block text-white text-xs">{item.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">Stock: {item.inStock} left</span>
                          </div>
                        </div>
                        <span className="font-mono font-black text-amber-400 text-xs">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 text-xs block mb-1">Customer Paid Via:</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {(['cash', 'pos_card', 'bank_transfer', 'paystack_online'] as PaymentMethod[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setRetailPayMethod(m)}
                        className={`py-2 rounded-xl border text-center font-bold text-[10px] transition cursor-pointer ${
                          retailPayMethod === m
                            ? 'bg-red-600 text-white border-red-500 shadow-md'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {m === 'cash' ? '💵 Cash' : m === 'pos_card' ? '💳 POS' : m === 'bank_transfer' ? '📱 Transfer' : '⚡ Paystack'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRetailSale}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  Confirm Sale & Log in Cash Drawer
                </button>

                {/* 1-Tap Digital Receipt & WhatsApp Share */}
                {lastReceipt && (
                  <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white">Receipt #{lastReceipt.txId}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">₦{lastReceipt.amount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const text = `*${activeTenant.name} - Official E-Receipt* 🧾\n\nRef: #${lastReceipt.txId}\nItem: ${lastReceipt.itemName}\nTotal: ₦${lastReceipt.amount.toLocaleString()}\nPayment: ${lastReceipt.paymentMethod.replace('_', ' ').toUpperCase()}\nCashier: ${lastReceipt.staffName} (PIN ${lastReceipt.staffPin})\nTime: ${lastReceipt.timestamp}\n\n_Thank you for training with us!_`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[11px] transition flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                        title="Print thermal counter slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-2xl text-[10px] text-zinc-500 font-mono text-center">
            Locked to Active Shift: {activeStaff.fullName} (PIN: {activeStaff.pin})
          </div>

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
