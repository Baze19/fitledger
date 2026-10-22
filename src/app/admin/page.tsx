'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { Building2, Plus, Users, DollarSign, Activity, ShieldCheck, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const { tenants, addTenant, switchTenant, activeTenant } = useGym();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [planTier, setPlanTier] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');

  const totalMrr = tenants.reduce((sum, t) => sum + (t.status === 'active' ? t.monthlyFee : 0), 0);
  const totalMembersAcrossLagos = tenants.reduce((sum, t) => sum + t.membersCount, 0);

  const handleAddGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymName || !ownerName || !ownerPhone) return;

    const monthlyFee = planTier === 'Starter' ? 25000 : planTier === 'Growth' ? 45000 : 95000;
    const slug = gymName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    addTenant({
      name: gymName,
      slug,
      location: location || 'Lagos, Nigeria',
      ownerName,
      ownerPhone,
      planTier,
      monthlyFee,
      membersCount: 0,
      status: 'trial', // starts with 14-day free pilot!
    });

    setGymName('');
    setLocation('');
    setOwnerName('');
    setOwnerPhone('');
    setIsModalOpen(false);
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
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-zinc-400">Platform Tenant Fleet Management • Scaled for Nigeria & West Africa</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/owner"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 transition flex items-center gap-1.5"
          >
            <span>Open Current Gym ({activeTenant.name.split(' ')[0]})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
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
          <p className="text-xs text-zinc-500 font-medium">Monthly recurring revenue from active gyms</p>
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
          <p className="text-xs text-zinc-500 font-medium">Across all branches in Lagos</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">System Core Health</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-lg font-black text-white">99.98% Uptime</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">PostgreSQL RLS Multi-Tenant Active</p>
        </div>

      </div>

      {/* Gym Tenants Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Gym Tenants Directory (Lagos Fleet)
            </h2>
            <p className="text-xs text-zinc-400">Every gym operates in its own isolated database partition</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Total Tenants: {tenants.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Gym Center</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Owner / Contact</th>
                <th className="py-3.5 px-4">SaaS Tier</th>
                <th className="py-3.5 px-4">Tracked Members</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                        {t.name[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{t.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">tenant_id: {t.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{t.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-white block">{t.ownerName}</span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" /> {t.ownerPhone}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-white">{t.planTier}</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      ₦{t.monthlyFee.toLocaleString()}/mo
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">
                    {t.membersCount > 0 ? t.membersCount.toLocaleString() : 'New'}
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
                    <Link
                      href="/owner"
                      onClick={() => switchTenant(t.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-purple-600 text-zinc-200 hover:text-white rounded-xl text-xs font-bold transition"
                    >
                      <span>Manage Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Gym Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base">Onboard New Gym Tenant</h3>
                <p className="text-xs text-zinc-400">Provisions isolated multi-tenant database & WhatsApp bot</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddGym} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-300">Gym Center Name</label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="e.g. Total Fitness Surulere"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300">Location / Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 12 Ogunlana Drive, Surulere, Lagos"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-300">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Chief Segun Adeleke"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-300">Owner WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="0803 123 4567"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300">SaaS Subscription Tier</label>
                <select
                  value={planTier}
                  onChange={(e) => setPlanTier(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white mt-1"
                >
                  <option value="Starter">Starter — ₦25,000/mo (1 Front desk, up to 200 members)</option>
                  <option value="Growth">Growth — ₦45,000/mo (Unlimited receptionists, WhatsApp bot)</option>
                  <option value="Enterprise">Enterprise — ₦95,000/mo (Multi-branch, hardware turnstiles)</option>
                </select>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-[11px] text-purple-300">
                ✓ System will automatically set up a <strong>14-Day Free Trial</strong> and send an automated WhatsApp onboarding link to the owner.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-black text-xs transition shadow-lg shadow-purple-600/30 mt-2"
              >
                Provision Tenant & Activate Pilot
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
