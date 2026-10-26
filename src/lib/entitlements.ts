// FitLedger OS — SaaS Plan Entitlement Matrix & Feature Gating
// Enforces pricing tier boundaries with security, auditability, and upsell modals.

export type PlanTier = 'Starter' | 'Growth' | 'Enterprise';

export type FeatureKey =
  | 'unlimitedMembers'
  | 'whatsappReceipts'
  | 'ptTrainerScheduling'
  | 'dailyOwnerAiReport'
  | 'multiBranchRoaming'
  | 'turnstileGateApi'
  | 'customBranding'
  | 'proShopInventory'
  | 'shiftHandover';

export interface PlanDefinition {
  name: PlanTier;
  monthlyFee: number;
  badgeText: string;
  maxMembers: number;
  features: Record<FeatureKey, boolean>;
}

export const PLAN_TIERS: Record<PlanTier, PlanDefinition> = {
  Starter: {
    name: 'Starter',
    monthlyFee: 25000,
    badgeText: 'Neighborhood Gym',
    maxMembers: 200,
    features: {
      unlimitedMembers: false,
      whatsappReceipts: false,
      ptTrainerScheduling: false,
      dailyOwnerAiReport: false,
      multiBranchRoaming: false,
      turnstileGateApi: false,
      customBranding: false,
      proShopInventory: true,
      shiftHandover: true,
    },
  },
  Growth: {
    name: 'Growth',
    monthlyFee: 45000,
    badgeText: 'Most Popular in Lagos',
    maxMembers: Infinity,
    features: {
      unlimitedMembers: true,
      whatsappReceipts: true,
      ptTrainerScheduling: true,
      dailyOwnerAiReport: true,
      multiBranchRoaming: false,
      turnstileGateApi: false,
      customBranding: false,
      proShopInventory: true,
      shiftHandover: true,
    },
  },
  Enterprise: {
    name: 'Enterprise',
    monthlyFee: 95000,
    badgeText: 'Multi-Branch & VIP',
    maxMembers: Infinity,
    features: {
      unlimitedMembers: true,
      whatsappReceipts: true,
      ptTrainerScheduling: true,
      dailyOwnerAiReport: true,
      multiBranchRoaming: true,
      turnstileGateApi: true,
      customBranding: true,
      proShopInventory: true,
      shiftHandover: true,
    },
  },
};

export interface FeatureMetadata {
  key: FeatureKey;
  name: string;
  requiredTier: PlanTier;
  tagline: string;
  description: string;
  roiPitch: string;
  icon: string;
}

