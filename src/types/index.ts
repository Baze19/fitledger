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
  memberCode: string; // e.g. '#124253'
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
  timestamp: string;
  actorStaffName: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface StaffUser {
  id: string;
  fullName: string;
  role: 'owner' | 'manager' | 'receptionist' | 'trainer';
  phone: string;
  pin: string; // 4-digit shift PIN
  branchName: string;
  avatarUrl?: string;
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
