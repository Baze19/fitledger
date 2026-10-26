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
  Package,
  Boxes,
  PlusCircle,
  RefreshCw,
  Store,
  Receipt,
  Truck,
  SlidersHorizontal,
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
    retailItems,
    stockDeliveries,
    addRetailItem,
    restockItem,
    reconcileStockCount,
    hasFeature,
    openUpgradeModal,
  } = useGym();

  const [activeTab, setActiveTab] = useState<'finance' | 'inventory' | 'trainers' | 'churn' | 'staff' | 'members' | 'whatsapp'>('finance');

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

  // Inventory Modals & Form State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItemId, setRestockItemId] = useState(retailItems[0]?.id || 'ret_water');
  const [restockUnits, setRestockUnits] = useState(24);
  const [restockCostPerUnit, setRestockCostPerUnit] = useState(160);
  const [restockSupplier, setRestockSupplier] = useState('NBC Coca-Cola Wholesaler, Ikorodu');
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);

  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuCategory, setNewSkuCategory] = useState<'beverage' | 'supplement' | 'daily_pass' | 'merchandise'>('beverage');
  const [newSkuCost, setNewSkuCost] = useState(200);
  const [newSkuPrice, setNewSkuPrice] = useState(400);
  const [newSkuStock, setNewSkuStock] = useState(24);
  const [newSkuThreshold, setNewSkuThreshold] = useState(10);
  const [newSkuSupplier, setNewSkuSupplier] = useState('');
  const [newSkuIcon, setNewSkuIcon] = useState('📦');
  const [skuCreatedSuccess, setSkuCreatedSuccess] = useState<string | null>(null);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditItemId, setAuditItemId] = useState(retailItems[0]?.id || 'ret_water');
  const [auditPhysicalCount, setAuditPhysicalCount] = useState(0);
  const [auditNotes, setAuditNotes] = useState('');
  const [auditResult, setAuditResult] = useState<{ discrepancy: number; isBalanced: boolean } | null>(null);

  // Computed Inventory Valuation
  const totalStockRetailValue = retailItems.reduce((sum, r) => sum + r.price * r.inStock, 0);
  const totalStockCostValue = retailItems.reduce((sum, r) => sum + r.costPrice * r.inStock, 0);
  const projectedRetailProfit = Math.max(0, totalStockRetailValue - totalStockCostValue);
  const lowStockCount = retailItems.filter((r) => r.inStock <= r.lowStockThreshold && r.category !== 'daily_pass').length;

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
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">{activeTenant.name}</h1>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Owner Executive Suite
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  ⚡ {activeTenant.planTier || 'Starter'} Plan
                </span>
                {activeTenant.planTier !== 'Enterprise' && (
                  <button
                    onClick={() => openUpgradeModal(activeTenant.planTier === 'Starter' ? 'ptTrainerScheduling' : 'turnstileGateApi')}
                    type="button"
                    className="text-[10px] bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-md shadow-red-600/20 cursor-pointer flex items-center gap-1 transition active:scale-95"
                  >
                    <span>🚀 Upgrade</span>
                  </button>
                )}
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
          onClick={() => {
            if (!hasFeature('ptTrainerScheduling')) {
              openUpgradeModal('ptTrainerScheduling');
            } else {
              setActiveTab('trainers');
            }
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'trainers' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
          <span>2. PT Commissions</span>
          {!hasFeature('ptTrainerScheduling') ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
              🔒 Growth
            </span>
          ) : (
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{trainerCommissions.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'inventory' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-blue-400" />
          <span>3. Pro-Shop & Inventory</span>
          {lowStockCount > 0 ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {lowStockCount} Low
            </span>
          ) : (
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{retailItems.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('churn')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'churn' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>4. At-Risk Churn Radar</span>
          <span className="bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded-full text-[10px] font-bold">{atRiskMembers.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'staff' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>5. Staff & Shift PINs</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{staffList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'members' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>6. Member Directory</span>
          <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full text-[10px]">{members.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'whatsapp' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>7. WhatsApp AI Auditor</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!hasFeature('turnstileGateApi')) {
              openUpgradeModal('turnstileGateApi');
            }
          }}
          className="px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white border border-dashed border-purple-500/40 hover:border-purple-500/80 bg-purple-950/20"
        >
          <Lock className="w-3.5 h-3.5 text-purple-400" />
          <span>8. Turnstile Barriers</span>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
            Enterprise
          </span>
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
      {/* TAB 3: PRO-SHOP & INVENTORY MANAGEMENT SUITE                   */}
      {/* ============================================================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
            <div className="space-y-1">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span>Pro-Shop Inventory & Anti-Shrinkage Ledger</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Live beverage fridge and front-desk retail counter tracking. Every sale automatically debits stock and updates shift cash drawer totals.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setRestockSuccess(null);
                  setIsRestockModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Receive Supplier Delivery</span>
              </button>
              <button
                onClick={() => {
                  setSkuCreatedSuccess(null);
                  setIsAddSkuModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-2 border border-zinc-700 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Add Product SKU</span>
              </button>
              <button
                onClick={() => {
                  setAuditResult(null);
                  setIsAuditModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-2 border border-zinc-700 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Audit Stock Count</span>
              </button>
            </div>
          </div>

          {/* Top 4 Financial Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Retail Stock Valuation
              </span>
              <p className="text-2xl font-black text-white font-mono">
                ₦{totalStockRetailValue.toLocaleString()}
              </p>
              <span className="text-[11px] text-zinc-400 block">Current shelf retail potential</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Wholesale Cost Basis
              </span>
              <p className="text-2xl font-black text-zinc-300 font-mono">
                ₦{totalStockCostValue.toLocaleString()}
              </p>
              <span className="text-[11px] text-zinc-500 block">Paid out to distributors</span>
            </div>

            <div className="bg-zinc-900 border border-emerald-500/30 p-5 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Projected Gross Profit
              </span>
              <p className="text-2xl font-black text-emerald-400 font-mono">
                +₦{projectedRetailProfit.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400/80 block">
                {totalStockRetailValue > 0 ? Math.round((projectedRetailProfit / totalStockRetailValue) * 100) : 0}% Projected Net Margin
              </span>
            </div>

            <div className={`p-5 rounded-3xl space-y-1 border ${
              lowStockCount > 0
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-zinc-900 border-zinc-800'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Low-Stock Threshold Alert
              </span>
              <p className="text-2xl font-black text-white font-mono">
                {lowStockCount} <span className="text-xs text-zinc-400 font-normal">SKUs Below Min</span>
              </p>
              <span className="text-[11px] text-amber-300/80 block">
                {lowStockCount > 0 ? 'Restock recommended before weekend' : 'All items well stocked'}
              </span>
            </div>
          </div>

          {/* Main Inventory Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm">Active SKU Catalog ({retailItems.length} Products)</h3>
                <p className="text-xs text-zinc-500">Physical stock updated in real time as front desk clicks items</p>
              </div>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">
                Front-Desk Bar Sync: Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-5">Product SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current In-Stock</th>
                    <th className="py-3 px-4">Wholesale Cost</th>
                    <th className="py-3 px-4">Counter Selling Price</th>
                    <th className="py-3 px-4">Margin %</th>
                    <th className="py-3 px-4">Primary Distributor</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {retailItems.map((item) => {
                    const margin = item.price - item.costPrice;
                    const marginPct = item.price > 0 ? Math.round((margin / item.price) * 100) : 0;
                    const isLow = item.inStock <= item.lowStockThreshold && item.category !== 'daily_pass';
                    const isOut = item.inStock === 0 && item.category !== 'daily_pass';

                    return (
                      <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <span className="font-bold text-white block">{item.name}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                            {item.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {item.category === 'daily_pass' ? (
                            <span className="text-emerald-400 font-bold">Unlimited (Virtual)</span>
                          ) : isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-bold">
                              ● 0 Units (Out of Stock)
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                              ⚠️ {item.inStock} Left (Low Stock)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                              ✓ {item.inStock} Units In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">
                          ₦{item.costPrice.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-white font-bold">
                          ₦{item.price.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="text-emerald-400 font-bold">+{marginPct}%</span>
                          <span className="text-[10px] text-zinc-500 block">(+₦{margin.toLocaleString()}/ea)</span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-zinc-400">
                          {item.supplierName || 'General Distributor'}
                          {item.lastRestockedDate && (
                            <span className="text-[10px] text-zinc-500 block font-mono">Restocked: {item.lastRestockedDate}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setRestockItemId(item.id);
                                setRestockCostPerUnit(item.costPrice);
                                setRestockSupplier(item.supplierName || 'NBC Wholesaler, Ikorodu');
                                setRestockSuccess(null);
                                setIsRestockModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 hover:text-blue-300 font-bold text-[11px] transition cursor-pointer"
                              title="Add crates from supplier"
                            >
                              + Restock
                            </button>
                            <button
                              onClick={() => {
                                setAuditItemId(item.id);
                                setAuditPhysicalCount(item.inStock);
                                setAuditResult(null);
                                setIsAuditModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 font-bold text-[11px] transition cursor-pointer"
                              title="Count fridge / detect missing drinks"
                            >
                              Count
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Delivery Audit Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Recent Wholesale Supplier Deliveries</span>
                </h3>
                <p className="text-xs text-zinc-500">Audit trail of stock received at reception or store room</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {stockDeliveries.map((del) => (
                <div key={del.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{del.itemName}</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                        +{del.unitsAdded} Units
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Supplier: {del.supplier}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Received by {del.receivedByStaffName} • {del.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold block">₦{del.totalCost.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">@ ₦{del.costPerUnit}/ea</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: AT-RISK CHURN RADAR & WHATSAPP WIN-BACK                 */}
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

      {/* ============================================================== */}
      {/* INVENTORY MODAL 1: RESTOCK / RECEIVE SUPPLIER DELIVERY        */}
      {/* ============================================================== */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-white text-base">Receive Supplier Delivery</h3>
              </div>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {restockSuccess ? (
              <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">Delivery Logged to Inventory</h4>
                <p className="text-xs text-zinc-300">{restockSuccess}</p>
                <button
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  restockItem(restockItemId, restockUnits, restockCostPerUnit, restockSupplier);
                  const item = retailItems.find((r) => r.id === restockItemId);
                  setRestockSuccess(`Successfully added +${restockUnits} units of ${item?.name || 'stock'}. Total cost: ₦${(restockUnits * restockCostPerUnit).toLocaleString()}.`);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Select Product to Restock</label>
                  <select
                    value={restockItemId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setRestockItemId(id);
                      const matched = retailItems.find((r) => r.id === id);
                      if (matched) {
                        setRestockCostPerUnit(matched.costPrice);
                        if (matched.supplierName) setRestockSupplier(matched.supplierName);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {retailItems.filter((r) => r.category !== 'daily_pass').map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.icon} {r.name} (Current: {r.inStock} in stock)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Units Received</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={restockUnits}
                      onChange={(e) => setRestockUnits(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Wholesale Cost / Unit (₦)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={restockCostPerUnit}
                      onChange={(e) => setRestockCostPerUnit(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Supplier / Wholesaler Name</label>
                  <input
                    type="text"
                    required
                    value={restockSupplier}
                    onChange={(e) => setRestockSupplier(e.target.value)}
                    placeholder="e.g. NBC Wholesaler, Ikorodu depot"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Total Delivery Invoice:</span>
                  <span className="text-white font-extrabold text-sm">₦{(restockUnits * restockCostPerUnit).toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Confirm Delivery & Credit Stock
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INVENTORY MODAL 2: ADD NEW PRODUCT SKU                         */}
      {/* ============================================================== */}
      {isAddSkuModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Add New Product SKU</h3>
              </div>
              <button
                onClick={() => setIsAddSkuModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {skuCreatedSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-white text-sm">Product SKU Created!</h4>
                <p className="text-xs text-zinc-300">{skuCreatedSuccess}</p>
                <button
                  onClick={() => setIsAddSkuModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addRetailItem({
                    name: newSkuName,
                    category: newSkuCategory,
                    costPrice: newSkuCost,
                    price: newSkuPrice,
                    inStock: newSkuStock,
                    lowStockThreshold: newSkuThreshold,
                    supplierName: newSkuSupplier || 'Direct Wholesaler',
                    lastRestockedDate: '2026-10-23',
                    icon: newSkuIcon,
                  });
                  setSkuCreatedSuccess(`Added ${newSkuName} at ₦${newSkuPrice.toLocaleString()} (${newSkuStock} units). Appears on Front-Desk terminal immediately.`);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newSkuName}
                    onChange={(e) => setNewSkuName(e.target.value)}
                    placeholder="e.g. Fearless Energy Drink (500ml)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Category</label>
                    <select
                      value={newSkuCategory}
                      onChange={(e) => setNewSkuCategory(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="beverage">Beverage</option>
                      <option value="supplement">Supplement</option>
                      <option value="merchandise">Towel / Gear</option>
                      <option value="daily_pass">Daily Pass</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Display Icon</label>
                    <input
                      type="text"
                      value={newSkuIcon}
                      onChange={(e) => setNewSkuIcon(e.target.value)}
                      placeholder="e.g. ⚡, 💧, 🥤, 🥋, 🍎"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Wholesale Cost (₦)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newSkuCost}
                      onChange={(e) => setNewSkuCost(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Counter Selling Price (₦)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newSkuPrice}
                      onChange={(e) => setNewSkuPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Opening Stock (Units)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newSkuStock}
                      onChange={(e) => setNewSkuStock(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Low-Stock Alert Level</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newSkuThreshold}
                      onChange={(e) => setNewSkuThreshold(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Primary Supplier Name</label>
                  <input
                    type="text"
                    value={newSkuSupplier}
                    onChange={(e) => setNewSkuSupplier(e.target.value)}
                    placeholder="e.g. Chi Limited Depot / Balogun Market"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Unit Profit Margin:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    +₦{(newSkuPrice - newSkuCost).toLocaleString()} ({newSkuPrice > 0 ? Math.round(((newSkuPrice - newSkuCost) / newSkuPrice) * 100) : 0}%)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Save SKU to Catalog & POS Terminal
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INVENTORY MODAL 3: PHYSICAL COUNT & SHRINKAGE AUDITOR         */}
      {/* ============================================================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Physical Stock Count Audit</h3>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {auditResult ? (
              <div className={`p-6 rounded-2xl text-center space-y-3 border ${
                auditResult.isBalanced
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                  auditResult.isBalanced
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {auditResult.isBalanced ? <Check className="w-6 h-6 stroke-[3]" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <h4 className="font-extrabold text-white text-sm">
                  {auditResult.isBalanced ? 'Stock Balanced Perfectly!' : 'Discrepancy Stamped in Shift Audit'}
                </h4>
                <p className="text-xs text-zinc-300">
                  {auditResult.isBalanced
                    ? 'Physical count matches logged sales 100%. No inventory shrinkage detected.'
                    : `Discrepancy of ${auditResult.discrepancy} units recorded. Shift lead PIN and incident logged to permanent audit ledger.`}
                </p>
                <button
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Close Audit
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const res = reconcileStockCount(auditItemId, auditPhysicalCount, auditNotes);
                  setAuditResult(res);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Select Item Being Audited</label>
                  <select
                    value={auditItemId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setAuditItemId(id);
                      const matched = retailItems.find((r) => r.id === id);
                      if (matched) setAuditPhysicalCount(matched.inStock);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {retailItems.filter((r) => r.category !== 'daily_pass').map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.icon} {r.name} (Expected in system: {r.inStock})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const targetItem = retailItems.find((r) => r.id === auditItemId) || retailItems[0];
                  const diff = auditPhysicalCount - targetItem.inStock;
                  const leakageNaira = Math.abs(diff) * targetItem.price;

                  return (
                    <>
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">System Expected Count:</span>
                          <strong className="text-white font-mono">{targetItem.inStock} units in fridge</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Retail Value per Unit:</span>
                          <span className="text-zinc-300 font-mono">₦{targetItem.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-300 block mb-1">
                          Actual Physical Count in Fridge / Shelf
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={auditPhysicalCount}
                          onChange={(e) => setAuditPhysicalCount(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Discrepancy Live Alert Box */}
                      <div className={`p-3.5 rounded-2xl border text-xs ${
                        diff === 0
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {diff === 0 ? (
                          <div className="flex items-center gap-2 font-bold">
                            <Check className="w-4 h-4" />
                            <span>100% Balanced • 0 Missing Units</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-black">
                              <AlertTriangle className="w-4 h-4" />
                              <span>⚠️ SHRINKAGE: {Math.abs(diff)} Units {diff < 0 ? 'Missing / Stolen' : 'Surplus'}</span>
                            </div>
                            <p className="text-[11px] text-red-300">
                              Estimated front-desk cash leakage: <strong>₦{leakageNaira.toLocaleString()}</strong>. Will be logged against on-duty receptionist PIN.
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-300 block mb-1">Audit Notes / Reason</label>
                        <input
                          type="text"
                          value={auditNotes}
                          onChange={(e) => setAuditNotes(e.target.value)}
                          placeholder="e.g. Afternoon shift handover count"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer"
                      >
                        Save Physical Count & Log Reconciliation
                      </button>
                    </>
                  );
                })()}
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
