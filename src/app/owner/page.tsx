'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import {
  TrendingUp,
  ShieldAlert,
  Bot,
  Send,
  Users,
  DollarSign,
  UserPlus,
  KeyRound,
  Trash2,
  ExternalLink,
  Building,
  CheckCircle2,
  AlertCircle,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  AlertTriangle,
  FileCheck,
  Check,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function OwnerPage() {
  const {
    activeTenant,
    shiftSummary,
    auditLogs,
    askOwnerBot,
    activeStaff,
    checkIns,
    transactions,
    staffList,
    addStaff,
    deactivateStaff,
    members,
    isFounderImpersonating,
    exitImpersonation,
    updateOwnerPassword,
    activeOwner,
    bankTransfers,
    verifyTransferManually,
    trainerCommissions,
    payoutTrainer,
  } = useGym();

  const [activeTab, setActiveTab] = useState<'finance' | 'staff' | 'trainers' | 'churn' | 'members' | 'whatsapp'>('finance');

  // Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newOwnerPassword, setNewOwnerPassword] = useState('');
  const [confirmOwnerPassword, setConfirmOwnerPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'receptionist' | 'trainer' | 'manager'>('receptionist');
  const [newStaffPin, setNewStaffPin] = useState('5829');
  const [staffCreatedSuccess, setStaffCreatedSuccess] = useState<string | null>(null);

  // Manual Transfer Override PIN state
  const [overrideTransferId, setOverrideTransferId] = useState<string | null>(null);
  const [overridePin, setOverridePin] = useState('');
  const [overrideMsg, setOverrideMsg] = useState<string | null>(null);

  // Win-Back broadcast state
  const [winBackSuccess, setWinBackSuccess] = useState<string | null>(null);

  // WhatsApp Chat Simulator
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'bot',
      text: `Good day Chief! Here is the Gym Closing Summary for today:\n\n💰 Total Gross Revenue: ₦${shiftSummary.totalRevenue.toLocaleString()}\n• Bank Transfers: ₦${shiftSummary.transferExpected.toLocaleString()} (Direct API Verified)\n• POS Card: ₦${shiftSummary.posExpected.toLocaleString()} (OCR logged)\n• Cash in Drawer: ₦${shiftSummary.cashExpected.toLocaleString()}\n\n👥 Total Member Check-ins: ${checkIns.length} members\n⚠️ Staff Audit Overrides: ${shiftSummary.overridesCount} flags\n\nAsk me anything or tap one of the quick prompts below!`,
      time: '9:00 PM',
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      const botReply = askOwnerBot(q);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPhone) return;

    const staff = addStaff({
      fullName: newStaffName,
      phone: newStaffPhone,
      role: newStaffRole,
      pin: newStaffPin,
    });

    setStaffCreatedSuccess(
      `✓ Added ${staff.fullName} as ${staff.role.toUpperCase()}! Shift PIN: [${staff.pin}]. WhatsApp credentials dispatched to ${staff.phone}.`
    );

    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffPin(`${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAddStaffOpen(false);

    setTimeout(() => setStaffCreatedSuccess(null), 6000);
  };

  const handleConfirmTransferOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideTransferId || overridePin.length !== 4) return;

    verifyTransferManually(overrideTransferId, overridePin);
    setOverrideMsg('✓ Transfer manually approved. Recorded in permanent audit log with staff PIN.');
    setOverrideTransferId(null);
    setOverridePin('');
    setTimeout(() => setOverrideMsg(null), 4000);
  };

  // At-risk members (inactive > 10 days or expired)
  const atRiskMembers = members.filter(
    (m) => m.status === 'expired' || m.totalVisitsThisMonth < 4
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 space-y-6 font-sans">
      
      {/* Founder Root Debug Banner */}
      {isFounderImpersonating && (
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border border-purple-500/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-lg flex-shrink-0">
              👑
            </span>
            <div>
              <p className="font-extrabold text-white text-sm">Founder Root Access: Inspecting {activeTenant.name}</p>
              <p className="text-purple-300 text-[11px]">
                You are currently impersonating this gym workspace as Super Admin Abiodun. You can troubleshoot staff PINs, review audit logs, and simulate member check-ins.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            onClick={exitImpersonation}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl transition shadow-md shadow-purple-600/30 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            ← Return to Super Admin HQ
          </Link>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">{activeTenant.name}</h1>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Owner Executive Suite
                </span>
              </div>
              <p className="text-xs text-zinc-400">Owner: {activeTenant.ownerName} • {activeTenant.location}</p>
            </div>
          </div>
        </div>

        {/* Global Navigation Shortcuts */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <Link
            href="/terminal"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>🖥️ Front-Desk Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              setIsChangePasswordOpen(true);
              setPasswordChangeSuccess(null);
              setPasswordChangeError(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Password</span>
          </button>
          <Link
            href="/login"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-900 text-zinc-400 hover:text-red-300 transition flex items-center gap-1.5"
          >
            <span>Sign Out</span>
          </Link>
        </div>
      </div>

      {/* Internal Owner Tabs */}
      <div className="flex flex-wrap bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl gap-1 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'finance' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          1. Financials & Anti-Fake Alert
        </button>
        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'trainers' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
          <span>2. PT Commissions & Splits</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{trainerCommissions.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('churn')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'churn' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>3. At-Risk Churn Radar</span>
          <span className="bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded-full text-[10px] font-bold">{atRiskMembers.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'staff' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>4. Staff & Shift PINs</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{staffList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'members' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>5. Member Directory</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{members.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'whatsapp' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>6. WhatsApp AI Auditor</span>
        </button>
      </div>

      {staffCreatedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{staffCreatedSuccess}</span>
        </div>
      )}

      {overrideMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{overrideMsg}</span>
        </div>
      )}

      {winBackSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{winBackSuccess}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: FINANCIALS & ANTI-FAKE ALERT RECONCILER                 */}
      {/* ============================================================== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          
          {/* Revenue Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Gross Today</p>
              <p className="text-2xl font-black text-white">₦{shiftSummary.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Bank Transfers (Verified)</p>
              <p className="text-2xl font-black text-blue-400">₦{shiftSummary.transferExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">Direct Providus/Paystack settlement</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">POS Card Slips</p>
              <p className="text-2xl font-black text-purple-400">₦{shiftSummary.posExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">Logged terminal merchant receipts</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Cash in Drawer (Anti-Theft)</p>
              <p className="text-2xl font-black text-amber-400">₦{shiftSummary.cashExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">Staff on duty: <strong className="text-zinc-200">{activeStaff.fullName}</strong></p>
            </div>
          </div>

          {/* ANTI-FAKE ALERT BANK FEED (Nigerian Gym Solution) */}
          <div className="bg-zinc-900 border border-blue-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <h3 className="font-extrabold text-sm text-white">
                    Direct Bank Feed & Anti-Fake Alert Verification
                  </h3>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                    Providus Bank API Active
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Protects counter staff against fake SMS alerts. Every payment is checked directly against live bank settlement.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-[11px] text-zinc-400 font-mono">
                Dedicated Virtual Acc: <strong className="text-white">990234123</strong> (Wema/Providus)
              </div>
            </div>

            <div className="space-y-2.5">
              {bankTransfers.map((bt) => (
                <div
                  key={bt.id}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    bt.status === 'settled'
                      ? 'bg-zinc-950 border-zinc-800'
                      : 'bg-red-500/10 border-red-500/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">₦{bt.amount.toLocaleString()}</span>
                      <span className="text-zinc-400 font-semibold">• {bt.senderName}</span>
                      {bt.status === 'settled' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Settled in Bank
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> FAKE ALERT RISK: ₦0.00 SETTLED
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Source: <span className="text-zinc-300">{bt.bankName}</span> • Ref: <span className="font-mono text-zinc-500">{bt.reference}</span> • Time: {bt.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {bt.status === 'settled' ? (
                      <span className="text-emerald-400 text-[11px] font-mono">
                        {bt.settledAt || 'API Webhook Confirmed'}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setOverrideTransferId(bt.id);
                          setOverridePin('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-red-600/30"
                      >
                        Override / Clear at Desk
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Stream */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Staff Anti-Theft Audit Trail
                </h3>
                <p className="text-xs text-zinc-400">Permanent chronological log of front-desk actions</p>
              </div>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded font-mono font-bold">
                Uneditable Ledger
              </span>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl border space-y-1.5 transition ${
                    log.severity === 'alert'
                      ? 'bg-red-500/10 border-red-500/30'
                      : log.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-black ${
                        log.severity === 'alert'
                          ? 'text-red-400'
                          : log.severity === 'warning'
                          ? 'text-amber-400'
                          : 'text-zinc-200'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-zinc-300">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60 font-mono">
                    <span>Staff Actor: {log.actorStaffName}</span>
                    <span>Log ID: {log.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PERSONAL TRAINER (PT) COMMISSIONS & SPLITS              */}
      {/* ============================================================== */}
      {activeTab === 'trainers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-400" />
                <span>Trainer Commissions & 60/40 Split Engine</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Eliminates session disputes. Automatically settles bi-weekly client fees between Gym (40%) and Trainer (60%).
              </p>
            </div>
            <button
              onClick={() => alert('Exporting Bi-Weekly Payout CSV for Bank Bulk Transfer...')}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Payout Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainerCommissions.map((trainer) => (
              <div
                key={trainer.trainerId}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      ★ {trainer.rating} Rating
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      trainer.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {trainer.status === 'paid' ? '● Settled / Paid' : '⏳ Payout Due'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{trainer.trainerName}</h3>
                    <p className="text-xs text-zinc-400">{trainer.specialty}</p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{trainer.phone}</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Completed Sessions:</span>
                      <strong className="text-white font-mono">{trainer.completedSessions} sessions</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Total Client Fees:</span>
                      <strong className="text-white font-mono">₦{trainer.totalClientFees.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-amber-400 font-bold">
                      <span>Trainer Cut (60%):</span>
                      <span className="font-mono text-sm">₦{trainer.trainerEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Gym Retained (40%):</span>
                      <span className="font-mono text-sm">₦{trainer.gymCutEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => payoutTrainer(trainer.trainerId)}
                  disabled={trainer.status === 'paid'}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                    trainer.status === 'paid'
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{trainer.status === 'paid' ? 'Commission Disbursed' : 'Approve ₦' + trainer.trainerEarnings.toLocaleString() + ' Payout'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: AT-RISK CHURN RADAR & WHATSAPP WIN-BACK                 */}
      {/* ============================================================== */}
      {activeTab === 'churn' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-red-500/30 p-5 rounded-3xl space-y-1">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>At-Risk Member Radar (Retention Protection)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Members who haven&apos;t scanned in for 10+ days or whose pass expired. 1-click WhatsApp incentives reduce gym drop-off by 35%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atRiskMembers.map((member) => (
              <div
                key={member.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm">{member.fullName}</h4>
                      <p className="text-xs text-zinc-400">Pass #{member.memberCode} • {member.phoneNumber}</p>
                    </div>
                    <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      {member.status === 'expired' ? 'Subscription Expired' : '12+ Days Absent'}
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl text-xs space-y-1 text-zinc-400">
                    <p>Visits this month: <strong className="text-white">{member.totalVisitsThisMonth}</strong></p>
                    <p>Plan Expiry Date: <strong className="text-amber-400 font-mono">{member.subscriptionEndDate}</strong></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/234${member.phoneNumber.replace(/^0|\s+/g, '')}?text=${encodeURIComponent(
                      `Hello ${member.fullName}! Coach Tunde and the FitLedger team noticed you haven't been in for a while. We miss you! Renew this week for 10% off: https://fitledger.ng/m/${member.memberCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setWinBackSuccess(`✓ WhatsApp Win-Back incentive sent to ${member.fullName}!`);
                      setTimeout(() => setWinBackSuccess(null), 4000);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Win-Back Offer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: STAFF & RECEPTION PINS                                   */}
      {/* ============================================================== */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                Front-Desk Receptionists & Shift PIN Roster
              </h2>
              <p className="text-xs text-zinc-400">Every receptionist logs into the counter with their 4-digit anti-theft PIN</p>
            </div>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>➕ Add New Front-Desk Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                        staff.shiftStatus === 'on_duty'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {staff.shiftStatus === 'on_duty' ? '● On Counter Duty' : '○ Off Duty'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      {staff.role}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{staff.fullName}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-400" /> {staff.phone}
                    </p>
                    <p className="text-[11px] text-zinc-500">{staff.branchName}</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                      Shift Counter PIN
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="text-xl font-mono font-black text-amber-400 tracking-widest">
                        {staff.pin}
                      </code>
                      <span className="text-[10px] text-zinc-500">4 Digits</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">Audit Active</span>
                  <button
                    onClick={() => deactivateStaff(staff.id)}
                    className="text-red-400 hover:text-red-300 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke PIN</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: MEMBER MASTER DIRECTORY                                 */}
      {/* ============================================================== */}
      {activeTab === 'members' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">Member Master Directory</h3>
              <p className="text-xs text-zinc-400">Digital passes, barcodes, and WhatsApp numbers</p>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Total Members: {members.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Barcode Pass</th>
                  <th className="p-3">Plan Expiry</th>
                  <th className="p-3">Visits This Month</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Pass Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/40">
                    <td className="p-3">
                      <span className="font-bold text-white block">{m.fullName}</span>
                      <span className="text-[10px] text-zinc-500">{m.phoneNumber}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-zinc-200">#{m.memberCode}</td>
                    <td className="p-3 font-mono">{m.subscriptionEndDate}</td>
                    <td className="p-3 font-bold text-white">{m.totalVisitsThisMonth} visits</td>
                    <td className="p-3">
                      {m.status === 'active' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ● Active Pass
                        </span>
                      ) : (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ● Expired
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/m/${m.memberCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold"
                      >
                        <span>View Pass</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: WHATSAPP AI EXECUTIVE AUDITOR                            */}
      {/* ============================================================== */}
      {activeTab === 'whatsapp' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 max-w-3xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">FitLedger WhatsApp AI Executive Auditor</h3>
                <p className="text-[11px] text-emerald-400">● Live Simulated WhatsApp Agent (9 PM Nightly Summary)</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded font-mono font-bold">
              Chief Tunde
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-sm'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-sm shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleSendMessage('How much physical cash is in the drawer right now?')}
              className="py-1.5 px-3 rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              💵 Cash in drawer?
            </button>
            <button
              onClick={() => handleSendMessage('Which members are expiring tomorrow?')}
              className="py-1.5 px-3 rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              ⏳ Expiring tomorrow?
            </button>
            <button
              onClick={() => handleSendMessage('Show me all staff on duty and their PINs')}
              className="py-1.5 px-3 rounded-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              🔒 Staff counter PINs?
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: e.g. 'Did Abiodun Adeleke pay his renewal today?'"
              className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Manual Override Modal */}
      {overrideTransferId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-black text-sm text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Override Unconfirmed Alert</span>
              </h3>
              <button onClick={() => setOverrideTransferId(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              To prevent theft, overriding an unconfirmed transfer requires your 4-digit Shift PIN. This action will be permanently logged.
            </p>

            <form onSubmit={handleConfirmTransferOverride} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-400 block mb-1">Enter 4-Digit Shift PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={overridePin}
                  onChange={(e) => setOverridePin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-amber-400 font-mono text-center text-xl tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Sign & Authorize Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-500" />
                  <span>Register Front-Desk Staff</span>
                </h3>
                <p className="text-xs text-zinc-400">Generates unique 4-digit shift PIN and anti-theft audit account</p>
              </div>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-zinc-400 hover:text-white p-1 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Blessing Okafor"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Staff Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                >
                  <option value="receptionist">Receptionist / Front Desk (Restricted)</option>
                  <option value="trainer">Fitness Trainer (PT Bookings only)</option>
                  <option value="manager">Branch Floor Manager</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 flex justify-between mb-1">
                  <span>4-Digit Shift Login PIN</span>
                  <button
                    type="button"
                    onClick={() => setNewStaffPin(`${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-red-400 hover:text-red-300 text-[10px] cursor-pointer"
                  >
                    🎲 Regenerate
                  </button>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-amber-400 font-mono font-black text-center tracking-widest text-base"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[11px] text-red-300 space-y-1">
                <p>🔒 <strong>Anti-Theft Enforcement:</strong></p>
                <p>This receptionist CANNOT view total gym profits or delete any members. System will send an automated WhatsApp message with their Shift PIN [<strong>{newStaffPin}</strong>].</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 mt-2 cursor-pointer"
              >
                Create Staff & Send WhatsApp PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Owner Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Update Owner Workspace Password</span>
                </h3>
                <p className="text-xs text-zinc-400">{activeTenant.name} • {activeTenant.ownerName}</p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {passwordChangeSuccess ? (
              <div className="space-y-4 py-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-400 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Password Successfully Updated!</span>
                    <span>Your new master owner password is active immediately.</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPasswordChangeError(null);

                  if (newOwnerPassword.length < 4) {
                    setPasswordChangeError('Password must be at least 4 characters.');
                    return;
                  }
                  if (newOwnerPassword !== confirmOwnerPassword) {
                    setPasswordChangeError('Passwords do not match.');
                    return;
                  }

                  const targetId = activeOwner?.email || activeTenant.ownerPhone;
                  const success = updateOwnerPassword(targetId, newOwnerPassword);

                  if (success) {
                    setPasswordChangeSuccess('Password updated successfully.');
                    setNewOwnerPassword('');
                    setConfirmOwnerPassword('');
                  } else {
                    setPasswordChangeError('Could not locate owner record to update.');
                  }
                }}
                className="space-y-4 text-xs"
              >
                {passwordChangeError && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">New Owner Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newOwnerPassword}
                      onChange={(e) => setNewOwnerPassword(e.target.value)}
                      placeholder="Enter new master password"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Confirm New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmOwnerPassword}
                    onChange={(e) => setConfirmOwnerPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="bg-zinc-900 border border-zinc-800/80 p-3 rounded-xl text-[11px] text-zinc-400">
                  ℹ️ This updates your master login password across all devices. Front-desk staff PINs remain untouched.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Save New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