export const FEATURE_METADATA: Record<FeatureKey, FeatureMetadata> = {
  unlimitedMembers: {
    key: 'unlimitedMembers',
    name: 'Unlimited Active Members',
    requiredTier: 'Growth',
    tagline: 'Scale past 200 members with zero cap',
    description: 'Starter tier is limited to 200 active members. Upgrade to Growth for unlimited member accounts.',
    roiPitch: 'Each member past 200 represents ₦25,000–₦35,000/mo in gross recurring revenue.',
    icon: '👥',
  },
  whatsappReceipts: {
    key: 'whatsappReceipts',
    name: 'Automated WhatsApp & SMS Receipts',
    requiredTier: 'Growth',
    tagline: 'Eliminate unrecorded cash theft with automated digital tokens',
    description: 'Every subscription renewal, day pass, or counter sale immediately sends an encrypted WhatsApp & SMS receipt to the member’s phone.',
    roiPitch: 'Stops front-desk cash pocketing by making the customer demand their automated digital receipt.',
    icon: '💬',
  },
  ptTrainerScheduling: {
    key: 'ptTrainerScheduling',
    name: 'Personal Trainer & Commission Splits',
    requiredTier: 'Growth',
    tagline: 'Auto-calculate trainer cuts and eliminate payout disputes',
    description: 'Track 1-on-1 personal training sessions, schedule workouts, and automatically calculate trainer commissions (e.g. 70/30 or 60/40 gym splits).',
    roiPitch: 'Eliminates trainer side-deals and ensures the gym collects its full 30–40% facility cut.',
    icon: '🏋️‍♂️',
  },
  dailyOwnerAiReport: {
    key: 'dailyOwnerAiReport',
    name: 'Daily 9 PM WhatsApp AI Closing Report',
    requiredTier: 'Growth',
    tagline: 'Receive daily financial settlements directly on WhatsApp',
    description: 'FitLedger AI compiles daily revenue, counted cash, POS slips, and audit flags into an executive WhatsApp brief sent directly to your phone every evening.',
    roiPitch: 'Never wonder how much money is in the cash drawer while sitting at home.',
    icon: '📱',
  },
  multiBranchRoaming: {
    key: 'multiBranchRoaming',
    name: 'Multi-Branch Cross-Access Roaming',
    requiredTier: 'Enterprise',
    tagline: 'Allow members to work out at any branch across Lagos',
    description: 'Centralized biometric and QR roaming. A member registered in Lekki can check in seamlessly at Ikeja or Victoria Island.',
    roiPitch: 'Enables premium VIP memberships priced at ₦50,000–₦75,000/month for multi-branch access.',
    icon: '🌐',
  },
  turnstileGateApi: {
    key: 'turnstileGateApi',
    name: 'Hardware Turnstile Gate Integration',
    requiredTier: 'Enterprise',
    tagline: 'Zero-trust physical barriers controlled by FitLedger cloud',
    description: 'Integrates with magnetic door strikes, tripod turnstiles, and speed gates. Only active paid members can physically unlock the entry turnstile.',
    roiPitch: '100% human-free access control. Front desk cannot let anyone in off-the-books.',
    icon: '🚪',
  },
  customBranding: {
    key: 'customBranding',
    name: 'White-Label Custom Branding',
    requiredTier: 'Enterprise',
    tagline: 'Your gym logo, custom colors, and custom member domain',
    description: 'Full white-label experience on member passes, receipts, and PWA dashboards with your gym’s bespoke branding.',
    roiPitch: 'Elevates your gym brand into a luxury fitness chain.',
    icon: '✨',
  },
  proShopInventory: {
    key: 'proShopInventory',
    name: 'Pro-Shop Retail POS & Inventory Vault',
    requiredTier: 'Starter',
    tagline: 'Track water, energy drinks, and supplement stock',
    description: 'Counter retail POS with low-stock warnings and drawer cash tracking.',
    roiPitch: 'Plugs missing drink revenue from the reception fridge.',
    icon: '🥤',
  },
  shiftHandover: {
    key: 'shiftHandover',
    name: 'Shift Handover & Cash Lock',
    requiredTier: 'Starter',
    tagline: 'End-of-shift cash counting and discrepancy audit',
    description: 'Count physical drawer cash against system expectations to prevent staff cash leakage.',
    roiPitch: 'Enforces accountability before staff leave their shift.',
    icon: '🔒',
  },
};

/**
 * Checks whether a given plan tier is entitled to use a specific feature.
 */
export function canAccessFeature(tier: PlanTier = 'Starter', featureKey: FeatureKey): boolean {
  const plan = PLAN_TIERS[tier] || PLAN_TIERS.Starter;
  return Boolean(plan.features[featureKey]);
}

/**
 * Returns the maximum active members allowed for a given tier.
 */
export function getMaxMembersAllowed(tier: PlanTier = 'Starter'): number {
  const plan = PLAN_TIERS[tier] || PLAN_TIERS.Starter;
  return plan.maxMembers;
}

/**
 * Calculates the upgrade price difference between two tiers.
 */
export function getUpgradePriceDifference(currentTier: PlanTier, targetTier: PlanTier): number {
  const currentFee = PLAN_TIERS[currentTier]?.monthlyFee || 25000;
  const targetFee = PLAN_TIERS[targetTier]?.monthlyFee || 45000;
  return Math.max(0, targetFee - currentFee);
}
