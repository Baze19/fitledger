export type MemberStatus = 'active' | 'expired' | 'frozen' | 'suspended';
export type PlanType = 'daily' | 'monthly' | 'quarterly' | 'annual';

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number; // in NGN (Naira)
  durationDays: number;
  ptSessionsIncluded: number;
}

export interface Member {
  id: string;
  tenantId: string; // Multi-tenant isolation
  memberCode: string; // e.g. '124253'
  fullName: string;
  phoneNumber: string; // WhatsApp number
  email: string;
  photoUrl: string;
  status: MemberStatus;
  joinedDate: string;
  lockerNumber?: string;
  currentPlanId: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  remainingPtSessions: number;
  totalVisitsThisMonth: number;
  visitDates: string[]; // ISO date strings (e.g. '2026-10-06')
  ptSessionDates: string[]; // ISO date strings
}

export type CheckInMethod = 'qr_scan' | 'phone_lookup' | 'manual_override';
export type CheckInStatus = 'allowed' | 'denied';

export interface CheckIn {
  id: string;
  tenantId: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  timestamp: string;
  method: CheckInMethod;
  status: CheckInStatus;
  denialReason?: string;
  verifiedByStaffName: string;
}

export type PaymentMethod = 'bank_transfer' | 'pos_card' | 'cash' | 'paystack_online';

export interface Transaction {
  id: string;
  tenantId: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  timestamp: string;
  planName: string;
  receivedByStaffName: string;
  status: 'verified' | 'flagged';
}

export interface AuditLog {
  id: string;
  tenantId: string;
  timestamp: string;
  actorStaffName: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface StaffUser {
  id: string;
  tenantId: string;
  fullName: string;
  role: 'owner' | 'manager' | 'receptionist' | 'trainer';
  phone: string;
  pin: string; // 4-digit shift PIN
  branchName: string;
  avatarUrl?: string;
  shiftStatus: 'on_duty' | 'off_duty';
}

export interface GymTenant {
  id: string;
  name: string;
  slug: string;
  location: string;
  ownerName: string;
  ownerPhone: string;
  planTier: 'Starter' | 'Growth' | 'Enterprise';
  monthlyFee: number;
  membersCount: number;
  status: 'active' | 'trial' | 'suspended';
  joinedDate: string;
}

export interface ShiftSummary {
  staffName: string;
  shiftStartTime: string;
  cashExpected: number;
  cashCounted?: number;
  posExpected: number;
  transferExpected: number;
  totalRevenue: number;
  totalCheckIns: number;
  overridesCount: number;
  isLocked: boolean;
}

export interface OwnerAccount {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'owner';
}

export interface BankTransferVerification {
  id: string;
  tenantId: string;
  senderName: string;
  bankName: string;
  amount: number;
  timestamp: string;
  reference: string;
  status: 'settled' | 'unconfirmed_fraud_risk';
  verificationMethod: 'paystack_dedicated_virtual_account' | 'manual_slip_flagged';
  settledAt?: string;
  staffVerifiedPin?: string;
}

export interface TrainerCommission {
  trainerId: string;
  trainerName: string;
  specialty: string;
  phone: string;
  completedSessions: number;
  totalClientFees: number;
  trainerCutPercentage: number; // e.g. 60
  trainerEarnings: number;
  gymCutEarnings: number;
  rating: number;
  status: 'pending_biweekly_payout' | 'paid';
}

export interface RetailItem {
  id: string;
  name: string;
  category: 'beverage' | 'supplement' | 'daily_pass' | 'merchandise';
  price: number;
  inStock: number;
  icon: string;
}
