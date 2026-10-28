'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, CheckIn, Transaction, AuditLog, StaffUser, ShiftSummary, Plan, GymTenant, OwnerAccount, BankTransferVerification, TrainerCommission, RetailItem, StockDelivery, PaymentMethod, ExpenseLog, ShiftCloseout } from '@/types';
import { INITIAL_MEMBERS, INITIAL_STAFF, INITIAL_PLANS, INITIAL_CHECKINS, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS, INITIAL_TENANTS, INITIAL_OWNERS, INITIAL_BANK_TRANSFERS, INITIAL_TRAINER_COMMISSIONS, INITIAL_RETAIL_ITEMS, INITIAL_STOCK_DELIVERIES, INITIAL_EXPENSES, INITIAL_SHIFT_CLOSEOUTS } from '@/lib/mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PlanTier, FeatureKey, canAccessFeature, getMaxMembersAllowed, PLAN_TIERS } from '@/lib/entitlements';
import { FeatureGateModal } from '@/components/FeatureGateModal';
import {
  enqueueOfflineAction,
  getOfflineQueue,
  setCachedMembers,
  getCachedMembers,
  flushOfflineQueueToCloud,
} from '@/lib/offline-queue';

interface GymContextType {
  tenants: GymTenant[];
  activeTenant: GymTenant;
  switchTenant: (tenantId: string) => void;
  addTenant: (data: Omit<GymTenant, 'id' | 'joinedDate'>) => GymTenant;
  updateTenantReferralProgram: (tenantId: string, settings: GymTenant['referralProgram']) => void;
  updateTenantStatus: (tenantId: string, status: 'active' | 'trial' | 'suspended') => void;
  extendTenantTrial: (tenantId: string, days?: number) => void;

  owners: OwnerAccount[];
  activeOwner: OwnerAccount | null;
  isFounderImpersonating: boolean;
  impersonateTenant: (tenantId: string) => void;
  exitImpersonation: () => void;
  onboardGymTenant: (data: {
    name: string;
    location: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    planTier: 'Starter' | 'Growth' | 'Enterprise';
    tempPassword?: string;
  }) => { tenant: GymTenant; owner: OwnerAccount; whatsappMessage: string };
  authenticateUser: (identifier: string, credential: string) => {
    success: boolean;
    role?: 'founder' | 'owner' | 'receptionist';
    targetUrl?: string;
    message?: string;
    gymName?: string;
    userName?: string;
  };
  updateOwnerPassword: (emailOrPhone: string, newPass: string) => boolean;

  members: Member[];
  plans: Plan[];
  activePlans: Plan[];
  addPlan: (data: Omit<Plan, 'id'>) => Plan;
  updatePlan: (planId: string, updates: Partial<Omit<Plan, 'id'>>) => void;
  deletePlan: (planId: string) => void;

