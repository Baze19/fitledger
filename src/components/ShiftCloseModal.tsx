'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { X, ShieldCheck, AlertTriangle, Camera } from 'lucide-react';

interface ShiftCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShiftCloseModal({ isOpen, onClose }: ShiftCloseModalProps) {
  const { shiftSummary, closeShift, activeStaff } = useGym();
  const [cashCountedInput, setCashCountedInput] = useState('');
  const [result, setResult] = useState<{ discrepancy: number; isBalanced: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const counted = Number(cashCountedInput) || 0;
    const res = closeShift(counted);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
            🔒
          </div>
          <div>
            <h3 className="font-extrabold text-base">Shift Handover & Cash Lock</h3>
            <p className="text-xs text-zinc-400">Staff on Duty: {activeStaff.fullName}</p>
          </div>
        </div>

        {/* Expected Summary */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Expected Physical Cash in Drawer:</span>
            <span className="font-bold text-amber-400 text-sm">₦{shiftSummary.cashExpected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Expected POS Card Slips:</span>
            <span className="font-bold text-zinc-200">₦{shiftSummary.posExpected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Verified Bank Transfers:</span>
            <span className="font-bold text-zinc-200">₦{shiftSummary.transferExpected.toLocaleString()}</span>
          </div>
          <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-sm">
            <span className="text-white">Total Shift Revenue:</span>
            <span className="text-emerald-400">₦{shiftSummary.totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300">
                Count the physical cash in the drawer and enter amount (₦):
              </label>
              <input
                type="number"
                required
                value={cashCountedInput}
                onChange={(e) => setCashCountedInput(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-lg font-bold text-white mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="border border-dashed border-zinc-700 bg-zinc-900/50 p-3 rounded-xl flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                <span>POS Settlement Slip Photo (OCR verify)</span>
              </div>
              <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded font-semibold">Simulated Attached</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition shadow-lg shadow-amber-500/20"
            >
              Verify Cash & Lock Shift
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            {result.isBalanced ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-1">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-emerald-400 text-base">Perfect Shift Balance!</h4>
                <p className="text-xs text-zinc-300">
                  Counted ₦{Number(cashCountedInput).toLocaleString()} matches the expected total with ₦0.00 discrepancy.
                </p>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-center space-y-1">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                <h4 className="font-extrabold text-red-400 text-base">Cash Mismatch Flagged!</h4>
                <p className="text-xs text-zinc-300">
                  Discrepancy: <span className="font-bold text-red-400">₦{result.discrepancy.toLocaleString()}</span>.  
                  An alert has been dispatched to the Gym Owner's audit feed.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
            >
              Done & Return to Terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
