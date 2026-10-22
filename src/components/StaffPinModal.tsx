'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import { StaffUser } from '@/types';
import { Lock, UserCheck, X } from 'lucide-react';

interface StaffPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffPinModal({ isOpen, onClose }: StaffPinModalProps) {
  const { staffList, activeStaff, switchStaff } = useGym();
  const [selectedStaff, setSelectedStaff] = useState<StaffUser>(activeStaff);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        // Attempt switch
        const ok = switchStaff(selectedStaff.id, newPin);
        if (ok) {
          setPin('');
          onClose();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-5">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 border border-red-500/30 rounded-2xl mx-auto flex items-center justify-center mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">Staff Shift Switcher</h3>
          <p className="text-xs text-zinc-400">Select your name and enter your 4-digit PIN</p>
        </div>

        {/* Staff Selector */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {staffList.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStaff(s);
                setPin('');
                setError(false);
              }}
              className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                selectedStaff.id === s.id
                  ? 'bg-red-600/10 border-red-500 text-white shadow-md'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-200">
                {s.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <span className="text-[11px] font-bold truncate max-w-[80px]">{s.fullName.split(' ')[0]}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500">{s.role}</span>
            </button>
          ))}
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 my-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                error
                  ? 'border-red-500 bg-red-500 animate-pulse'
                  : pin.length > i
                  ? 'border-red-500 bg-red-500 scale-110'
                  : 'border-zinc-700 bg-zinc-900'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs font-semibold text-red-400 mb-2">
            Incorrect PIN for {selectedStaff.fullName}! Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 text-lg font-bold">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-white transition active:scale-95"
            >
              {digit}
            </button>
          ))}
          <div className="py-3.5"></div>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-white transition active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-zinc-400 hover:text-white transition active:scale-95 flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        <p className="text-center text-[10px] text-zinc-500 mt-4">
          (Demo hint: Mary PIN is <span className="font-mono text-zinc-400 font-bold">4821</span>, John PIN is <span className="font-mono text-zinc-400 font-bold">1102</span>)
        </p>
      </div>
    </div>
  );
}
