'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGym } from '@/context/gym-context';
import { 
  Building2, Plus, Users, DollarSign, Activity, ShieldCheck, 
  Phone, MapPin, ExternalLink, ArrowRight, Eye, CheckCircle2, 
  Copy, MessageSquare, Terminal, RefreshCw, KeyRound, Mail 
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const router = useRouter();
  const { tenants, owners, onboardGymTenant, impersonateTenant, activeTenant, auditLogs } = useGym();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTenantSuccess, setNewTenantSuccess] = useState<{
    tenantName: string;
    ownerEmail: string;
    ownerPass: string;
    whatsappMsg: string;
    phone: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Form state
  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [planTier, setPlanTier] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [customPassword, setCustomPassword] = useState('');

  const totalMrr = tenants.reduce((sum, t) => sum + (t.status === 'active' ? t.monthlyFee : 0), 0);
  const totalMembersAcrossLagos = tenants.reduce((sum, t) => sum + t.membersCount, 0);

  const handleOnboardGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymName || !ownerName || !ownerPhone || !ownerEmail) return;

    const result = onboardGymTenant({
      name: gymName,
      location: location || 'Lagos, Nigeria',
      ownerName,
      ownerPhone,
      ownerEmail,
      planTier,
      tempPassword: customPassword || undefined,
    });

    setNewTenantSuccess({
      tenantName: result.tenant.name,
      ownerEmail: result.owner.email,
      ownerPass: result.owner.password || 'Fit#2026',
      whatsappMsg: result.whatsappMessage,
      phone: result.owner.phone,
    });

    setGymName('');
    setLocation('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
    setCustomPassword('');
  };

  const handleImpersonate = (tenantId: string) => {
    impersonateTenant(tenantId);
    router.push('/owner');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-600/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">FitLedger Founder HQ</h1>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Super Admin • Abiodun Oludolapo
                </span>
              </div>
              <p className="text-xs text-zinc-400">Multi-Tenant Platform Command Center • Lagos & West Africa Fleet</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            Public Site
          </Link>
          <button
            onClick={() => {
              setNewTenantSuccess(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Onboard New Gym Tenant
          </button>
        </div>
      </div>

      {/* Founder Platform Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Platform SaaS MRR</p>
          <p className="text-3xl font-black text-emerald-400">₦{totalMrr.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 font-medium">Billed monthly across Lagos gyms</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Gyms Onboarded</p>
          <p className="text-3xl font-black text-white">{tenants.length}</p>
          <p className="text-xs text-purple-400 font-semibold">
            {tenants.filter((t) => t.status === 'trial').length} on 14-day free pilot
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Tracked Members</p>
          <p className="text-3xl font-black text-blue-400">{totalMembersAcrossLagos.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 font-medium">Active gym goers using digital passes</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">System Core Health</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-lg font-black text-white">99.98% Uptime</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">Prisma PostgreSQL RLS Active</p>
        </div>

      </div>

      {/* Gym Tenants Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Gym Tenants Directory & Root Access
            </h2>
            <p className="text-xs text-zinc-400">
              Click <strong>&quot;Inspect / Debug as Owner&quot;</strong> on any gym to impersonate their portal and resolve issues directly.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Active Tenants: {tenants.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Gym Center</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Owner Account</th>
                <th className="py-3.5 px-4">Owner Password</th>
                <th className="py-3.5 px-4">Tier & MRR</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Founder Root Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
              {tenants.map((t) => {
                const owner = owners.find((o) => o.tenantId === t.id);
                return (
                  <tr key={t.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                          {t.name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{t.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">slug: {t.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{t.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white block">{t.ownerName}</span>
                      <span className="text-[10px] text-zinc-400 block font-mono">{owner?.email || 'owner@gym.ng'}</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" /> {t.ownerPhone}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-zinc-300 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[11px] font-mono">
                        {owner?.password || '••••••••'}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white">{t.planTier}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono font-bold">
                        ₦{t.monthlyFee.toLocaleString()}/mo
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {t.status === 'active' && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ● Active Paid
                        </span>
                      )}
                      {t.status === 'trial' && (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ⏳ 14-Day Pilot
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleImpersonate(t.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-600/20 cursor-pointer"
                        title="Open Owner Workspace as Founder to troubleshoot and manage"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect / Debug</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Audit & Bug Telemetry Stream */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-black text-white">Live Platform Audit & Telemetry Stream</h2>
          </div>
          <span className="text-xs text-zinc-500">Auto-streaming across all Lagos branches</span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${log.severity === 'alert' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <div>
                  <span className="font-bold text-white mr-2">{log.action}:</span>
                  <span className="text-zinc-400">{log.details}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-mono flex-shrink-0">
                <span>By: {log.actorStaffName}</span>
                <span>•</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboard Gym Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full text-white space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base">Onboard New Gym Organization</h3>
                <p className="text-xs text-zinc-400">Creates gym database partition and sets up Owner access credentials</p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTenantSuccess(null);
                }} 
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {newTenantSuccess ? (
              <div className="space-y-4 py-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Workspace & Owner Account Ready!</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    <strong>{newTenantSuccess.tenantName}</strong> has been provisioned. The owner can now sign in immediately from the landing page.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Owner Login Email:</span>
                    <span className="font-bold text-white font-mono">{newTenantSuccess.ownerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Temporary Password:</span>
                    <code className="bg-zinc-950 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">
                      {newTenantSuccess.ownerPass}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Owner WhatsApp:</span>
                    <span className="font-bold text-white font-mono">{newTenantSuccess.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    WhatsApp Onboarding Dispatch Message:
                  </label>
                  <pre className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-[11px] text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {newTenantSuccess.whatsappMsg}
                  </pre>
                  
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(newTenantSuccess.whatsappMsg)}
                      className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Message'}</span>
                    </button>
                    <a
                      href={`https://wa.me/234${newTenantSuccess.phone.replace(/^0|\s+/g, '')}?text=${encodeURIComponent(newTenantSuccess.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewTenantSuccess(null);
                    }}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Done & Return to Fleet HQ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOnboardGym} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Gym Center Name</label>
                  <input
                    type="text"
                    required
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    placeholder="e.g. BodyZone Fitness Club"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Location / Address</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Plot 12, Admiralty Way, Lekki Phase 1, Lagos"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Owner Full Name</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Kunle Bamgbola"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Owner WhatsApp Phone</label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="0803 123 4567"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1">Owner Login Email</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="kunle@bodyzone.ng"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-300 block mb-1 flex justify-between">
                      <span>Temporary Password</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
                    </label>
                    <input
                      type="text"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Auto-generated if blank"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">SaaS Subscription Tier</label>
                  <select
                    value={planTier}
                    onChange={(e) => setPlanTier(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Starter">Starter — ₦25,000/mo (1 Front desk, up to 200 members)</option>
                    <option value="Growth">Growth — ₦45,000/mo (Unlimited receptionists, WhatsApp bot)</option>
                    <option value="Enterprise">Enterprise — ₦95,000/mo (Multi-branch, hardware turnstiles)</option>
                  </select>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-[11px] text-purple-300">
                  ✓ Provisions new tenant partition, creates owner login credentials, and generates instant WhatsApp welcome dispatch.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs transition shadow-lg shadow-purple-600/30 mt-2 cursor-pointer"
                >
                  Provision Tenant & Generate Credentials
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
