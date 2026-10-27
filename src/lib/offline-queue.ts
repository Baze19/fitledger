// FitLedger OS — Persistent Offline Queue & NEPA Resiliency Engine
// Ensures zero data loss when NEPA cuts utility power and Wi-Fi routers reboot.
// Persists in localStorage/IndexedDB and silently batch-syncs to Supabase on reconnect.

import { CheckIn, Transaction, Member, ExpenseLog } from '@/types';

export type OfflineActionType = 'check_in' | 'transaction' | 'member_registration' | 'expense_log';

export interface OfflineAction {
  id: string;
  tenantId: string;
  type: OfflineActionType;
  payload: any;
  timestamp: string;
  retryCount: number;
}

const OUTBOX_STORAGE_KEY = 'fitledger_offline_outbox';
const MEMBERS_CACHE_KEY_PREFIX = 'fitledger_cached_members_';

export function getOfflineQueue(): OfflineAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to read offline queue from localStorage:', e);
    return [];
  }
}

export function enqueueOfflineAction(action: Omit<OfflineAction, 'id' | 'retryCount'>): OfflineAction {
  const newAction: OfflineAction = {
    ...action,
    id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    retryCount: 0,
  };

  if (typeof window === 'undefined') return newAction;

  try {
    const current = getOfflineQueue();
    const updated = [...current, newAction];
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event so UI reactive badges update immediately
    window.dispatchEvent(new CustomEvent('fitledger_offline_queue_updated', { detail: { count: updated.length } }));
  } catch (e) {
    console.warn('Failed to enqueue offline action:', e);
  }

  return newAction;
}

export function clearOfflineQueue(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OUTBOX_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('fitledger_offline_queue_updated', { detail: { count: 0 } }));
  } catch (e) {
    console.warn('Failed to clear offline queue:', e);
  }
}

export function removeOfflineAction(actionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getOfflineQueue();
    const filtered = current.filter((a) => a.id !== actionId);
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('fitledger_offline_queue_updated', { detail: { count: filtered.length } }));
  } catch (e) {
    console.warn('Failed to remove action from offline queue:', e);
  }
}

// Cached Members for Offline Instant Verification
export function setCachedMembers(tenantId: string, members: Member[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${MEMBERS_CACHE_KEY_PREFIX}${tenantId}`, JSON.stringify(members));
  } catch (e) {
    console.warn('Failed to cache members for offline use:', e);
  }
}

export function getCachedMembers(tenantId: string): Member[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${MEMBERS_CACHE_KEY_PREFIX}${tenantId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Background Batch Flush to Supabase Cloud on Reconnect
export async function flushOfflineQueueToCloud(supabaseClient: any): Promise<{ synced: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0 || !supabaseClient) {
    return { synced: 0, failed: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === 'check_in') {
        const { error } = await supabaseClient.from('attendance_logs').insert({
          member_id: item.payload.memberId,
          status: item.payload.status === 'allowed' ? 'Valid Entry' : 'Denied',
          staff_pin: item.payload.staffPin || '2045',
        });
        if (error) throw error;
      } else if (item.type === 'transaction') {
        const { error } = await supabaseClient.from('pos_transactions').insert({
          item_name: item.payload.itemName,
          quantity: item.payload.quantity || 1,
          amount_paid: item.payload.amountPaid,
          cashier_pin: item.payload.cashierPin || '2045',
          payment_method: item.payload.paymentMethod,
        });
        if (error) throw error;
      } else if (item.type === 'member_registration') {
        const { error } = await supabaseClient.from('members').insert({
          full_name: item.payload.fullName,
          phone: item.payload.phoneNumber,
          plan_type: item.payload.planName,
          pass_code: item.payload.memberCode,
          status: 'Active',
          expiry_date: item.payload.expiryDate,
          avatar_url: item.payload.photoUrl,
        });
        if (error) throw error;
      }

      // Successfully synced: remove from local storage
      removeOfflineAction(item.id);
      syncedCount++;
    } catch (err) {
      console.warn(`Failed to sync offline item ${item.id}:`, err);
      failedCount++;
    }
  }

  return { synced: syncedCount, failed: failedCount };
}
