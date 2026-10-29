'use client';

import React, { useState } from 'react';
import { ExpenseCategory, ExpenseLog, StaffUser } from '@/types';
import { Fuel, Wrench, Sparkles, Droplets, Receipt, X, Check, Camera, AlertCircle } from 'lucide-react';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import { FormattedNumberInput } from '@/components/FormattedNumberInput';

interface ExpenseLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogExpense: (expense: Omit<ExpenseLog, 'id' | 'timestamp'>) => void;
  activeStaff: StaffUser;
  staffList: StaffUser[];
}

export function ExpenseLogModal({
  isOpen,
  onClose,
  onLogExpense,
  activeStaff,
  staffList,
}: ExpenseLogModalProps) {
  const [category, setCategory] = useState<ExpenseCategory>('diesel_generator');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('15L Diesel for Mikano Generator');
  const [paidFromDrawer, setPaidFromDrawer] = useState<boolean>(true);
  const [receiptPhoto, setReceiptPhoto] = useState<string>('');
  const [staffPin, setStaffPin] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid expense amount in Naira.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a brief description for this expense.');
      return;
    }

    // PIN check: matches active staff or any authorized staff
    const validStaff = staffList.find((s) => s.pin === staffPin.trim()) || (activeStaff.pin === staffPin.trim() ? activeStaff : null);
    if (!validStaff) {
      setErrorMsg('Invalid 4-Digit Staff PIN. Authorization required.');
      return;
    }

    onLogExpense({
      tenantId: activeStaff.tenantId,
      category,
      amount: numAmount,
      description: description.trim(),
      receiptPhotoUrl: receiptPhoto || undefined,
      staffName: validStaff.fullName,
      staffPin: validStaff.pin,
      paidFromDrawer,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl relative animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm">Log Drawer Expense</h3>
              <p className="text-[10px] text-zinc-400">Diesel / Petty Cash Auto-Deduction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Expense Category</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'diesel_generator', label: 'Diesel / Fuel', icon: Fuel, color: 'text-amber-400' },
                { id: 'gym_cleaning', label: 'Gym Cleaning', icon: Sparkles, color: 'text-blue-400' },
                { id: 'repairs_maintenance', label: 'Repairs / Fixes', icon: Wrench, color: 'text-purple-400' },
                { id: 'water_utilities', label: 'Water / Utility', icon: Droplets, color: 'text-cyan-400' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id as ExpenseCategory);
                      if (item.id === 'diesel_generator') setDescription('15L Diesel for Mikano Generator');
                      else if (item.id === 'gym_cleaning') setDescription('Floor detergent & mop heads');
                      else if (item.id === 'repairs_maintenance') setDescription('Cable pulley lubricant / fix');
                      else setDescription('Emergency water supply');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                      category === item.id
                        ? 'bg-zinc-800 border-amber-500 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Amount Paid (₦)</label>
            <FormattedNumberInput
              value={amount}
              onChange={(val) => {
                setAmount(val === 0 ? '' : val.toString());
                setErrorMsg(null);
              }}
              prefix="₦"
              placeholder="e.g. 15,000"
              className="focus:ring-amber-500 font-bold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">Expense Details / Reason</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 15 Litres diesel from TotalEnergies for blackout"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          {/* Paid from Drawer Checkbox */}
          <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-[11px]">Paid with Cash from Drawer</p>
              <p className="text-[10px] text-zinc-400">Decrements expected cash at 8:30 PM shift close</p>
            </div>
            <input
              type="checkbox"
              checked={paidFromDrawer}
              onChange={(e) => setPaidFromDrawer(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Receipt Snapshot (Anti-Fraud) */}
          <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                {receiptPhoto ? (
                  <img src={receiptPhoto} alt="Receipt" className="w-full h-full object-cover" />
                ) : (
                  <Receipt className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-white text-[11px]">Receipt / Fuel Meter Snap</p>
                <p className="text-[10px] text-zinc-400">{receiptPhoto ? 'Receipt Attached ✓' : 'Optional proof'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>{receiptPhoto ? 'Change' : 'Snap Receipt'}</span>
            </button>
          </div>

          {/* Staff Signature PIN */}
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">
              Staff 4-Digit Shift PIN <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              maxLength={4}
              required
              value={staffPin}
              onChange={(e) => {
                setStaffPin(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="••••"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl p-2.5 text-center font-mono font-bold tracking-widest text-base text-white focus:outline-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Authorizes cash deduction from shift drawer.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Log & Deduct Expense (₦{amount || '0'})
          </button>

        </form>

      </div>

      {/* Camera Capture Modal for Receipt */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setReceiptPhoto(dataUrl);
          setIsCameraOpen(false);
        }}
        title="Snap Fuel Receipt / Pump Meter"
        subtitle="Align fuel meter or receipt in frame"
      />
    </div>
  );
}
