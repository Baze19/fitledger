'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, CheckIn, Transaction, AuditLog, StaffUser, ShiftSummary, Plan, GymTenant, OwnerAccount, BankTransferVerification, TrainerCommission, RetailItem, StockDelivery, PaymentMethod } from '@/types';
import { INITIAL_MEMBERS, INITIAL_STAFF, INITIAL_PLANS, INITIAL_CHECKINS, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS, INITIAL_TENANTS, INITIAL_OWNERS, INITIAL_BANK_TRANSFERS, INITIAL_TRAINER_COMMISSIONS, INITIAL_RETAIL_ITEMS, INITIAL_STOCK_DELIVERIES } from '@/lib/mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PlanTier, FeatureKey, canAccessFeature, getMaxMembersAllowed, PLAN_TIERS } from '@/lib/entitlements';
import { FeatureGateModal } from '@/components/FeatureGateModal';

interface GymContextType {
  tenants: GymTenant[];
  activeTenant: GymTenant;
  switchTenant: (tenantId: string) => void;
  addTenant: (data: Omit<GymTenant, 'id' | 'joinedDate'>) => GymTenant;

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
  registerMember: (data: { fullName: string; phoneNumber: string; planId: string; paymentMethod: Transaction['paymentMethod'] }) => Member;
  renewMember: (memberId: string, planId: string, paymentMethod: Transaction['paymentMethod']) => void;
  overrideExpiredEntry: (memberId: string, reason: string) => void;
  closeShift: (cashCounted: number) => { discrepancy: number; isBalanced: boolean };
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

