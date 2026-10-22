'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { TrendingUp, ShieldAlert, Bot, Send, ArrowUpRight, CheckCircle2, AlertTriangle, FileText, Smartphone } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export function OwnerHubView() {
  const { shiftSummary, auditLogs, askOwnerBot, activeStaff, checkIns, transactions } = useGym();

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

    // AI Response simulation
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

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Owner Remote Executive Hub
          </h2>
          <p className="text-xs text-zinc-400">Live multi-branch anti-theft feed & automated WhatsApp AI auditor</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-bold">
            Zero-Leakage Guarantee
          </span>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Gross Today</p>
          <p className="text-2xl font-black text-white">₦{shiftSummary.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
          </p>
        </div>

        {/* Bank Transfers */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Verified Bank Transfers</p>
          <p className="text-2xl font-black text-blue-400">₦{shiftSummary.transferExpected.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">
            {transactions.filter((t) => t.paymentMethod === 'bank_transfer' || t.paymentMethod === 'paystack_online').length} automated payments
          </p>
        </div>

        {/* POS Terminals */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">POS Card Slips</p>
          <p className="text-2xl font-black text-purple-400">₦{shiftSummary.posExpected.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">
            {transactions.filter((t) => t.paymentMethod === 'pos_card').length} terminal receipts logged
          </p>
        </div>

        {/* Physical Cash in Drawer */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Physical Cash in Drawer</p>
          <p className="text-2xl font-black text-amber-400">₦{shiftSummary.cashExpected.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">
            Staff on duty: <strong className="text-zinc-200">{activeStaff.fullName}</strong>
          </p>
        </div>

      </div>

      {/* Two Columns: Anti-Theft Feed (Left) & WhatsApp AI Assistant (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Anti-Theft Staff Audit Stream */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Staff Anti-Theft Audit Trail
              </h3>
              <p className="text-xs text-zinc-400">Permanent chronological log of receptionist actions</p>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono font-bold">
              Uneditable
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
                  <span>Actor Staff: <strong className="text-zinc-400">{log.actorStaffName}</strong></span>
                  <span className="font-mono">Audit #{log.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: WhatsApp AI Executive Assistant Simulator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">FitLedger WhatsApp Bot</h3>
                <p className="text-[10px] text-emerald-400 font-semibold">● Live PostgreSQL Tool-Calling Agent</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
              Owner Private Bot
            </span>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-3 min-h-[260px] max-h-[300px] text-xs font-sans">
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

          {/* Quick Prompt Pills */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quick Test Prompts:</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => handleSendMessage('Did Dr Adeleke or Abiodun renew today?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "Did Abiodun renew?"
              </button>
              <button
                onClick={() => handleSendMessage('How much cash should be in the drawer right now?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "How much cash in drawer?"
              </button>
              <button
                onClick={() => handleSendMessage('Who is expiring tomorrow?')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl border border-zinc-700 transition text-[11px]"
              >
                "Who expires tomorrow?"
              </button>
            </div>
          </div>

          {/* Chat Input */}
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

      </div>

    </div>
  );
}
