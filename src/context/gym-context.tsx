'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, CheckIn, Transaction, AuditLog, StaffUser, ShiftSummary, Plan } from '@/types';
import { INITIAL_MEMBERS, INITIAL_STAFF, INITIAL_PLANS, INITIAL_CHECKINS, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS } from '@/lib/mock-data';

interface GymContextType {
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
  askOwnerBot: (query: string) => string;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans] = useState<Plan[]>(INITIAL_PLANS);
  const [staffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [activeStaff, setActiveStaff] = useState<StaffUser>(INITIAL_STAFF[0]); // Mary Okafor
  const [checkIns, setCheckIns] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [activeScanResult, setActiveScanResult] = useState<{
    member?: Member;
    status: 'allowed' | 'denied' | 'not_found' | 'idle';
    message?: string;
  }>({
    member: INITIAL_MEMBERS[0], // Abiodun
    status: 'allowed',
    message: 'Active monthly VIP Pass (Expires in 18 days)',
  });

  // Calculate live shift totals
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

  // 1. Rapid Member Check-in (sub-2s)
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
        message: `No member found matching "${query}". Check number or register as new member.`,
      });
      return { success: false, reason: 'Member not found' };
    }

    const todayStr = '2026-10-22';
    const isExpired = new Date(found.subscriptionEndDate) < new Date(todayStr);

    if (isExpired) {
      const newCheckIn: CheckIn = {
        id: `chk_${Date.now()}`,
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

    // Allowed
    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
      memberId: found.id,
      memberCode: found.memberCode,
      memberName: found.fullName,
      timestamp: 'Just now',
      method,
      status: 'allowed',
      verifiedByStaffName: activeStaff.fullName,
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);

    // Update member visit stats
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

    return { success: true, member: found };
  };

  // 2. Fast Member Registration (Sub-45s)
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

    // Create transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
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

    // Audit log
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'New Member Registered',
      details: `Registered ${newMember.fullName} (#${newMember.memberCode}) on ${selectedPlan.name} (₦${selectedPlan.price.toLocaleString()}). Channel: ${data.paymentMethod}.`,
      severity: 'info',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Immediate check-in
    const chk: CheckIn = {
      id: `chk_${Date.now()}`,
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

    return newMember;
  };

  // 3. Renew Subscription
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
        timestamp: 'Just now',
        actorStaffName: activeStaff.fullName,
        action: 'Subscription Renewed',
        details: `Renewed ${target.fullName} (#${target.memberCode}) for ${selectedPlan.name} (₦${selectedPlan.price.toLocaleString()}).`,
        severity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);

      setActiveScanResult({
        member: { ...target, status: 'active', subscriptionEndDate: '2026-11-21' },
        status: 'allowed',
        message: `Plan renewed successfully! New expiry: Nov 21, 2026.`,
      });
    }
  };

  // 4. Override Expired Entry (Staff Anti-Theft Logged)
  const overrideExpiredEntry = (memberId: string, reason: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
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

  // 5. Shift Handover & Cash Lock
  const closeShift = (cashCounted: number) => {
    const discrepancy = cashCounted - shiftSummary.cashExpected;
    const isBalanced = discrepancy === 0;

    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actorStaffName: activeStaff.fullName,
      action: 'Shift Closed & Reconciled',
      details: `Shift closed by ${activeStaff.fullName}. Expected Cash: ₦${shiftSummary.cashExpected.toLocaleString()}, Counted: ₦${cashCounted.toLocaleString()}. Discrepancy: ₦${discrepancy.toLocaleString()}.`,
      severity: isBalanced ? 'info' : 'alert',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    setShiftSummary((prev) => ({
      ...prev,
      cashCounted,
      isLocked: true,
    }));

    return { discrepancy, isBalanced };
  };

  // 6. Switch Staff via 4-Digit PIN
  const switchStaff = (staffId: string, pin: string) => {
    const found = staffList.find((s) => s.id === staffId && s.pin === pin);
    if (found) {
      setActiveStaff(found);
      const audit: AuditLog = {
        id: `aud_${Date.now()}`,
        timestamp: 'Just now',
        actorStaffName: found.fullName,
        action: 'Staff Shift Started',
        details: `${found.fullName} unlocked terminal with PIN.`,
        severity: 'info',
      };
      setAuditLogs((prev) => [audit, ...prev]);
      return true;
    }
    return false;
  };

  // 7. Owner WhatsApp AI Bot Simulator
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

    if (q.includes('report') || q.includes('summary') || q.includes('today')) {
      return `Good day Chief! Today's Financial Summary:\n• Gross Revenue: ₦${shiftSummary.totalRevenue.toLocaleString()}\n• Bank Transfers: ₦${shiftSummary.transferExpected.toLocaleString()}\n• POS Card: ₦${shiftSummary.posExpected.toLocaleString()}\n• Cash in Drawer: ₦${shiftSummary.cashExpected.toLocaleString()}\n• Total Check-ins: ${checkIns.length} members\n• Overrides: ${shiftSummary.overridesCount} staff flags.`;
    }

    return `Chief, total gross revenue today is ₦${shiftSummary.totalRevenue.toLocaleString()} across ${transactions.length} payments. ${checkIns.length} members have checked in so far today.`;
  };

  return (
    <GymContext.Provider
      value={{
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
        askOwnerBot,
      }}
    >
      {children}
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
