import { Plan, Member, StaffUser, CheckIn, Transaction, AuditLog, GymTenant, OwnerAccount, BankTransferVerification, TrainerCommission, RetailItem, StockDelivery, ExpenseLog, ShiftCloseout } from '@/types';

// ==============================================================
// FITLEDGER OS — CLEAN PRODUCTION STATE (MOCK DATA DISABLED)
// ==============================================================

// Multi-Tenant Pricing Catalog (Base templates)
export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan_daily',
    name: 'Day Pass (Single Entry)',
    type: 'daily',
    price: 3000,
    durationDays: 1,
    ptSessionsIncluded: 0,
    description: '1 calendar day access to gym floor, cardio, and weights.',
    isActive: true,
  },
  {
    id: 'plan_monthly_std',
    name: 'Standard Monthly Membership',
    type: 'monthly',
    price: 30000,
    durationDays: 30,
    ptSessionsIncluded: 0,
    description: '30-day unlimited gym floor access, locker, and showers.',
    isActive: true,
  },
  {
    id: 'plan_monthly_vip',
    name: 'VIP Monthly Pass + PT',
    type: 'monthly',
    price: 55000,
    durationDays: 30,
    ptSessionsIncluded: 4,
    description: '30-day VIP gym access with 4 complimentary Personal Training sessions.',
    isActive: true,
  },
  {
    id: 'plan_quarterly',
    name: 'Quarterly Gold Pass',
    type: 'quarterly',
    price: 80000,
    durationDays: 90,
    ptSessionsIncluded: 8,
    description: '90-day pass with 8 PT sessions and guest privileges.',
    isActive: true,
  },
];

// Pro-Shop Retail Counter Inventory (Water, Energy Drinks)
export const INITIAL_RETAIL_ITEMS: RetailItem[] = [
  {
    id: 'ret_water',
    name: 'Eva Natural Water (750ml)',
    category: 'beverage',
    costPrice: 160,
    price: 400,
    inStock: 36,
    lowStockThreshold: 12,
    supplierName: 'NBC Coca-Cola Wholesaler, Ikorodu',
    lastRestockedDate: '2026-10-21',
    icon: '💧',
  },
  {
    id: 'ret_energy',
    name: 'Monster Energy Drink (500ml)',
    category: 'beverage',
    costPrice: 950,
    price: 1800,
    inStock: 18,
    lowStockThreshold: 6,
    supplierName: 'Chi Limited Direct Depot, Isolo',
    lastRestockedDate: '2026-10-20',
    icon: '⚡',
  },
  {
    id: 'ret_protein',
    name: 'Optimum Whey Protein Shake (Ready-to-drink)',
    category: 'supplement',
    costPrice: 2200,
    price: 4000,
    inStock: 12,
    lowStockThreshold: 5,
    supplierName: 'HealthPlus Pharmacy Distributor, Victoria Island',
    lastRestockedDate: '2026-10-18',
    icon: '🥤',
  },
];

// Pristine Empty State: 0 Mock Clutter
export const INITIAL_TENANTS: GymTenant[] = [];
export const INITIAL_OWNERS: OwnerAccount[] = [];
export const INITIAL_MEMBERS: Member[] = [];
export const INITIAL_STAFF: StaffUser[] = [];
export const INITIAL_CHECKINS: CheckIn[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_BANK_TRANSFERS: BankTransferVerification[] = [];
export const INITIAL_TRAINER_COMMISSIONS: TrainerCommission[] = [];
export const INITIAL_STOCK_DELIVERIES: StockDelivery[] = [];
export const INITIAL_EXPENSES: ExpenseLog[] = [];
export const INITIAL_SHIFT_CLOSEOUTS: ShiftCloseout[] = [];
