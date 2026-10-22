'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { Member } from '@/types';
import { AlertCircle, X } from 'lucide-react';

interface ManualOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
}

export function ManualOverrideModal({ isOpen, onClose, member }: ManualOverrideModalProps) {
  const { overrideExpiredEntry, activeStaff } = useGym();
  const [reason, setReason] = useState('Customer promised to make bank transfer by tonight');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'other' ? customReason : reason;
    overrideExpiredEntry(member.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-red-500/40 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-red-400">Manual Entry Override</h3>
            <p className="text-xs text-zinc-400">Audited Action by Staff: {activeStaff.fullName}</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300">
          You are allowing entry for an <strong className="text-red-400">EXPIRED</strong> member:  
          <span className="block mt-1 font-bold text-white text-sm">{member.fullName} (#{member.memberCode})</span>
          Due renewal: ₦30,000.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
          ⚠️ <strong>Anti-Theft Notice:</strong> This override is stamped with your staff ID and sent directly to the Gym Owner's audit stream.
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-zinc-400">Select Mandatory Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white mt-1 focus:ring-2 focus:ring-red-500"
            >
              <option value="Customer promised to make bank transfer by tonight">
                Customer promised to make bank transfer by tonight
              </option>
              <option value="POS network down at counter - will pay next visit">
                POS network down at counter - will pay next visit
              </option>
              <option value="VIP Guest of Gym Owner">
                VIP Guest of Gym Owner
              </option>
              <option value="Trial workout session approved by manager">
                Trial workout session approved by manager
              </option>
              <option value="other">Other reason...</option>
            </select>
          </div>

          {reason === 'other' && (
            <div>
              <label className="text-xs font-semibold text-zinc-400">Type specific reason:</label>
              <input
                type="text"
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="State reason here..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white mt-1"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/20"
            >
              Confirm & Log Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