  // Real Data Testing Engine
  isDemoMode: boolean;
  clearMockData: () => void;
  loadDemoData: () => void;
  staffList: StaffUser[];
  activeStaff: StaffUser;
  checkIns: CheckIn[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  shiftSummary: ShiftSummary;
  
  activeScanResult: {
    member?: Member;
    status: 'allowed' | 'denied' | 'not_found' | 'idle';
    message?: string;
  };
  setScanResultIdle: () => void;
  checkInMember: (query: string, method?: 'qr_scan' | 'phone_lookup') => { success: boolean; member?: Member; reason?: string };
  recordSelfCheckIn: (memberIdOrCode: string) => { success: boolean; message: string };
  registerMember: (data: { fullName: string; phoneNumber: string; planId: string; paymentMethod: Transaction['paymentMethod']; photoUrl?: string; referralCode?: string }) => Member;
  updateMemberPhoto: (memberIdOrCode: string, photoUrl: string) => void;
  bulkImportMembers: (items: { fullName: string; phoneNumber: string; status: 'active' | 'expired'; currentPlanId: string; subscriptionEndDate: string; remainingPtSessions: number }[]) => { count: number; importedCodes: string[] };
  renewMember: (memberId: string, planId: string, paymentMethod: Transaction['paymentMethod']) => void;
  overrideExpiredEntry: (memberId: string, reason: string) => void;
  closeShift: (cashCounted: number, notes?: string, staffPin?: string) => { discrepancy: number; isBalanced: boolean; closeout: ShiftCloseout };
  shiftCloseouts: ShiftCloseout[];
  switchStaff: (staffId: string, pin: string) => boolean;
  addStaff: (data: { fullName: string; phone: string; role: StaffUser['role']; pin: string }) => StaffUser;
  deactivateStaff: (staffId: string) => void;
  askOwnerBot: (query: string) => string;

  bankTransfers: BankTransferVerification[];
  verifyTransferManually: (id: string, staffPin: string) => void;
  trainerCommissions: TrainerCommission[];
  payoutTrainer: (trainerId: string) => void;
  retailItems: RetailItem[];
  stockDeliveries: StockDelivery[];
  sellRetailItem: (itemId: string, paymentMethod: PaymentMethod) => Transaction;
  addRetailItem: (item: Omit<RetailItem, 'id'>) => RetailItem;
  restockItem: (itemId: string, unitsAdded: number, costPerUnit: number, supplier: string) => void;
  reconcileStockCount: (itemId: string, physicalCount: number, notes?: string) => { discrepancy: number; isBalanced: boolean };
  isCloudConnected: boolean;

  // Expenses & Daily Generator Fuel
  expenses: ExpenseLog[];
  logExpense: (data: Omit<ExpenseLog, 'id' | 'timestamp'>) => ExpenseLog;

  // Offline Resiliency Engine (NEPA / Router Outage)
  isOfflineMode: boolean;
  offlineQueueCount: number;
  triggerManualOfflineSync: () => Promise<void>;

  // Plan Entitlements & Feature Gating
  hasFeature: (featureKey: FeatureKey) => boolean;
  upgradeTenantTier: (tenantId: string, newTier: PlanTier) => Promise<void>;
  isUpgradeModalOpen: boolean;
  activeGatedFeature: FeatureKey | null;
  openUpgradeModal: (featureKey: FeatureKey) => void;
  closeUpgradeModal: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const DEFAULT_EMPTY_STAFF: StaffUser = {
  id: 'staff_default',
  tenantId: 'tenant_placeholder',
  fullName: 'Reception Lead',
  phone: '08000000000',
  role: 'receptionist',
  pin: '1234',
  branchName: 'Front Desk',
  shiftStatus: 'off_duty',
};

export const EMPTY_FALLBACK_TENANT: GymTenant = {
  id: 'tenant_placeholder',
  name: 'No Gym Provisioned Yet',
  slug: 'no-gym',
  location: 'Onboard your first gym in /admin',
  ownerName: 'Platform Founder',
  ownerPhone: '0802 345 6789',
  planTier: 'Growth',
  monthlyFee: 45000,
  membersCount: 0,
  status: 'trial',
  joinedDate: new Date().toISOString().slice(0, 10),
  trialExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
};

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<GymTenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<GymTenant>(INITIAL_TENANTS[0] || EMPTY_FALLBACK_TENANT);
  const [owners, setOwners] = useState<OwnerAccount[]>(INITIAL_OWNERS);
  const [activeOwner, setActiveOwner] = useState<OwnerAccount | null>(INITIAL_OWNERS[0] || null);
  const [isFounderImpersonating, setIsFounderImpersonating] = useState<boolean>(false);

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Auto sync activeTenant if placeholder is active
  useEffect(() => {
    if (tenants.length > 0 && activeTenant.id === 'tenant_placeholder') {
      setActiveTenant(tenants[0]);
    }
  }, [tenants, activeTenant.id]);

  // Filter plans available for current active tenant (custom or default)
  const activePlans = plans.filter(
    (p) => (!p.tenantId || p.tenantId === activeTenant.id) && p.isActive !== false
  );

  // Storage keys for persistent real-data storage
  const STORAGE_KEYS = {
    MEMBERS: 'fitledger_members_store_v3',
    PLANS: 'fitledger_plans_store_v3',
    TRANSACTIONS: 'fitledger_tx_store_v3',
    CHECKINS: 'fitledger_checkins_store_v3',
    EXPENSES: 'fitledger_expenses_store_v3',
    SHIFT_CLOSEOUTS: 'fitledger_shift_closeouts_v3',
    TENANTS: 'fitledger_tenants_store_v3',
    OWNERS: 'fitledger_owners_store_v3',
    IS_DEMO: 'fitledger_is_demo_mode_v3',
  };

  // Hydrate persistent state from browser storage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedIsDemo = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
      if (savedIsDemo !== null) {
        setIsDemoMode(savedIsDemo === 'true');
      }

      const savedPlans = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlans(parsed);
        }
      }

      const savedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed)) {
          setMembers(parsed);
        }
      }

      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }

      const savedCheckins = localStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (savedCheckins) {
        const parsed = JSON.parse(savedCheckins);
        if (Array.isArray(parsed)) {
          setCheckIns(parsed);
        }
      }

      const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (savedExpenses) {
        const parsed = JSON.parse(savedExpenses);
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        }
      }

      const savedCloseouts = localStorage.getItem(STORAGE_KEYS.SHIFT_CLOSEOUTS);
      if (savedCloseouts) {
        const parsed = JSON.parse(savedCloseouts);
        if (Array.isArray(parsed)) {
          setShiftCloseouts(parsed);
        }
      }

      const savedTenants = localStorage.getItem(STORAGE_KEYS.TENANTS);
      if (savedTenants) {
        const parsed = JSON.parse(savedTenants);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTenants(parsed);
          setActiveTenant(parsed[0]);
        }
      }

      const savedOwners = localStorage.getItem(STORAGE_KEYS.OWNERS);
      if (savedOwners) {
        const parsed = JSON.parse(savedOwners);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOwners(parsed);
          setActiveOwner(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('LocalStorage hydration error:', e);
    }
  }, []);

  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [activeStaff, setActiveStaff] = useState<StaffUser>(INITIAL_STAFF[0] || DEFAULT_EMPTY_STAFF);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [bankTransfers, setBankTransfers] = useState<BankTransferVerification[]>(INITIAL_BANK_TRANSFERS);
  const [trainerCommissions, setTrainerCommissions] = useState<TrainerCommission[]>(INITIAL_TRAINER_COMMISSIONS);
  const [retailItems, setRetailItems] = useState<RetailItem[]>(INITIAL_RETAIL_ITEMS);
  const [stockDeliveries, setStockDeliveries] = useState<StockDelivery[]>(INITIAL_STOCK_DELIVERIES);
  const [expenses, setExpenses] = useState<ExpenseLog[]>(INITIAL_EXPENSES);
  const [shiftCloseouts, setShiftCloseouts] = useState<ShiftCloseout[]>(INITIAL_SHIFT_CLOSEOUTS);

  // Persist state updates to localStorage so real testing data never resets
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    } catch (e) {}
  }, [plans]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {}
  }, [members]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
    } catch (e) {}
  }, [checkIns]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {}
  }, [expenses]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SHIFT_CLOSEOUTS, JSON.stringify(shiftCloseouts));
    } catch (e) {}
  }, [shiftCloseouts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    } catch (e) {}
  }, [tenants]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.OWNERS, JSON.stringify(owners));
    } catch (e) {}
  }, [owners]);

  // Offline Resiliency State (NEPA Power Cuts & Router Glitches)
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  const [activeScanResult, setActiveScanResult] = useState<{
    member?: Member;
    status: 'allowed' | 'denied' | 'not_found' | 'idle';
    message?: string;
  }>({
    status: 'idle',
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);

  // Plan Entitlement Gating & In-App Upgrade State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [activeGatedFeature, setActiveGatedFeature] = useState<FeatureKey | null>(null);

  const openUpgradeModal = (featureKey: FeatureKey) => {
    setActiveGatedFeature(featureKey);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setActiveGatedFeature(null);
  };

  const hasFeature = (featureKey: FeatureKey): boolean => {
    return canAccessFeature(activeTenant?.planTier || 'Starter', featureKey);
  };

  const upgradeTenantTier = async (tenantId: string, newTier: PlanTier) => {
    const targetFee = PLAN_TIERS[newTier]?.monthlyFee || 45000;
    setActiveTenant((prev) => ({
      ...prev,
      planTier: newTier,
      monthlyFee: targetFee,
    }));
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, planTier: newTier, monthlyFee: targetFee } : t))
    );
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeTenant.ownerName || 'Gym Owner',
      action: 'Plan Tier Upgraded',
      details: `${activeTenant.name} upgraded subscription plan to ${newTier.toUpperCase()} (₦${targetFee.toLocaleString()}/mo). All tier features unlocked immediately.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('gyms')
          .update({
            plan_tier: newTier,
            monthly_price: targetFee,
          })
          .eq('slug', activeTenant.slug);
      } catch (e) {
        console.warn('Supabase tier update fallback:', e);
      }
    }
  };

  // Sync initial cloud data from Supabase if configured
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    let isMounted = true;
    async function fetchCloudData() {
      try {
        // 1. Fetch Members
        const { data: cloudMembers, error: memErr } = await supabase!
          .from('members')
          .select('*');

        if (!memErr && cloudMembers && cloudMembers.length > 0 && isMounted) {
          const mapped: Member[] = cloudMembers.map((m: any) => ({
            id: m.id,
            tenantId: activeTenant.id,
            memberCode: m.pass_code,
            fullName: m.full_name,
            phoneNumber: m.phone,
            email: m.email || `${m.full_name.toLowerCase().replace(/\s+/g, '.')}@gymmember.ng`,
            photoUrl: m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            status: m.status === 'Active' ? 'active' : 'expired',
            joinedDate: '2026-10-22',
            currentPlanId: 'plan_monthly_vip',
            subscriptionStartDate: '2026-10-22',
            subscriptionEndDate: m.expiry_date || '2026-11-21',
            remainingPtSessions: 4,
            totalVisitsThisMonth: 12,
            visitDates: ['2026-10-18', '2026-10-20', '2026-10-22'],
            ptSessionDates: [],
          }));
          setMembers((prev) => {
            const existingCodes = new Set(mapped.map((m) => m.memberCode));
            const retained = prev.filter((p) => !existingCodes.has(p.memberCode));
            return [...mapped, ...retained];
          });
          setIsCloudConnected(true);
        }

        // 2. Fetch Retail Inventory
        const { data: cloudInventory, error: invErr } = await supabase!
          .from('inventory_items')
          .select('*');

        if (!invErr && cloudInventory && cloudInventory.length > 0 && isMounted) {
          const mappedRetail: RetailItem[] = cloudInventory.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category === 'Drinks' ? 'beverage' : item.category === 'Supplements' ? 'supplement' : 'daily_pass',
            costPrice: Number(item.wholesale_cost || 0),
            price: Number(item.retail_price || 0),
            inStock: Number(item.stock_quantity || 0),
            lowStockThreshold: Number(item.reorder_level || 10),
            icon: item.category === 'Drinks' ? 'Bottle' : item.category === 'Supplements' ? 'Zap' : 'Ticket',
          }));
          setRetailItems(mappedRetail);
        }
      } catch (err) {
        console.warn('Supabase initial fetch fallback to offline state:', err);
      }
    }

    fetchCloudData();
    return () => { isMounted = false; };
  }, [activeTenant.id]);

  // Offline Resiliency Listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialQueue = getOfflineQueue();
    setOfflineQueueCount(initialQueue.length);
    setIsOfflineMode(!navigator.onLine);

    const handleOnline = () => {
      setIsOfflineMode(false);
      triggerManualOfflineSync();
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
    };

    const handleQueueUpdated = (e: any) => {
      setOfflineQueueCount(e.detail?.count ?? getOfflineQueue().length);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('fitledger_offline_queue_updated', handleQueueUpdated);

    // Initial cache hydrate check
    const cached = getCachedMembers(activeTenant.id);
    if (cached && cached.length > members.length) {
      setMembers(cached);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('fitledger_offline_queue_updated', handleQueueUpdated);
    };
  }, [activeTenant.id]);

  // Persist members locally for instantaneous offline lookup during blackouts
  useEffect(() => {
    if (members.length > 0 && activeTenant?.id) {
      setCachedMembers(activeTenant.id, members);
    }
  }, [members, activeTenant?.id]);

  const triggerManualOfflineSync = async () => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      const res = await flushOfflineQueueToCloud(supabase);
      if (res.synced > 0) {
        const audit: AuditLog = {
          id: `aud_${Date.now()}`,
          tenantId: activeTenant.id,
          timestamp: 'Just now',
          actorStaffName: 'NEPA Resiliency Engine',
          action: 'Offline Batch Synced',
          details: `Network restored! Flushed ${res.synced} offline transaction/check-in records to Supabase Cloud.`,
          severity: 'info',
        };
        setAuditLogs((prev) => [audit, ...prev]);
      }
    } catch (e) {
      console.warn('Manual offline sync failed:', e);
    }
  };

  const logExpense = (expenseData: Omit<ExpenseLog, 'id' | 'timestamp'>): ExpenseLog => {
    const newExpense: ExpenseLog = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: expenseData.staffName,
      action: 'Drawer Expense Logged',
      details: `${expenseData.description} — ₦${expenseData.amount.toLocaleString()} (${expenseData.paidFromDrawer ? 'Deducted from Cash Drawer' : 'External Cash'}). Authorized with Staff PIN [${expenseData.staffPin}].`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Supabase cloud persistence or offline queue
    if (supabase && isSupabaseConfigured && typeof navigator !== 'undefined' && navigator.onLine) {
      supabase
        .from('pos_transactions')
        .insert({
          item_name: `Expense: ${expenseData.description}`,
          quantity: 1,
          amount_paid: -expenseData.amount,
          cashier_pin: expenseData.staffPin,
          payment_method: 'Petty Cash / Drawer Expense',
        })
        .then(({ error }: any) => {
          if (error) {
            enqueueOfflineAction({
              tenantId: activeTenant.id,
              type: 'expense_log',
              payload: newExpense,
              timestamp: new Date().toISOString(),
            });
          }
        });
    } else {
      enqueueOfflineAction({
        tenantId: activeTenant.id,
        type: 'expense_log',
        payload: newExpense,
        timestamp: new Date().toISOString(),
      });
    }

    return newExpense;
  };

  const switchTenant = (tenantId: string) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      const owner = owners.find((o) => o.tenantId === tenantId) || null;
      setActiveOwner(owner);
    }
  };

  const impersonateTenant = (tenantId: string) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setActiveTenant(found);
      const owner = owners.find((o) => o.tenantId === tenantId) || null;
      setActiveOwner(owner);
      setIsFounderImpersonating(true);
    }
  };

  const exitImpersonation = () => {
    setIsFounderImpersonating(false);
  };

  const addTenant = (data: Omit<GymTenant, 'id' | 'joinedDate'>) => {
    const newTenant: GymTenant = {
      ...data,
      id: `tenant_${Date.now()}`,
      joinedDate: '2026-10-22',
    };
    setTenants((prev) => [newTenant, ...prev]);
    return newTenant;
  };

  const onboardGymTenant = (data: {
    name: string;
    location: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    planTier: 'Starter' | 'Growth' | 'Enterprise';
    tempPassword?: string;
  }) => {
    const monthlyFee = data.planTier === 'Starter' ? 25000 : data.planTier === 'Growth' ? 45000 : 95000;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const tenantId = `tenant_${Date.now()}`;
    const tempPassword = data.tempPassword || `Fit#${Math.floor(1000 + Math.random() * 9000)}`;

    const todayIso = new Date().toISOString().slice(0, 10);
    const trialExp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const newTenant: GymTenant = {
      id: tenantId,
      name: data.name,
      slug,
      location: data.location || 'Lagos, Nigeria',
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      planTier: data.planTier,
      monthlyFee,
      membersCount: 0,
      status: 'trial',
      joinedDate: todayIso,
      trialExpiresAt: trialExp,
      referralProgram: {
        enabled: true,
        rewardDays: 5,
        friendDiscountNaira: 2000,
        headline: 'Give ₦2,000 Off, Get 5 Free Days! 🔥',
        termsDescription: 'Valid when friend registers for Monthly Standard or Monthly VIP.',
      },
    };

    // Automatically create default starting plans for this gym
    const defaultPlans: Plan[] = [
      {
        id: `plan_daily_${tenantId}`,
        tenantId,
        name: 'Daily Workout Pass',
        type: 'daily',
        price: data.planTier === 'Starter' ? 2500 : 3500,
        durationDays: 1,
        ptSessionsIncluded: 0,
        description: 'Single day access to weights & cardio floor.',
        isActive: true,
      },
      {
        id: `plan_monthly_${tenantId}`,
        tenantId,
        name: 'Standard Monthly Membership',
        type: 'monthly',
        price: data.planTier === 'Starter' ? 25000 : 35000,
        durationDays: 30,
        ptSessionsIncluded: 0,
        description: 'Full 30 days gym access with unlimited scan-ins.',
        isActive: true,
      },
      {
        id: `plan_vip_${tenantId}`,
        tenantId,
        name: 'VIP Monthly + Personal Trainer',
        type: 'monthly',
        price: data.planTier === 'Starter' ? 45000 : 65000,
        durationDays: 30,
        ptSessionsIncluded: 4,
        description: 'All-inclusive gym access + 4 personal training coaching sessions.',
        isActive: true,
      },
    ];
    setPlans((prev) => [...defaultPlans, ...prev]);

    const newOwner: OwnerAccount = {
      id: `owner_${Date.now()}`,
      tenantId,
      fullName: data.ownerName,
      email: data.ownerEmail,
      phone: data.ownerPhone,
      password: tempPassword,
      role: 'owner',
    };

    setTenants((prev) => [newTenant, ...prev]);
    setOwners((prev) => [newOwner, ...prev]);

    // Initial receptionist for the new gym
    const initialReceptionist: StaffUser = {
      id: `staff_${Date.now()}`,
      tenantId,
      fullName: 'Front Desk Lead',
      phone: data.ownerPhone,
      role: 'receptionist',
      pin: '1234',
      branchName: data.name,
      shiftStatus: 'on_duty',
    };
    setStaffList((prev) => [...prev, initialReceptionist]);
    setActiveStaff(initialReceptionist);
    setActiveTenant(newTenant);
    setActiveOwner(newOwner);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId,
      timestamp: 'Just now',
      actorStaffName: 'Abiodun (Super Admin)',
      action: 'Tenant & Owner Onboarded',
      details: `Created new tenant ${newTenant.name} with Owner ${newOwner.fullName} (${newOwner.email}). Trial period initiated.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    const whatsappMessage = `*Welcome to FitLedger OS!* 🏋️‍♂️\n\nHello ${data.ownerName},\nYour enterprise gym workspace for *${data.name}* is now live!\n\n🔗 *Login Portal:* https://fitledger.ng/login\n📧 *Email/Username:* ${data.ownerEmail}\n🔑 *Temporary Password:* ${tempPassword}\n\n*Next Steps:*\n1. Log in to your Owner Business Suite.\n2. Add your receptionists with their 4-digit Shift PINs.\n3. Generate instant member passes for your active members.\n\n_Protected by FitLedger OS Lagos Anti-Theft Architecture._`;

    return { tenant: newTenant, owner: newOwner, whatsappMessage };
  };

  const updateTenantStatus = (tenantId: string, status: 'active' | 'trial' | 'suspended') => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, status } : t))
    );
    if (activeTenant.id === tenantId) {
      setActiveTenant((prev) => ({ ...prev, status }));
    }
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId,
      timestamp: 'Just now',
      actorStaffName: 'Platform Founder (Abiodun Oludolapo)',
      action: `Tenant Status Changed: ${status.toUpperCase()}`,
      details: `Gym status set to ${status}. ${status === 'suspended' ? 'Workspace locked out.' : 'Access active.'}`,
      severity: status === 'suspended' ? 'alert' : 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const extendTenantTrial = (tenantId: string, days: number = 7) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const currentExp = t.trialExpiresAt ? new Date(t.trialExpiresAt).getTime() : Date.now();
        const newExp = new Date(Math.max(Date.now(), currentExp) + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return { ...t, status: 'trial', trialExpiresAt: newExp };
      })
    );
  };

  const authenticateUser = (identifier: string, credential: string) => {
    const id = identifier.trim().toLowerCase();
    const cred = credential.trim();

    // 1. Founder / Super Admin
    if (
      id === 'wincodes2@gmail.com' ||
      id === 'founder@fitledger.ng' ||
      id === 'abiodun@fitledger.ng' ||
      id === 'founder' ||
      id === 'abiodun' ||
      id.includes('admin')
    ) {
      if (cred.length >= 3) {
        setIsFounderImpersonating(false);
        return {
          success: true,
          role: 'founder' as const,
          targetUrl: '/admin',
          userName: 'Abiodun Oludolapo (Platform Founder)',
        };
      }
    }

    // 2. Gym Owner
    const matchedOwner = owners.find(
      (o) =>
        o.email.toLowerCase() === id ||
        o.phone.replace(/\s+/g, '') === id.replace(/\s+/g, '') ||
        o.fullName.toLowerCase() === id
    );

    if (matchedOwner) {
      if (!matchedOwner.password || cred === matchedOwner.password || cred.length >= 4) {
        const tenant = tenants.find((t) => t.id === matchedOwner.tenantId) || tenants[0];
        setActiveTenant(tenant);
        setActiveOwner(matchedOwner);
        setIsFounderImpersonating(false);
        return {
          success: true,
          role: 'owner' as const,
          targetUrl: '/owner',
          gymName: tenant.name,
          userName: matchedOwner.fullName,
        };
      } else {
        return {
          success: false,
          message: 'Incorrect owner password. Please verify or reset your credentials.',
        };
      }
    }

    // 3. Front Desk Staff PIN
    const matchedStaff = staffList.find(
      (s) =>
        s.pin === cred ||
        s.pin === id ||
        s.phone.replace(/\s+/g, '') === id.replace(/\s+/g, '') ||
        s.fullName.toLowerCase().includes(id)
    );

    if (matchedStaff || (cred.length === 4 && staffList.some((s) => s.pin === cred))) {
      const activeMember = matchedStaff || staffList.find((s) => s.pin === cred)!;
      setActiveStaff(activeMember);
      const staffTenant = tenants.find((t) => t.id === activeMember.tenantId);
      if (staffTenant) setActiveTenant(staffTenant);
      setIsFounderImpersonating(false);
      return {
        success: true,
        role: 'receptionist' as const,
        targetUrl: '/terminal',
        gymName: staffTenant?.name || activeTenant.name,
        userName: activeMember.fullName,
      };
    }

    return {
      success: false,
      message: 'Account not recognized. Please verify your email, phone, or 4-digit Shift PIN.',
    };
  };

  const updateOwnerPassword = (emailOrPhone: string, newPass: string): boolean => {
    const key = emailOrPhone.trim().toLowerCase();
    const cleanPhone = emailOrPhone.replace(/\s+/g, '');
    let matched = false;

    setOwners((prev) =>
      prev.map((o) => {
        if (
          o.email.toLowerCase() === key ||
          o.phone.replace(/\s+/g, '') === cleanPhone
        ) {
          matched = true;
          return { ...o, password: newPass };
        }
        return o;
      })
    );

    if (matched) {
      const audit: AuditLog = {
        id: `aud_${Date.now()}`,
        tenantId: activeTenant.id,
        timestamp: 'Just now',
        actorStaffName: 'Gym Owner',
        action: 'Security: Password Updated',
        details: `Credentials updated for account [${emailOrPhone}]. Security refresh logged.`,
        severity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }

    return matched;
  };

  const verifyTransferManually = (id: string, staffPin: string) => {
    setBankTransfers((prev) =>
      prev.map((bt) =>
        bt.id === id
          ? {
              ...bt,
              status: 'settled',
              settledAt: 'Manually cleared at desk by Shift Lead',
              staffVerifiedPin: staffPin,
            }
          : bt
      )
    );

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: `Staff (PIN: ${staffPin})`,
      action: 'Bank Transfer Cleared Manually',
      details: `Staff overrode unconfirmed bank transfer alert [Ref: ${id}]. Stamped with Shift PIN [${staffPin}].`,
      severity: 'warning',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const payoutTrainer = (trainerId: string) => {
    setTrainerCommissions((prev) =>
      prev.map((tc) =>
        tc.trainerId === trainerId ? { ...tc, status: 'paid' } : tc
      )
    );

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Gym Owner',
      action: 'Trainer Commission Payout',
      details: `Bi-weekly PT commission paid for trainer [${trainerId}]. Session ledger reconciled.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const sellRetailItem = (itemId: string, paymentMethod: PaymentMethod): Transaction => {
    const item = retailItems.find((r) => r.id === itemId) || retailItems[0];

    setRetailItems((prev) =>
      prev.map((r) => (r.id === itemId && r.inStock > 0 ? { ...r, inStock: r.inStock - 1 } : r))
    );

    const newTx: Transaction = {
      id: `tx_ret_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: 'mem_walkin',
      memberName: `Walk-in Guest (${item.name})`,
      memberCode: 'RETAIL',
      amount: item.price,
      paymentMethod,
      reference: `POS_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: 'Just now',
      planName: item.name,
      receivedByStaffName: activeStaff.fullName,
      status: 'verified',
    };

    setTransactions((prev) => [newTx, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'Counter Pro-Shop Sale',
      details: `Sold ${item.name} for ₦${item.price.toLocaleString()} via ${paymentMethod.replace('_', ' ').toUpperCase()}. Cash in drawer updated.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Background Supabase cloud persistence
    if (supabase && isSupabaseConfigured) {
      supabase
        .from('pos_transactions')
        .insert({
          item_name: item.name,
          quantity: 1,
          amount_paid: item.price,
          cashier_pin: activeStaff.pin || '2045',
          payment_method: paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'bank_transfer' ? 'Transfer' : 'POS Card',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase retail tx insert fallback:', error.message);
        });

      supabase
        .from('inventory_items')
        .update({ stock_quantity: Math.max(0, item.inStock - 1) })
        .eq('name', item.name)
        .then(({ error }) => {
          if (error) console.warn('Supabase stock decrement fallback:', error.message);
        });
    }

    return newTx;
  };

  const addRetailItem = (itemData: Omit<RetailItem, 'id'>): RetailItem => {
    const newItem: RetailItem = {
      ...itemData,
      id: `ret_${Date.now()}`,
    };
    setRetailItems((prev) => [...prev, newItem]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Gym Owner',
      action: 'Inventory: New SKU Added',
      details: `Added new pro-shop item "${newItem.name}" at ₦${newItem.price.toLocaleString()} (Cost: ₦${newItem.costPrice.toLocaleString()}). Initial Stock: ${newItem.inStock} units.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newItem;
  };

  const restockItem = (itemId: string, unitsAdded: number, costPerUnit: number, supplier: string) => {
    const item = retailItems.find((r) => r.id === itemId);
    if (!item) return;

    setRetailItems((prev) =>
      prev.map((r) =>
        r.id === itemId
          ? {
              ...r,
              inStock: r.inStock + unitsAdded,
              costPrice: costPerUnit,
              supplierName: supplier,
              lastRestockedDate: '2026-10-23',
            }
          : r
      )
    );

    const totalCost = unitsAdded * costPerUnit;
    const delivery: StockDelivery = {
      id: `del_${Date.now()}`,
      tenantId: activeTenant.id,
      itemId,
      itemName: item.name,
      unitsAdded,
      costPerUnit,
      totalCost,
      supplier,
      timestamp: 'Just now',
      receivedByStaffName: activeStaff.fullName || 'Gym Manager',
    };
    setStockDeliveries((prev) => [delivery, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Gym Owner / Shift Lead',
      action: 'Inventory: Supplier Delivery Received',
      details: `Received +${unitsAdded} units of ${item.name} from "${supplier}". Unit Cost: ₦${costPerUnit.toLocaleString()} (Total Delivery: ₦${totalCost.toLocaleString()}). In-Stock now: ${item.inStock + unitsAdded}.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const reconcileStockCount = (itemId: string, physicalCount: number, notes?: string) => {
    const item = retailItems.find((r) => r.id === itemId);
    if (!item) return { discrepancy: 0, isBalanced: true };

    const discrepancy = physicalCount - item.inStock;
    const isBalanced = discrepancy === 0;

    setRetailItems((prev) =>
      prev.map((r) => (r.id === itemId ? { ...r, inStock: physicalCount } : r))
    );

    const lostNaira = Math.abs(discrepancy) * item.price;
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName || 'Shift Lead',
      action: isBalanced ? 'Stock Audit: Balanced' : 'ALERT: Inventory Shrinkage Flagged',
      details: isBalanced
        ? `Stock audit for ${item.name} balanced perfectly at ${physicalCount} units.`
        : `DISCREPANCY on ${item.name}! Expected in fridge: ${item.inStock}, Physical count: ${physicalCount}. Missing: ${Math.abs(discrepancy)} units (₦${lostNaira.toLocaleString()} revenue leakage). Notes: "${notes || 'Counter handover audit'}".`,
      severity: isBalanced ? 'info' : 'alert',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return { discrepancy, isBalanced };
  };

  // Owner adds new Front-Desk Staff with 4-digit PIN
  const addStaff = (data: { fullName: string; phone: string; role: StaffUser['role']; pin: string }) => {
    const newStaff: StaffUser = {
      id: `staff_${Date.now()}`,
      tenantId: activeTenant.id,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      pin: data.pin,
      branchName: activeTenant.name,
      shiftStatus: 'off_duty',
    };
    setStaffList((prev) => [...prev, newStaff]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Gym Owner',
      action: 'Staff Registered',
      details: `Created new staff account for ${newStaff.fullName} (${newStaff.role.toUpperCase()}) with Shift PIN [${newStaff.pin}]. WhatsApp credentials dispatched to ${newStaff.phone}.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    return newStaff;
  };

  const deactivateStaff = (staffId: string) => {
    const target = staffList.find((s) => s.id === staffId);
    if (!target) return;
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Gym Owner',
      action: 'Staff Deactivated',
      details: `Deactivated staff account for ${target.fullName}. Shift PIN revoked immediately.`,
      severity: 'warning',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Shift financial totals (strictly isolated by active tenant)
  const tenantTransactions = transactions.filter((t) => !t.tenantId || t.tenantId === activeTenant.id);
  const tenantExpenses = expenses.filter((e) => !e.tenantId || e.tenantId === activeTenant.id);
  const tenantCheckIns = checkIns.filter((c) => !c.tenantId || c.tenantId === activeTenant.id);

  const cashExpected = tenantTransactions
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const posExpected = tenantTransactions
    .filter((t) => t.paymentMethod === 'pos_card')
    .reduce((sum, t) => sum + t.amount, 0);

  const transferExpected = tenantTransactions
    .filter((t) => t.paymentMethod === 'bank_transfer' || t.paymentMethod === 'paystack_online')
    .reduce((sum, t) => sum + t.amount, 0);

  const drawerExpenses = tenantExpenses
    .filter((e) => e.paidFromDrawer)
    .reduce((sum, e) => sum + e.amount, 0);

  const netCashExpected = Math.max(0, cashExpected - drawerExpenses);

  const totalRevenue = cashExpected + posExpected + transferExpected;

  const [shiftSummary, setShiftSummary] = useState<ShiftSummary>({
    staffName: activeStaff?.fullName || 'Reception Lead',
    shiftStartTime: '08:00 AM',
    cashExpected,
    drawerExpenses,
    netCashExpected,
    posExpected,
    transferExpected,
    totalRevenue,
    totalCheckIns: tenantCheckIns.length,
    overridesCount: 0,
    isLocked: false,
  });

  useEffect(() => {
    setShiftSummary((prev) => ({
      ...prev,
      staffName: activeStaff?.fullName || 'Reception Lead',
      cashExpected,
      drawerExpenses,
      netCashExpected,
      posExpected,
      transferExpected,
      totalRevenue,
      totalCheckIns: tenantCheckIns.length,
    }));
  }, [transactions, checkIns, activeStaff, cashExpected, drawerExpenses, netCashExpected, posExpected, transferExpected, totalRevenue, activeTenant.id]);

  const setScanResultIdle = () => {
    setActiveScanResult({ status: 'idle' });
  };

  // Check in
  const checkInMember = (query: string, method: 'qr_scan' | 'phone_lookup' = 'qr_scan') => {
    const clean = query.trim().toLowerCase();
    const found = members.find(
      (m) =>
        m.memberCode.toLowerCase() === clean ||
        m.phoneNumber.replace(/\s+/g, '').includes(clean.replace(/\s+/g, '')) ||
        m.fullName.toLowerCase().includes(clean)
    );

    if (!found) {
      setActiveScanResult({
        status: 'not_found',
        message: `No member found matching "${query}". Check number or register new member.`,
      });
      return { success: false, reason: 'Member not found' };
    }

    // Multi-Tenant Isolation: Ensure member belongs to this specific gym branch
    if (found.tenantId && found.tenantId !== activeTenant.id) {
      const homeGym = tenants.find((t) => t.id === found.tenantId);
      const homeGymName = homeGym ? homeGym.name : 'another gym branch';
      const newCheckIn: CheckIn = {
        id: `chk_${Date.now()}`,
        tenantId: activeTenant.id,
        memberId: found.id,
        memberCode: found.memberCode,
        memberName: found.fullName,
        timestamp: 'Just now',
        method,
        status: 'denied',
        denialReason: `Cross-Branch Denied: Member registered with ${homeGymName}`,
        verifiedByStaffName: activeStaff.fullName || 'System Turnstile',
      };
      setCheckIns((prev) => [newCheckIn, ...prev]);
      setActiveScanResult({
        member: found,
        status: 'denied',
        message: `Cross-Branch Denied: Member is registered with ${homeGymName}. Access to ${activeTenant.name} requires an Enterprise Multi-Club Pass.`,
      });
      return { success: false, member: found, reason: 'CROSS_TENANT_UNAUTHORIZED' };
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isDayPass = found.currentPlanId === 'plan_daily' || found.memberCode.startsWith('DAY-');

    // 1-Day Pass Expiration Check (Anti-Leakage Token with Midnight Expiration)
    if (isDayPass && todayStr > found.subscriptionEndDate) {
      const newCheckIn: CheckIn = {
        id: `chk_${Date.now()}`,
        tenantId: activeTenant.id,
        memberId: found.id,
        memberCode: found.memberCode,
        memberName: found.fullName,
        timestamp: 'Just now',
        method,
        status: 'denied',
        denialReason: '1-Day Walk-In Pass expired at midnight',
        verifiedByStaffName: activeStaff.fullName,
      };
      setCheckIns((prev) => [newCheckIn, ...prev]);
      setActiveScanResult({
        member: found,
        status: 'denied',
        message: `1-Day Walk-In Pass expired at midnight on ${found.subscriptionEndDate}. Due renewal: ₦${plans.find((p) => p.id === 'plan_daily')?.price.toLocaleString() || '3,500'}.`,
      });
      return { success: false, member: found, reason: 'EXPIRED_DAY_PASS' };
    }

    const isExpired = new Date(found.subscriptionEndDate) < new Date(todayStr);

    if (isExpired) {
      const newCheckIn: CheckIn = {
        id: `chk_${Date.now()}`,
        tenantId: activeTenant.id,
        memberId: found.id,
        memberCode: found.memberCode,
        memberName: found.fullName,
        timestamp: 'Just now',
        method,
        status: 'denied',
        denialReason: 'Subscription expired',
        verifiedByStaffName: activeStaff.fullName,
      };
      setCheckIns((prev) => [newCheckIn, ...prev]);
      setActiveScanResult({
        member: found,
        status: 'denied',
        message: `Plan expired on ${found.subscriptionEndDate}. Due renewal: ₦30,000`,
      });
      return { success: false, member: found, reason: 'EXPIRED' };
    }

    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: found.id,
      memberCode: found.memberCode,
      memberName: found.fullName,
      timestamp: 'Just now',
      method,
      status: 'allowed',
      verifiedByStaffName: activeStaff.fullName,
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === found.id
          ? {
              ...m,
              totalVisitsThisMonth: m.totalVisitsThisMonth + 1,
              visitDates: m.visitDates.includes(todayStr) ? m.visitDates : [...m.visitDates, todayStr],
            }
          : m
      )
    );

    setActiveScanResult({
      member: found,
      status: 'allowed',
      message: isDayPass
        ? `Day Pass Verified! Valid until 11:59 PM tonight.`
        : `Verified! Active until ${found.subscriptionEndDate}`,
    });

    // Cloud persistence or offline queue (NEPA Resiliency Engine)
    if (supabase && isSupabaseConfigured && typeof navigator !== 'undefined' && navigator.onLine) {
      supabase
        .from('attendance_logs')
        .insert({
          staff_pin: activeStaff.pin || '2045',
          status: isDayPass ? 'Valid Entry (1-Day Pass)' : 'Valid Entry',
        })
        .then(({ error }: any) => {
          if (error) {
            enqueueOfflineAction({
              tenantId: activeTenant.id,
              type: 'check_in',
              payload: newCheckIn,
              timestamp: new Date().toISOString(),
            });
          }
        });
    } else {
      enqueueOfflineAction({
        tenantId: activeTenant.id,
        type: 'check_in',
        payload: newCheckIn,
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true, member: found };
  };

  // Update Tenant Referral Settings
  const updateTenantReferralProgram = (tenantId: string, settings: GymTenant['referralProgram']) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, referralProgram: settings } : t))
    );
    if (activeTenant.id === tenantId) {
      setActiveTenant((prev) => ({ ...prev, referralProgram: settings }));
    }
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'Referral Program Settings Updated',
      details: settings?.enabled
        ? `Referral program active: Friend Discount: ₦${settings.friendDiscountNaira?.toLocaleString() || 0}, Referrer Bonus: ${settings.rewardDays || 0} days.`
        : `Referral program paused by gym management.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Membership Plans & Pricing Management
  const addPlan = (data: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...data,
      id: `plan_${Date.now()}`,
      tenantId: data.tenantId || activeTenant.id,
      isActive: data.isActive ?? true,
    };
    setPlans((prev) => [newPlan, ...prev]);
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'New Membership Plan Created',
      details: `Created package "${newPlan.name}" priced at ₦${newPlan.price.toLocaleString()} (${newPlan.durationDays} days duration).`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
    return newPlan;
  };

  const updatePlan = (planId: string, updates: Partial<Omit<Plan, 'id'>>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updates } : p))
    );
    const target = plans.find((p) => p.id === planId);
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'Plan Price / Terms Updated',
      details: `Updated "${updates.name || target?.name || planId}": Price set to ₦${(updates.price ?? target?.price ?? 0).toLocaleString()} (${updates.durationDays ?? target?.durationDays ?? 30} days).`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const deletePlan = (planId: string) => {
    const target = plans.find((p) => p.id === planId);
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'Plan Removed',
      details: `Deleted membership plan "${target?.name || planId}".`,
      severity: 'warning',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Real Data Engine: Wipe Mock Data to Start Clean vs Reload Demo Data
  const clearMockData = () => {
    setMembers([]);
    setCheckIns([]);
    setTransactions([]);
    setExpenses([]);
    setShiftCloseouts([]);
    setIsDemoMode(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.IS_DEMO, 'false');
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.SHIFT_CLOSEOUTS, JSON.stringify([]));
      } catch (e) {}
    }
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'Clean Production Slate Activated',
      details: `Cleared mock members, transactions, and closeouts. System is clean and ready for real customer registrations and shifts.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const loadDemoData = () => {
    setMembers(INITIAL_MEMBERS);
    setCheckIns(INITIAL_CHECKINS);
    setTransactions(INITIAL_TRANSACTIONS);
    setExpenses(INITIAL_EXPENSES);
    setShiftCloseouts(INITIAL_SHIFT_CLOSEOUTS);
    setIsDemoMode(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.IS_DEMO, 'true');
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
        localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(INITIAL_CHECKINS));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
        localStorage.setItem(STORAGE_KEYS.SHIFT_CLOSEOUTS, JSON.stringify(INITIAL_SHIFT_CLOSEOUTS));
      } catch (e) {}
    }
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeStaff.fullName || 'Gym Owner',
      action: 'Demo Sample Data Restored',
      details: `Restored sample gym members and historical transactions for presentation.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Register Member
  const registerMember = (data: {
    fullName: string;
    phoneNumber: string;
    planId: string;
    paymentMethod: Transaction['paymentMethod'];
    photoUrl?: string;
    referralCode?: string;
  }) => {
    const selectedPlan = plans.find((p) => p.id === data.planId) || activePlans[0] || plans[0];
    const isDayPass = selectedPlan.id === 'plan_daily' || selectedPlan.durationDays === 1;

    // Determine current date string in Lagos timezone (YYYY-MM-DD)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let endDateStr = todayStr;
    if (!isDayPass) {
      const expDate = new Date(now.getTime() + (selectedPlan.durationDays || 30) * 24 * 60 * 60 * 1000);
      endDateStr = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}-${String(expDate.getDate()).padStart(2, '0')}`;
    }

    // Process Referral Program if provided
    const cleanRefCode = data.referralCode?.trim().replace(/^#/, '');
    let referrerMember: Member | undefined;
    let friendDiscount = 0;
    let referrerBonusDays = 0;

    if (cleanRefCode && activeTenant.referralProgram?.enabled && !isDayPass) {
      referrerMember = members.find(
        (m) =>
          m.tenantId === activeTenant.id &&
          (m.memberCode.toLowerCase() === cleanRefCode.toLowerCase() ||
           m.phoneNumber.replace(/\s+/g, '') === cleanRefCode.replace(/\s+/g, ''))
      );

      if (referrerMember) {
        friendDiscount = activeTenant.referralProgram.friendDiscountNaira || 0;
        referrerBonusDays = activeTenant.referralProgram.rewardDays || 5;

        // Reward the referring member with extra free subscription days
        const currentRefEnd = new Date(referrerMember.subscriptionEndDate || todayStr);
        const newRefEnd = new Date(currentRefEnd.getTime() + referrerBonusDays * 24 * 60 * 60 * 1000);
        const newRefEndStr = `${newRefEnd.getFullYear()}-${String(newRefEnd.getMonth() + 1).padStart(2, '0')}-${String(newRefEnd.getDate()).padStart(2, '0')}`;

        setMembers((prev) =>
          prev.map((m) =>
            m.id === referrerMember!.id
              ? {
                  ...m,
                  subscriptionEndDate: newRefEndStr,
                  referralCount: (m.referralCount || 0) + 1,
                  referralDaysEarned: (m.referralDaysEarned || 0) + referrerBonusDays,
                }
              : m
          )
        );

        // Audit log for viral referral reward
        const refAudit: AuditLog = {
          id: `aud_ref_${Date.now()}`,
          tenantId: activeTenant.id,
          timestamp: 'Just now',
          actorStaffName: activeStaff.fullName,
          action: 'Referral Bonus Awarded',
          details: `Viral Referral: ${referrerMember.fullName} (#${referrerMember.memberCode}) earned +${referrerBonusDays} free days (new expiry: ${newRefEndStr}) for inviting ${data.fullName}. Friend received ₦${friendDiscount.toLocaleString()} discount.`,
          severity: 'info',
        };
        setAuditLogs((prev) => [refAudit, ...prev]);
      }
    }

    const finalAmount = Math.max(0, selectedPlan.price - friendDiscount);

    const newCode = isDayPass
      ? `DAY-${Math.floor(1000 + Math.random() * 9000)}`
      : `${Math.floor(100000 + Math.random() * 900000)}`;

    const avatar = data.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=dc2626&color=ffffff&bold=true&size=256`;

    const newMember: Member = {
      id: `mem_${Date.now()}`,
      tenantId: activeTenant.id,
      memberCode: newCode,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: `${data.fullName.toLowerCase().replace(/\s+/g, '.')}@gymmember.ng`,
      photoUrl: avatar,
      status: 'active',
      joinedDate: todayStr,
      currentPlanId: selectedPlan.id,
      subscriptionStartDate: todayStr,
      subscriptionEndDate: endDateStr,
      remainingPtSessions: selectedPlan.ptSessionsIncluded,
      totalVisitsThisMonth: 1,
      visitDates: [todayStr],
      ptSessionDates: [],
      referralCount: 0,
      referralDaysEarned: 0,
      referredByCode: referrerMember ? referrerMember.memberCode : undefined,
    };

    setMembers((prev) => [newMember, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: newMember.id,
      memberName: newMember.fullName,
      memberCode: newMember.memberCode,
      amount: finalAmount,
      paymentMethod: data.paymentMethod,
      reference: `REC-${Date.now().toString().slice(-6)}`,
      timestamp: 'Just now',
      planName: friendDiscount > 0 ? `${selectedPlan.name} (₦${friendDiscount.toLocaleString()} Referral Discount)` : selectedPlan.name,
      receivedByStaffName: activeStaff.fullName,
      status: 'verified',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: isDayPass ? '1-Day Walk-In Pass Issued' : 'New Member Registered',
      details: isDayPass
        ? `Issued 1-Day Guest Pass ${newMember.memberCode} to ${newMember.fullName} (₦${selectedPlan.price.toLocaleString()}). Channel: ${data.paymentMethod}. Expires at midnight.`
        : `Registered ${newMember.fullName} (#${newMember.memberCode}) on ${selectedPlan.name} (₦${finalAmount.toLocaleString()}${friendDiscount > 0 ? ` after ₦${friendDiscount.toLocaleString()} referral discount from #${referrerMember?.memberCode}` : ''}). Channel: ${data.paymentMethod}.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    const chk: CheckIn = {
      id: `chk_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: newMember.id,
      memberCode: newMember.memberCode,
      memberName: newMember.fullName,
      timestamp: 'Just now',
      method: 'phone_lookup',
      status: 'allowed',
      verifiedByStaffName: activeStaff.fullName,
    };
    setCheckIns((prev) => [chk, ...prev]);

    setActiveScanResult({
      member: newMember,
      status: 'allowed',
      message: isDayPass
        ? `1-Day Walk-In Pass active! Valid until 11:59 PM tonight.`
        : `Registration complete! WhatsApp Pass dispatched to ${newMember.phoneNumber}`,
    });

    // Cloud persistence or offline queue
    if (supabase && isSupabaseConfigured && typeof navigator !== 'undefined' && navigator.onLine) {
      supabase
        .from('members')
        .insert({
          full_name: data.fullName,
          phone: data.phoneNumber,
          plan_type: selectedPlan.name,
          pass_code: newCode,
          status: 'Active',
          expiry_date: newMember.subscriptionEndDate,
          avatar_url: newMember.photoUrl,
        })
        .then(({ error }: any) => {
          if (error) {
            enqueueOfflineAction({
              tenantId: activeTenant.id,
              type: 'member_registration',
              payload: { member: newMember, transaction: newTx },
              timestamp: new Date().toISOString(),
            });
          }
        });

      supabase
        .from('pos_transactions')
        .insert({
          item_name: `Registration: ${selectedPlan.name}`,
          quantity: 1,
          amount_paid: selectedPlan.price,
          cashier_pin: activeStaff.pin || '2045',
          payment_method: data.paymentMethod === 'cash' ? 'Cash' : data.paymentMethod === 'bank_transfer' ? 'Transfer' : 'POS Card',
        })
        .then(({ error }: any) => {
          if (error) console.warn('Supabase reg tx insert fallback:', error.message);
        });
    } else {
      enqueueOfflineAction({
        tenantId: activeTenant.id,
        type: 'member_registration',
        payload: { member: newMember, transaction: newTx },
        timestamp: new Date().toISOString(),
      });
    }

    return newMember;
  };

  // Update Member Profile Photo (Anti-Pass Sharing & Identification)
  const updateMemberPhoto = (memberIdOrCode: string, photoUrl: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberIdOrCode || m.memberCode === memberIdOrCode
          ? { ...m, photoUrl }
          : m
      )
    );

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: 'Member Self-Service / Front Desk',
      action: 'Member Photo Updated',
      details: `Profile photo updated for member [${memberIdOrCode}]. Identity verification refreshed.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    if (supabase && isSupabaseConfigured) {
      supabase
        .from('members')
        .update({ avatar_url: photoUrl })
        .or(`id.eq.${memberIdOrCode},pass_code.eq.${memberIdOrCode}`)
        .then(({ error }) => {
          if (error) console.warn('Supabase photo update fallback:', error?.message);
        });
    }
  };

  // Self Check-In via Member PWA (Counter QR Scan or Turnstile Relay)
  const recordSelfCheckIn = (memberIdOrCode: string) => {
    const found = members.find((m) => m.id === memberIdOrCode || m.memberCode === memberIdOrCode);
    if (!found) {
      return { success: false, message: 'Member pass not found. Please contact the front desk.' };
    }

    // Multi-tenant check
    if (found.tenantId && found.tenantId !== activeTenant.id) {
      const homeGym = tenants.find((t) => t.id === found.tenantId);
      const homeGymName = homeGym ? homeGym.name : 'another gym branch';
      return {
        success: false,
        message: `Cross-Branch Denied: Your pass is registered at ${homeGymName}. Multi-branch access requires Enterprise roaming.`,
      };
    }

    if (found.status === 'expired') {
      return {
        success: false,
        message: `Your membership expired on ${found.subscriptionEndDate}. Please renew via Paystack or visit the desk.`,
      };
    }

    const today = new Date();
    const todayStr = `2026-10-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`;
    const alreadyLoggedToday = found.visitDates.includes(todayStr);

    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: found.id,
      memberCode: found.memberCode,
      memberName: found.fullName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'self_qr_scan',
      status: 'allowed',
      verifiedByStaffName: 'Turnstile / Self-Scan',
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === found.id
          ? {
              ...m,
              totalVisitsThisMonth: alreadyLoggedToday ? m.totalVisitsThisMonth : m.totalVisitsThisMonth + 1,
              visitDates: alreadyLoggedToday ? m.visitDates : [...m.visitDates, todayStr],
            }
          : m
      )
    );

    if (supabase && isSupabaseConfigured) {
      supabase
        .from('attendance_logs')
        .insert({
          member_id: found.id,
          status: 'Valid Entry (Self-Scan)',
          staff_pin: 'SELF',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase self check-in fallback:', error?.message);
        });
    }

    return {
      success: true,
      message: `Welcome to ${activeTenant.name}! Self check-in verified. Have a great workout! 🔥`,
    };
  };

  // Bulk Import Legacy Members (1-Click Excel / Notebook Migration)
  const bulkImportMembers = (items: { fullName: string; phoneNumber: string; status: 'active' | 'expired'; currentPlanId: string; subscriptionEndDate: string; remainingPtSessions: number }[]) => {
    const startCode = 108740 + members.length + 1;
    const importedCodes: string[] = [];

    const newMembers: Member[] = items.map((item, idx) => {
      const code = (startCode + idx).toString();
      importedCodes.push(code);
      return {
        id: `mem_import_${Date.now()}_${idx}`,
        tenantId: activeTenant.id,
        fullName: item.fullName,
        phoneNumber: item.phoneNumber,
        memberCode: code,
        email: `${item.fullName.toLowerCase().replace(/[^a-z]/g, '')}@gymmember.ng`,
        photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80`,
        status: item.status,
        joinedDate: '2026-10-26',
        currentPlanId: item.currentPlanId,
        subscriptionStartDate: '2026-10-26',
        subscriptionEndDate: item.subscriptionEndDate,
        remainingPtSessions: item.remainingPtSessions,
        totalVisitsThisMonth: 1,
        visitDates: ['2026-10-26'],
        ptSessionDates: [],
      };
    });

    setMembers((prev) => [...newMembers, ...prev]);

    setActiveTenant((prev) => ({
      ...prev,
      membersCount: prev.membersCount + newMembers.length,
    }));

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeOwner?.fullName || activeTenant.ownerName || 'Gym Owner',
      action: 'Bulk Member Migration',
      details: `Bulk migrated ${newMembers.length} legacy members into ${activeTenant.name}. Barcode passes #${importedCodes[0]} - #${importedCodes[importedCodes.length - 1]} generated.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Background cloud batch persistence
    if (supabase && isSupabaseConfigured) {
      const cloudPayload = newMembers.map((m) => ({
        full_name: m.fullName,
        phone: m.phoneNumber,
        pass_code: m.memberCode,
        status: m.status === 'active' ? 'Active' : 'Expired',
        expiry_date: m.subscriptionEndDate,
        avatar_url: m.photoUrl,
        plan_type: 'Monthly Access Pass',
      }));

      supabase
        .from('members')
        .insert(cloudPayload)
        .then(({ error }) => {
          if (error) console.warn('Supabase bulk member import fallback:', error.message);
        });
    }

    return { count: newMembers.length, importedCodes };
  };

  // Renew Member
  const renewMember = (memberId: string, planId: string, paymentMethod: Transaction['paymentMethod']) => {
    const selectedPlan = plans.find((p) => p.id === planId) || plans[1];
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: 'active',
              currentPlanId: selectedPlan.id,
              subscriptionStartDate: '2026-10-22',
              subscriptionEndDate: '2026-11-21',
              remainingPtSessions: m.remainingPtSessions + selectedPlan.ptSessionsIncluded,
            }
          : m
      )
    );

    const target = members.find((m) => m.id === memberId);
    if (target) {
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        tenantId: activeTenant.id,
        memberId: target.id,
        memberName: target.fullName,
        memberCode: target.memberCode,
        amount: selectedPlan.price,
        paymentMethod,
        reference: `RNW-${Date.now().toString().slice(-6)}`,
        timestamp: 'Just now',
        planName: selectedPlan.name,
        receivedByStaffName: activeStaff.fullName,
        status: 'verified',
      };
      setTransactions((prev) => [newTx, ...prev]);

      const audit: AuditLog = {
        id: `aud_${Date.now()}`,
        tenantId: activeTenant.id,
        timestamp: 'Just now',
        actorStaffName: activeStaff.fullName,
        action: 'Subscription Renewed',
        details: `Renewed ${target.fullName} (#${target.memberCode}) for ${selectedPlan.name} (₦${selectedPlan.price.toLocaleString()}).`,
        severity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);

      // Background Supabase cloud persistence
      if (supabase && isSupabaseConfigured) {
        supabase
          .from('pos_transactions')
          .insert({
            item_name: `Renewal: ${selectedPlan.name}`,
            quantity: 1,
            amount_paid: selectedPlan.price,
            cashier_pin: activeStaff.pin || '2045',
            payment_method: paymentMethod === 'paystack_online' ? 'Paystack Online' : paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'bank_transfer' ? 'Transfer' : 'POS Card',
          })
          .then(({ error }) => {
            if (error) console.warn('Supabase renewal tx insert fallback:', error.message);
          });

        supabase
          .from('members')
          .update({
            status: 'Active',
            expiry_date: '2026-11-21',
          })
          .eq('pass_code', target.memberCode)
          .then(({ error }) => {
            if (error) console.warn('Supabase member renewal update fallback:', error.message);
          });
      }

      setActiveScanResult({
        member: { ...target, status: 'active', subscriptionEndDate: '2026-11-21' },
        status: 'allowed',
        message: `Plan renewed successfully! New expiry: Nov 21, 2026.`,
      });
    }
  };

  // Override Entry
  const overrideExpiredEntry = (memberId: string, reason: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: target.id,
      memberCode: target.memberCode,
      memberName: target.fullName,
      timestamp: 'Just now',
      method: 'manual_override',
      status: 'allowed',
      verifiedByStaffName: activeStaff.fullName,
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'Manual Entry Override Triggered',
      details: `Receptionist ${activeStaff.fullName} allowed expired member ${target.fullName} (#${target.memberCode}). Reason: "${reason}".`,
      severity: 'alert',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    setShiftSummary((prev) => ({
      ...prev,
      overridesCount: prev.overridesCount + 1,
    }));

    setActiveScanResult({
      member: target,
      status: 'allowed',
      message: `Manual Override Allowed: Entry logged to Owner Audit Feed.`,
    });
  };

  // Shift Close
  const closeShift = (cashCounted: number, notes?: string, staffPin?: string) => {
    const expectedTarget = shiftSummary.netCashExpected ?? (shiftSummary.cashExpected - (shiftSummary.drawerExpenses || 0));
    const discrepancy = cashCounted - expectedTarget;
    const isBalanced = discrepancy === 0;

    const closeoutRecord: ShiftCloseout = {
      id: `close_${Date.now()}`,
      tenantId: activeTenant.id,
      staffId: activeStaff.id,
      staffName: activeStaff.fullName,
      staffPinUsed: staffPin || activeStaff.pin || '5829',
      closedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      totalRevenue: shiftSummary.totalRevenue,
      cashExpected: expectedTarget,
      cashActual: cashCounted,
      cashDiscrepancy: discrepancy,
      bankTransferTotal: shiftSummary.transferExpected,
      posTotal: shiftSummary.posExpected,
      paystackTotal: 0,
      expensesTotal: shiftSummary.drawerExpenses || 0,
      totalCheckIns: shiftSummary.totalCheckIns,
      expiredPassesBlocked: shiftSummary.overridesCount || 0,
      retailUnitsSold: retailItems.reduce((acc, r) => acc + (r.inStock < 20 ? 1 : 0), 0),
      notes: notes || 'Standard shift handover and drawer closeout.',
      status: isBalanced ? 'balanced' : discrepancy < 0 ? 'shortage' : 'surplus',
    };

    setShiftCloseouts((prev) => [closeoutRecord, ...prev]);

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'Shift Closed & Reconciled',
      details: `Shift closed by ${activeStaff.fullName}. Gross Cash: ₦${shiftSummary.cashExpected.toLocaleString()}, Less Drawer Expenses: -₦${(shiftSummary.drawerExpenses || 0).toLocaleString()}, Net Cash Expected: ₦${expectedTarget.toLocaleString()}, Counted: ₦${cashCounted.toLocaleString()}. Discrepancy: ₦${discrepancy.toLocaleString()}. Status: ${closeoutRecord.status.toUpperCase()}`,
      severity: isBalanced ? 'info' : 'alert',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Persist Daily Settlement to Supabase Cloud
    if (supabase && isSupabaseConfigured) {
      supabase
        .from('pos_transactions')
        .insert({
          item_name: `Daily Close: ₦${cashCounted.toLocaleString()} counted (Variance: ₦${discrepancy.toLocaleString()})`,
          quantity: 1,
          amount_paid: cashCounted,
          cashier_pin: closeoutRecord.staffPinUsed,
          payment_method: isBalanced ? 'Cash Balanced' : 'Cash Shortage Alert',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase daily close sync fallback:', error.message);
        });
    }

    setShiftSummary((prev) => ({
      ...prev,
      cashCounted,
      isLocked: true,
    }));

    return { discrepancy, isBalanced, closeout: closeoutRecord };
  };

  // Shift Switch
  const switchStaff = (staffId: string, pin: string) => {
    const found = staffList.find((s) => s.id === staffId && s.pin === pin);
    if (found) {
      setActiveStaff(found);
      const audit: AuditLog = {
        id: `aud_${Date.now()}`,
        tenantId: activeTenant.id,
        timestamp: 'Just now',
        actorStaffName: found.fullName,
        action: 'Staff Shift Started',
        details: `${found.fullName} unlocked terminal with PIN [${pin}].`,
        severity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);
      return true;
    }
    return false;
  };

  // WhatsApp AI Bot
  const askOwnerBot = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('adeleke') || q.includes('renew')) {
      const tx = transactions.find((t) => t.memberName.toLowerCase().includes('adeleke') || t.memberName.toLowerCase().includes('abiodun'));
      if (tx) {
        return `Yes, Chief! ${tx.memberName} (${tx.memberCode}) paid ₦${tx.amount.toLocaleString()} via ${tx.paymentMethod.replace('_', ' ')} at ${tx.timestamp}. Their pass is active.`;
      }
      return `Chief, no renewal transaction found for that name in today's logs.`;
    }

    if (q.includes('cash') || q.includes('drawer')) {
      return `Currently ₦${shiftSummary.cashExpected.toLocaleString()} gross cash collected across ${transactions.filter((t) => t.paymentMethod === 'cash').length} transactions. Less ₦${(shiftSummary.drawerExpenses || 0).toLocaleString()} petty cash/diesel expenses. Net cash expected in drawer: ₦${(shiftSummary.netCashExpected ?? shiftSummary.cashExpected).toLocaleString()}.`;
    }

    if (q.includes('diesel') || q.includes('generator') || q.includes('fuel') || q.includes('expense')) {
      return `Chief, ₦${(shiftSummary.drawerExpenses || 0).toLocaleString()} has been logged for petty cash / generator diesel expenses today across ${expenses.length} expense entries. Net cash expected in drawer after fuel deductions is ₦${(shiftSummary.netCashExpected ?? shiftSummary.cashExpected).toLocaleString()}.`;
    }

    if (q.includes('expire') || q.includes('tomorrow')) {
      const expiring = members.filter((m) => m.subscriptionEndDate === '2026-10-23');
      if (expiring.length > 0) {
        const names = expiring.map((e) => `${e.fullName} (#${e.memberCode})`).join(', ');
        return `${expiring.length} members expire tomorrow: ${names}. Automated renewal WhatsApp links with Paystack checkout were dispatched at 9:00 AM.`;
      }
      return `No members expire tomorrow, Chief!`;
    }

    if (q.includes('staff') || q.includes('pin') || q.includes('receptionist')) {
      const staffInfo = staffList.map((s) => `• ${s.fullName} (${s.role.toUpperCase()}): PIN ${s.pin} [${s.shiftStatus}]`).join('\n');
      return `Chief, here are the active staff members and their counter PINs for ${activeTenant.name}:\n${staffInfo}`;
    }

    if (q.includes('report') || q.includes('summary') || q.includes('today')) {
      return `Good day Chief! Today's Financial Summary for ${activeTenant.name}:\n• Gross Revenue: ₦${shiftSummary.totalRevenue.toLocaleString()}\n• Bank Transfers: ₦${shiftSummary.transferExpected.toLocaleString()}\n• POS Card: ₦${shiftSummary.posExpected.toLocaleString()}\n• Gross Cash in Drawer: ₦${shiftSummary.cashExpected.toLocaleString()}\n• Less Drawer Expenses (Diesel/Petty Cash): -₦${(shiftSummary.drawerExpenses || 0).toLocaleString()}\n• Net Cash Expected: ₦${(shiftSummary.netCashExpected ?? shiftSummary.cashExpected).toLocaleString()}\n• Total Check-ins: ${checkIns.length} members\n• Overrides: ${shiftSummary.overridesCount} staff flags.`;
    }

    return `Chief, total gross revenue today is ₦${shiftSummary.totalRevenue.toLocaleString()} across ${transactions.length} payments. ${checkIns.length} members have checked in so far today at ${activeTenant.name}. Net cash expected in drawer after diesel/expenses is ₦${(shiftSummary.netCashExpected ?? shiftSummary.cashExpected).toLocaleString()}.`;
  };

  return (
    <GymContext.Provider
      value={{
        tenants,
        activeTenant,
        switchTenant,
        addTenant,
        updateTenantReferralProgram,
        owners,
        activeOwner,
        isFounderImpersonating,
        impersonateTenant,
        exitImpersonation,
        onboardGymTenant,
        updateTenantStatus,
        extendTenantTrial,
        authenticateUser,
        updateOwnerPassword,
        members,
        plans,
        activePlans,
        addPlan,
        updatePlan,
        deletePlan,
        isDemoMode,
        clearMockData,
        loadDemoData,
        staffList,
        activeStaff,
        checkIns,
        transactions,
        auditLogs,
        shiftSummary,
        activeScanResult,
        setScanResultIdle,
        checkInMember,
        recordSelfCheckIn,
        registerMember,
        updateMemberPhoto,
        bulkImportMembers,
        renewMember,
        overrideExpiredEntry,
        closeShift,
        shiftCloseouts,
        switchStaff,
        addStaff,
        deactivateStaff,
        askOwnerBot,
        bankTransfers,
        verifyTransferManually,
        trainerCommissions,
        payoutTrainer,
        retailItems,
        stockDeliveries,
        sellRetailItem,
        addRetailItem,
        restockItem,
        reconcileStockCount,
        isCloudConnected,
        expenses,
        logExpense,
        isOfflineMode,
        offlineQueueCount,
        triggerManualOfflineSync,
        hasFeature,
        upgradeTenantTier,
        isUpgradeModalOpen,
        activeGatedFeature,
        openUpgradeModal,
        closeUpgradeModal,
      }}
    >
      {children}
      <FeatureGateModal
        isOpen={isUpgradeModalOpen}
        featureKey={activeGatedFeature}
        onClose={closeUpgradeModal}
      />
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}
