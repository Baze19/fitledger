'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Lock,
  Smartphone,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface ShiftCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockTerminal?: () => void;
}

export function ShiftCloseModal({ isOpen, onClose, onLockTerminal }: ShiftCloseModalProps) {
  const {
    activeTenant,
    activeStaff,
    shiftSummary,
    closeShift,
    transactions,
    checkIns,
    staffList,
  } = useGym();

  const [closeMode, setCloseMode] = useState<'end_of_day' | 'handover'>('end_of_day');
  const [cashCountedInput, setCashCountedInput] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [incomingStaffId, setIncomingStaffId] = useState(
    staffList.find((s) => s.id !== activeStaff.id)?.id || ''
  );
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [result, setResult] = useState<{
    discrepancy: number;
    isBalanced: boolean;
    lockedAt: string;
    totalRevenue: number;
    cashExpected: number;
    countedCash: number;
    reportText: string;
    whatsAppUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const counted = Number(cashCountedInput) || 0;
  const currentDiscrepancy = counted - shiftSummary.cashExpected;

  // Real-time breakdown calculations
  const cashTxCount = transactions.filter((t) => t.paymentMethod === 'cash').length;
  const posTxCount = transactions.filter((t) => t.paymentMethod === 'pos_card').length;
  const digitalTxCount = transactions.filter(
    (t) => t.paymentMethod === 'bank_transfer' || t.paymentMethod === 'paystack_online'
  ).length;

  const dayPassCount = transactions.filter(
    (t) => t.planName?.toLowerCase().includes('day') || t.planName?.toLowerCase().includes('pass')
  ).length;
  const renewalCount = transactions.filter(
    (t) => t.planName && !t.planName.toLowerCase().includes('day')
  ).length;
  const retailCount = transactions.filter((t) => !t.planName).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify PIN matches active staff or default master PIN
    if (enteredPin && enteredPin !== activeStaff.pin && enteredPin !== '2045') {
      alert(`Invalid PIN. Please enter your 4-digit staff PIN (Default: ${activeStaff.pin || '2045'}).`);
      return;
    }

    const res = closeShift(counted);
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const nowDate = new Date().toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Clean Nigerian Owner Phone Number for WhatsApp URL
    const rawPhone = activeTenant.ownerPhone || '08023456789';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const internationalPhone = cleanPhone.startsWith('0')
      ? `234${cleanPhone.slice(1)}`
      : cleanPhone.startsWith('234')
      ? cleanPhone
      : `234${cleanPhone}`;

    const balanceHeadline = res.isBalanced
      ? '🟢 PERFECT ZERO-VARIANCE (Balanced to the Kobo)'
      : res.discrepancy < 0
      ? `🚨 CASH SHORTAGE DEFICIT: -₦${Math.abs(res.discrepancy).toLocaleString()}`
      : `⚠️ SURPLUS DECLARED: +₦${res.discrepancy.toLocaleString()}`;

    const report = [
      `🏛️ *FITLEDGER DAILY SETTLEMENT REPORT*`,
      `📍 *Gym:* ${activeTenant.name}`,
      `📅 *Date:* ${nowDate} • ${nowTime}`,
      `👤 *Closed By:* ${activeStaff.fullName} (${activeStaff.role.toUpperCase()})`,
      closeMode === 'handover'
        ? `🤝 *Handed Over To:* ${staffList.find((s) => s.id === incomingStaffId)?.fullName || 'Next Shift'}`
        : `🌙 *Type:* End-of-Day Terminal Close (Single Receptionist)`,
      ``,
      `💰 *FINANCIAL AUDIT LEDGER:*`,
      `• *Total Gross Revenue:* ₦${shiftSummary.totalRevenue.toLocaleString()}`,
      `• *Paystack / Bank Transfers:* ₦${shiftSummary.transferExpected.toLocaleString()} (Direct Bank)`,
      `• *POS Terminal Card Slips:* ₦${shiftSummary.posExpected.toLocaleString()} (${posTxCount} slips)`,
      `• *Cash Drawer Expected:* ₦${shiftSummary.cashExpected.toLocaleString()} (${cashTxCount} cash receipts)`,
      ``,
      `💵 *PHYSICAL DRAWER COUNT:*`,
      `• *Counted Cash:* ₦${counted.toLocaleString()}`,
      `• *Variance:* ₦${res.discrepancy.toLocaleString()}`,
      `• *Status:* ${balanceHeadline}`,
      closingNotes ? `📝 *Staff Note:* "${closingNotes}"` : null,
      ``,
      `📊 *COUNTER & FLOOR ACTIVITY:*`,
      `• Member Check-ins: ${checkIns.length} visits`,
      `• Walk-in Day Passes: ${dayPassCount}`,
      `• Plan Renewals / Registrations: ${renewalCount}`,
      `• Pro-Shop Retail Drinks Sold: ${retailCount} items`,
      ``,
      `🔐 *Audit Status:* Permanently logged & encrypted on Supabase Cloud.`,
      `_Generated automatically by FitLedger OS — Anti-Theft Protection._`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsAppUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(report)}`;

    setResult({
      discrepancy: res.discrepancy,
      isBalanced: res.isBalanced,
      lockedAt: `${nowDate} at ${nowTime}`,
      totalRevenue: shiftSummary.totalRevenue,
      cashExpected: shiftSummary.cashExpected,
      countedCash: counted,
      reportText: report,
      whatsAppUrl,
    });
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.reportText);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full text-white shadow-2xl relative overflow-hidden my-auto animate-fade-in">
        
        {/* Subtle Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"></div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
              🔒
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
                <span>{closeMode === 'end_of_day' ? 'End-of-Day Drawer Close' : 'Shift Cash Handover'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                  Anti-Theft Protocol
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeTenant.name} • On Duty: <strong className="text-white">{activeStaff.fullName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {!result ? (
            <>
              {/* Mode Selector: Lone Receptionist vs Two-Shift Gym */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCloseMode('end_of_day')}
                  className={`py-2.5 px-3 rounded-xl transition cursor-pointer text-center ${
                    closeMode === 'end_of_day'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🌙 Single Receptionist Close (8:30 PM)
                </button>
                <button
                  type="button"
                  onClick={() => setCloseMode('handover')}
                  className={`py-2.5 px-3 rounded-xl transition cursor-pointer text-center ${
                    closeMode === 'handover'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🤝 Shift Handover (To Colleague)
                </button>
              </div>

              {/* Explanatory Context Pill */}
              <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80">
                {closeMode === 'end_of_day' ? (
                  <>
                    💡 <strong>Owner Verification Guarantee:</strong> FitLedger locks today&apos;s financial tally and instantly drafts a verified settlement report for <strong>{activeTenant.ownerName}</strong> via WhatsApp. Any cash deficit is permanently logged.
                  </>
                ) : (
                  <>
                    💡 <strong>Peer Verification Guarantee:</strong> The incoming receptionist counts the drawer cash before accepting the shift to avoid inheriting missing funds.
                  </>
                )}
              </p>

              {/* System Calculated Ledger Breakdown */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    System Expected Gross Revenue
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    ₦{shiftSummary.totalRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">Bank / Online</span>
                    <span className="text-sm font-black text-blue-400">
                      ₦{shiftSummary.transferExpected.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">Paystack + Transfer</span>
                  </div>

                  <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">POS Slips</span>
                    <span className="text-sm font-black text-purple-400">
                      ₦{shiftSummary.posExpected.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-zinc-500 block mt-0.5">{posTxCount} Card Slips</span>
                  </div>

                  <div className="bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/40">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">Cash In Drawer</span>
                    <span className="text-sm font-black text-amber-300">
                      ₦{shiftSummary.cashExpected.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-amber-400/80 block mt-0.5">Must match count</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <span>
                    Visits: <strong className="text-zinc-200">{checkIns.length}</strong>
                  </span>
                  <span>
                    Day Passes: <strong className="text-zinc-200">{dayPassCount}</strong>
                  </span>
                  <span>
                    Renewals: <strong className="text-zinc-200">{renewalCount}</strong>
                  </span>
                  <span>
                    Retail Drinks: <strong className="text-zinc-200">{retailCount}</strong>
                  </span>
                </div>
              </div>

              {/* Form Input: Blind Cash Count */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <span>Physical Cash Counted in Drawer (₦):</span>
                      <span className="text-red-400 font-black">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setCashCountedInput(shiftSummary.cashExpected.toString())}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                    >
                      Fill Exact (₦{shiftSummary.cashExpected.toLocaleString()})
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-zinc-400 font-bold text-lg">₦</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="100"
                      value={cashCountedInput}
                      onChange={(e) => setCashCountedInput(e.target.value)}
                      placeholder="e.g. 21500"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-3 text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-wide"
                    />
                  </div>

                  {/* Live Variance Calculation Badge */}
                  {cashCountedInput !== '' && (
                    <div className="mt-2">
                      {currentDiscrepancy === 0 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Exact Match (₦0.00 Variance) — Drawer is 100% Balanced!</span>
                        </div>
                      ) : currentDiscrepancy < 0 ? (
                        <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>
                            Cash Shortage: <strong>-₦{Math.abs(currentDiscrepancy).toLocaleString()}</strong>. Flagged on Owner&apos;s WhatsApp report.
                          </span>
                        </div>
                      ) : (
                        <div className="bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-bold">
                          <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
                          <span>
                            Cash Surplus: <strong>+₦{currentDiscrepancy.toLocaleString()}</strong>. Excess cash recorded in ledger.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Handover Specific: Incoming Staff */}
                {closeMode === 'handover' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Incoming Staff Taking Over Drawer:
                    </label>
                    <select
                      value={incomingStaffId}
                      onChange={(e) => setIncomingStaffId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {staffList
                        .filter((s) => s.id !== activeStaff.id)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.role.toUpperCase()})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Closing Notes / Audit Remark (Optional):
                  </label>
                  <input
                    type="text"
                    value={closingNotes}
                    onChange={(e) => setClosingNotes(e.target.value)}
                    placeholder="e.g. ₦5,000 taken by Owner for diesel pump, ₦500 torn note kept"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Staff PIN Authorization */}
                <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enter Staff PIN to Sign Audit:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setEnteredPin(activeStaff.pin || '2045')}
                      className="text-[10px] text-zinc-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      Auto-fill PIN ({activeStaff.pin || '2045'})
                    </button>
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-center font-mono text-xl tracking-widest text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Day & Generate Owner WhatsApp Report</span>
                </button>
              </form>
            </>
          ) : (
            /* Results Screen: The Owner WhatsApp Dispatch */
            <div className="space-y-5 pt-1 animate-fade-in">
              {result.isBalanced ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-black">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-emerald-400 text-lg">Perfect Shift Reconciliation!</h4>
                  <p className="text-xs text-zinc-300">
                    Counted <strong>₦{result.countedCash.toLocaleString()}</strong> cash matches the expected total with <strong>₦0.00 discrepancy</strong>.
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">Locked on {result.lockedAt}</p>
                </div>
              ) : (
                <div className="bg-red-500/15 border border-red-500/40 p-5 rounded-2xl text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center font-black">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-red-400 text-lg">Cash Discrepancy Flagged!</h4>
                  <p className="text-xs text-zinc-200">
                    Discrepancy: <span className="font-extrabold text-red-400">₦{result.discrepancy.toLocaleString()}</span>. Counted: ₦{result.countedCash.toLocaleString()} vs Expected: ₦{result.cashExpected.toLocaleString()}.
                  </p>
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    This variance is permanently sealed in the cloud audit trail.
                  </p>
                </div>
              )}

              {/* WhatsApp Action Card */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-600/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">Owner WhatsApp Dispatch</p>
                      <p className="text-[10px] text-zinc-400">
                        Recipient: <strong>{activeTenant.ownerName}</strong> ({activeTenant.ownerPhone})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ready
                  </span>
                </div>

                {/* Preformatted WhatsApp Preview Snippet */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-1 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {result.reportText}
                </div>

                {/* Dispatch Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={result.whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs transition shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Owner WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedWhatsApp ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedWhatsApp ? 'Copied to Clipboard!' : 'Copy Report Text'}</span>
                  </button>
                </div>
              </div>

              {/* Terminal Finish Action */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onLockTerminal) onLockTerminal();
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Terminal for the Night</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
