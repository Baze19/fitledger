export type MemberStatus = 'active' | 'expired' | 'frozen' | 'suspended';
export type PlanType = 'daily' | 'monthly' | 'quarterly' | 'annual';

export interface Plan {
  id: string;
  tenantId?: string; // Multi-tenant gym isolation
  name: string;
  type: PlanType;
  price: number; // in NGN (Naira)
  durationDays: number;
  ptSessionsIncluded: number;
  description?: string;
  isActive?: boolean;
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
  referralCount?: number;
  referralDaysEarned?: number;
  referredByCode?: string;
}

export type CheckInMethod = 'qr_scan' | 'phone_lookup' | 'manual_override' | 'self_qr_scan';
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

export interface ReferralProgramSettings {
  enabled: boolean;
  rewardDays: number; // Free days given to referring member
  friendDiscountNaira: number; // Naira discount off friend's first plan
  headline: string; // e.g. "Give ₦2,000 Off, Get 5 Free Days! 🔥"
  termsDescription?: string; // Optional terms or instructions
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
  trialExpiresAt?: string;
  referralProgram?: ReferralProgramSettings;
}

export interface ShiftSummary {
  staffName: string;
  shiftStartTime: string;
  cashExpected: number;
  drawerExpenses: number;
  netCashExpected: number;
  cashCounted?: number;
  posExpected: number;
  transferExpected: number;
  totalRevenue: number;
  totalCheckIns: number;
  overridesCount: number;
  isLocked: boolean;
}

export type ExpenseCategory = 'diesel_generator' | 'gym_cleaning' | 'repairs_maintenance' | 'water_utilities' | 'other';

export interface ExpenseLog {
  id: string;
  tenantId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receiptPhotoUrl?: string;
  staffName: string;
  staffPin: string;
  timestamp: string;
  paidFromDrawer: boolean;
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
  costPrice: number; // Wholesale unit cost in NGN
  price: number; // Counter selling price in NGN
  inStock: number; // Current physical units
  lowStockThreshold: number; // Warning threshold (e.g. 10)
  supplierName?: string;
  lastRestockedDate?: string;
  icon: string;
}

export interface StockDelivery {
  id: string;
  tenantId: string;
  itemId: string;
  itemName: string;
  unitsAdded: number;
  costPerUnit: number;
  totalCost: number;
  supplier: string;
  timestamp: string;
  receivedByStaffName: string;
}

export interface ShiftCloseout {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  staffPinUsed: string;
  closedAt: string;
  totalRevenue: number;
  cashExpected: number;
  cashActual: number;
  cashDiscrepancy: number; // 0 = balanced, < 0 = shortage, > 0 = surplus
  bankTransferTotal: number;
  posTotal: number;
  paystackTotal: number;
  expensesTotal: number;
  totalCheckIns: number;
  expiredPassesBlocked: number;
  retailUnitsSold: number;
  notes?: string;
  status: 'balanced' | 'shortage' | 'surplus';
}
