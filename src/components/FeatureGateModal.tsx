'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import {
  FeatureKey,
  FEATURE_METADATA,
  PLAN_TIERS,
  PlanTier,
  getUpgradePriceDifference,
} from '@/lib/entitlements';
import {
  X,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface FeatureGateModalProps {
  isOpen: boolean;
  featureKey: FeatureKey | null;
  onClose: () => void;
  onUpgradeSuccess?: (newTier: PlanTier) => void;
}

export function FeatureGateModal({
  isOpen,
  featureKey,
  onClose,
  onUpgradeSuccess,
}: FeatureGateModalProps) {
  const { activeTenant, upgradeTenantTier } = useGym();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);

  if (!isOpen || !featureKey) return null;

  const meta = FEATURE_METADATA[featureKey];
  const currentTier = activeTenant.planTier || 'Starter';
  const targetTier = meta.requiredTier;
  const priceDiff = getUpgradePriceDifference(currentTier, targetTier);
  const targetPlan = PLAN_TIERS[targetTier];

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradeTenantTier(activeTenant.id, targetTier);
      setUpgradeComplete(true);
      if (onUpgradeSuccess) onUpgradeSuccess(targetTier);
      setTimeout(() => {
        setUpgradeComplete(false);
        setIsUpgrading(false);
        onClose();
      }, 1600);
    } catch (err) {
      console.error('Tier upgrade error:', err);
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full text-white shadow-2xl relative overflow-hidden my-auto animate-fade-in">
        
        {/* Glow Header Accent */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${
          targetTier === 'Enterprise'
            ? 'from-purple-600 via-pink-600 to-indigo-600'
            : 'from-red-600 via-orange-500 to-amber-500'
        }`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 space-y-6">
          {!upgradeComplete ? (
            <>
              {/* Header Badge & Title */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/60 text-red-400 text-xs font-black uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Requires {targetTier.toUpperCase()} Plan</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{meta.name}</h3>
                    <p className="text-xs text-zinc-400">{meta.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Business Value & Feature Description */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-2.5 text-xs">
                <p className="text-zinc-300 leading-relaxed">{meta.description}</p>
                <div className="bg-zinc-950/80 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2.5 text-emerald-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold leading-snug">
                    <strong className="text-white">Why it pays for itself:</strong> {meta.roiPitch}
                  </p>
                </div>
              </div>

              {/* Pricing Differential Comparison */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>Current: <strong className="text-white">{currentTier} (₦{PLAN_TIERS[currentTier].monthlyFee.toLocaleString()}/mo)</strong></span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span>Upgrade: <strong className="text-amber-400">{targetTier} (₦{targetPlan.monthlyFee.toLocaleString()}/mo)</strong></span>
                </div>

                <div className="border-t border-zinc-800/80 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block font-medium">Difference to upgrade:</span>
                    <span className="text-2xl font-black text-white font-mono">
                      +₦{priceDiff.toLocaleString()}
                      <span className="text-xs text-zinc-400 font-normal">/month</span>
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold uppercase">
                    Zero Setup Fee
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isUpgrading}
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUpgrading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>Upgrading {activeTenant.name}...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span>1-Click Upgrade to {targetTier} Plan</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-zinc-500">
                  Instant real-time entitlement activation. Cancel or downgrade anytime in billing settings.
                </p>
              </div>
            </>
          ) : (
            /* Celebration Screen on Success */
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-black">
                <Sparkles className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Tier Upgraded to {targetTier}!</h4>
                <p className="text-xs text-zinc-300">
                  <strong>{meta.name}</strong> is now unlocked and live for <strong>{activeTenant.name}</strong>.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Entitlements synced across all terminals</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
