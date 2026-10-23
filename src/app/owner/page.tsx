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
  } = useGym();

  const [activeTab, setActiveTab] = useState<'finance' | 'staff' | 'members' | 'whatsapp'>('finance');

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

  // WhatsApp Chat Simulator
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'bot',
      text: `Good day Chief! Here is the Gym Closing Summary for today (Thursday, Oct 22):\n\n💰 Total Gross Revenue: ₦${shiftSummary.totalRevenue.toLocaleString()}\n• Bank Transfers: ₦${shiftSummary.transferExpected.toLocaleString()} (verified)\n• POS Card: ₦${shiftSummary.posExpected.toLocaleString()} (OCR logged)\n• Cash in Drawer: ₦${shiftSummary.cashExpected.toLocaleString()}\n\n👥 Total Member Check-ins: ${checkIns.length} members\n⚠️ Staff Audit Overrides: ${shiftSummary.overridesCount} flags\n\nAsk me anything or tap one of the quick prompts below!`,
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
                  Owner Suite
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
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl gap-1 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'finance' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          1. Financials & Anti-Theft
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'staff' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>2. Staff & Reception PINs</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{staffList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'members' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>3. Member Directory</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{members.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'whatsapp' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          4. WhatsApp AI Bot
        </button>
      </div>

      {staffCreatedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{staffCreatedSuccess}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: FINANCIALS & ANTI-THEFT                                */}
      {/* ============================================================== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Gross Today</p>
              <p className="text-2xl font-black text-white">₦{shiftSummary.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Bank Transfers</p>
              <p className="text-2xl font-black text-blue-400">₦{shiftSummary.transferExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">
                {transactions.filter((t) => t.paymentMethod === 'bank_transfer' || t.paymentMethod === 'paystack_online').length} automated payments
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">POS Card Slips</p>
              <p className="text-2xl font-black text-purple-400">₦{shiftSummary.posExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">
                {transactions.filter((t) => t.paymentMethod === 'pos_card').length} terminal receipts logged
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Cash in Drawer (Anti-Theft)</p>
              <p className="text-2xl font-black text-amber-400">₦{shiftSummary.cashExpected.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">
                Staff on duty: <strong className="text-zinc-200">{activeStaff.fullName}</strong>
              </p>
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

            <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
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
                          : 'text-emerald-400'
                      }`}
                    >
                      {log.severity === 'alert' && '⚠️ '}
                      {log.action}
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    <span>Actor Staff: <strong className="text-zinc-300">{log.actorStaffName}</strong></span>
                    <span className="font-mono">Log #{log.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STAFF & RECEPTION PIN MANAGEMENT                        */}
      {/* ============================================================== */}
      {activeTab === 'staff' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                Front-Desk Staff & Counter PIN Roster
              </h2>
              <p className="text-xs text-zinc-400">
                Add receptionists, generate their 4-digit Shift PIN, and revoke access instantly if staff leaves.
              </p>
            </div>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <UserPlus className="w-4 h-4" /> Add New Front-Desk Staff
            </button>
          </div>

          {/* Staff Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-3 relative hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-sm">
                      {s.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{s.fullName}</h4>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{s.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      s.shiftStatus === 'on_duty'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {s.shiftStatus === 'on_duty' ? '● On Duty' : 'Off Duty'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">4-Digit Shift PIN:</span>
                    <span className="font-mono font-black text-amber-400 text-sm tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {s.pin}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">WhatsApp:</span>
                    <span className="text-zinc-300 font-mono">{s.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-500 font-mono">ID: {s.id}</span>
                  {s.role !== 'owner' && (
                    <button
                      onClick={() => deactivateStaff(s.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Revoke PIN
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MEMBER DIRECTORY                                        */}
      {/* ============================================================== */}
      {activeTab === 'members' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-white">Member Master Directory</h2>
              <p className="text-xs text-zinc-400">Total active memberships at {activeTenant.name}</p>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Count: {members.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Visits this mo</th>
                  <th className="py-3.5 px-4 text-right">Mobile Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-medium text-zinc-300">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={m.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-bold text-white">{m.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-300">#{m.memberCode}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{m.phoneNumber}</td>
                    <td className="py-3.5 px-4">
                      {m.status === 'active' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{m.subscriptionEndDate}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{m.totalVisitsThisMonth}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/m/${m.memberCode}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white rounded-lg text-xs font-bold transition"
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
      {/* TAB 4: WHATSAPP AI BOT                                         */}
      {/* ============================================================== */}
      {activeTab === 'whatsapp' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">FitLedger WhatsApp Private Bot</h3>
                <p className="text-[10px] text-emerald-400 font-semibold">● Live PostgreSQL Tool-Calling Agent</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
              Dedicated to: {activeTenant.ownerName}
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-3 min-h-[300px] max-h-[360px] text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}
                >
                  {m.sender === 'bot' && (
                    <span className="block text-[10px] font-bold text-emerald-400 mb-1">
                      FitLedger AI Assistant
                    </span>
                  )}
                  {m.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1 font-mono">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quick Test Prompts:</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => handleSendMessage('Did Abiodun renew today?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "Did Abiodun renew?"
              </button>
              <button
                onClick={() => handleSendMessage('What are the staff shift PINs?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "What are staff PINs?"
              </button>
              <button
                onClick={() => handleSendMessage('Who expires tomorrow?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "Who expires tomorrow?"
              </button>
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 pt-1"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask bot: 'Daily report', 'Check member #124253'..."
              className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base">Register Front-Desk Staff</h3>
                <p className="text-xs text-zinc-400">Creates staff account & generates counter shift PIN</p>
              </div>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Chioma Okonjo"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Role / Designation</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1"
                >
                  <option value="receptionist">Receptionist / Front Desk (Restricted)</option>
                  <option value="trainer">Fitness Trainer (PT Bookings only)</option>
                  <option value="manager">Branch Floor Manager</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 flex justify-between">
                  <span>4-Digit Shift Login PIN</span>
                  <button
                    type="button"
                    onClick={() => setNewStaffPin(`${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-red-400 hover:text-red-300 text-[10px]"
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-amber-400 font-mono font-black text-center tracking-widest text-base mt-1"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[11px] text-red-300 space-y-1">
                <p>🔒 <strong>Anti-Theft Enforcement:</strong></p>
                <p>This receptionist CANNOT view total gym profits or delete any members. System will send an automated WhatsApp message with their Shift PIN [<strong>{newStaffPin}</strong>].</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 mt-2"
              >
                Create Staff & Send WhatsApp PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Owner Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
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
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold"
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
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
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