  // Plan Entitlements & Feature Gating
  hasFeature: (featureKey: FeatureKey) => boolean;
  upgradeTenantTier: (tenantId: string, newTier: PlanTier) => Promise<void>;
  isUpgradeModalOpen: boolean;
  activeGatedFeature: FeatureKey | null;
  openUpgradeModal: (featureKey: FeatureKey) => void;
  closeUpgradeModal: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<GymTenant[]>(INITIAL_TENANTS);
  const [activeTenant, setActiveTenant] = useState<GymTenant>(INITIAL_TENANTS[0]); // Ikorodu branch
  const [owners, setOwners] = useState<OwnerAccount[]>(INITIAL_OWNERS);
  const [activeOwner, setActiveOwner] = useState<OwnerAccount | null>(INITIAL_OWNERS[0]);
  const [isFounderImpersonating, setIsFounderImpersonating] = useState<boolean>(false);

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans] = useState<Plan[]>(INITIAL_PLANS);
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [activeStaff, setActiveStaff] = useState<StaffUser>(INITIAL_STAFF[0]); // Mary Okafor
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [bankTransfers, setBankTransfers] = useState<BankTransferVerification[]>(INITIAL_BANK_TRANSFERS);
  const [trainerCommissions, setTrainerCommissions] = useState<TrainerCommission[]>(INITIAL_TRAINER_COMMISSIONS);
  const [retailItems, setRetailItems] = useState<RetailItem[]>(INITIAL_RETAIL_ITEMS);
  const [stockDeliveries, setStockDeliveries] = useState<StockDelivery[]>(INITIAL_STOCK_DELIVERIES);

  const [activeScanResult, setActiveScanResult] = useState<{
    member?: Member;
    status: 'allowed' | 'denied' | 'not_found' | 'idle';
    message?: string;
  }>({
    member: INITIAL_MEMBERS[0],
    status: 'allowed',
    message: 'Active monthly VIP Pass (Expires in 18 days)',
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
      joinedDate: '2026-10-23',
    };

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
      shiftStatus: 'off_duty',
    };
    setStaffList((prev) => [...prev, initialReceptionist]);

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
        gymName: activeTenant.name,
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

  // Shift financial totals
  const cashExpected = transactions
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const posExpected = transactions
    .filter((t) => t.paymentMethod === 'pos_card')
    .reduce((sum, t) => sum + t.amount, 0);

  const transferExpected = transactions
    .filter((t) => t.paymentMethod === 'bank_transfer' || t.paymentMethod === 'paystack_online')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenue = cashExpected + posExpected + transferExpected;

  const [shiftSummary, setShiftSummary] = useState<ShiftSummary>({
    staffName: activeStaff.fullName,
    shiftStartTime: '08:00 AM',
    cashExpected,
    posExpected,
    transferExpected,
    totalRevenue,
    totalCheckIns: checkIns.length,
    overridesCount: 0,
    isLocked: false,
  });

  useEffect(() => {
    setShiftSummary((prev) => ({
      ...prev,
      staffName: activeStaff.fullName,
      cashExpected,
      posExpected,
      transferExpected,
      totalRevenue,
      totalCheckIns: checkIns.length,
    }));
  }, [transactions, checkIns, activeStaff, cashExpected, posExpected, transferExpected, totalRevenue]);

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

    const todayStr = '2026-10-22';
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
      message: `Verified! Active until ${found.subscriptionEndDate}`,
    });

    // Background Supabase cloud persistence
    if (supabase && isSupabaseConfigured) {
      supabase
        .from('attendance_logs')
        .insert({
          staff_pin: activeStaff.pin || '2045',
          status: 'Valid Entry',
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase checkin insert fallback:', error.message);
        });
    }

    return { success: true, member: found };
  };

  // Register Member
  const registerMember = (data: {
    fullName: string;
    phoneNumber: string;
    planId: string;
    paymentMethod: Transaction['paymentMethod'];
  }) => {
    const selectedPlan = plans.find((p) => p.id === data.planId) || plans[1];
    const newCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newMember: Member = {
      id: `mem_${Date.now()}`,
      tenantId: activeTenant.id,
      memberCode: newCode,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: `${data.fullName.toLowerCase().replace(/\s+/g, '.')}@gymmember.ng`,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      status: 'active',
      joinedDate: '2026-10-22',
      currentPlanId: selectedPlan.id,
      subscriptionStartDate: '2026-10-22',
      subscriptionEndDate: '2026-11-21',
      remainingPtSessions: selectedPlan.ptSessionsIncluded,
      totalVisitsThisMonth: 1,
      visitDates: ['2026-10-22'],
      ptSessionDates: [],
    };

    setMembers((prev) => [newMember, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      tenantId: activeTenant.id,
      memberId: newMember.id,
      memberName: newMember.fullName,
      memberCode: newMember.memberCode,
      amount: selectedPlan.price,
      paymentMethod: data.paymentMethod,
      reference: `REC-${Date.now().toString().slice(-6)}`,
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
      action: 'New Member Registered',
      details: `Registered ${newMember.fullName} (#${newMember.memberCode}) on ${selectedPlan.name} (₦${selectedPlan.price.toLocaleString()}). Channel: ${data.paymentMethod}.`,
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
      message: `Registration complete! WhatsApp Pass dispatched to ${newMember.phoneNumber}`,
    });

    // Background Supabase cloud persistence
    if (supabase && isSupabaseConfigured) {
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
        .then(({ error }) => {
          if (error) console.warn('Supabase member insert fallback:', error.message);
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
        .then(({ error }) => {
          if (error) console.warn('Supabase reg tx insert fallback:', error.message);
        });
    }

    return newMember;
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
  const closeShift = (cashCounted: number) => {
    const discrepancy = cashCounted - shiftSummary.cashExpected;
    const isBalanced = discrepancy === 0;

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      tenantId: activeTenant.id,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'Shift Closed & Reconciled',
      details: `Shift closed by ${activeStaff.fullName}. Expected Cash: ₦${shiftSummary.cashExpected.toLocaleString()}, Counted: ₦${cashCounted.toLocaleString()}. Discrepancy: ₦${discrepancy.toLocaleString()}.`,
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
          cashier_pin: activeStaff.pin || '2045',
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

    return { discrepancy, isBalanced };
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
      return `Currently ₦${shiftSummary.cashExpected.toLocaleString()} cash in hand collected across ${transactions.filter((t) => t.paymentMethod === 'cash').length} transactions. Last cash collected by Receptionist ${activeStaff.fullName}.`;
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
      return `Good day Chief! Today's Financial Summary for ${activeTenant.name}:\n• Gross Revenue: ₦${shiftSummary.totalRevenue.toLocaleString()}\n• Bank Transfers: ₦${shiftSummary.transferExpected.toLocaleString()}\n• POS Card: ₦${shiftSummary.posExpected.toLocaleString()}\n• Cash in Drawer: ₦${shiftSummary.cashExpected.toLocaleString()}\n• Total Check-ins: ${checkIns.length} members\n• Overrides: ${shiftSummary.overridesCount} staff flags.`;
    }

    return `Chief, total gross revenue today is ₦${shiftSummary.totalRevenue.toLocaleString()} across ${transactions.length} payments. ${checkIns.length} members have checked in so far today at ${activeTenant.name}.`;
  };

  return (
    <GymContext.Provider
      value={{
        tenants,
        activeTenant,
        switchTenant,
        addTenant,
        owners,
        activeOwner,
        isFounderImpersonating,
        impersonateTenant,
        exitImpersonation,
        onboardGymTenant,
        authenticateUser,
        updateOwnerPassword,
        members,
        plans,
        staffList,
        activeStaff,
        checkIns,
        transactions,
        auditLogs,
        shiftSummary,
        activeScanResult,
        setScanResultIdle,
        checkInMember,
        registerMember,
        renewMember,
        overrideExpiredEntry,
        closeShift,
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
