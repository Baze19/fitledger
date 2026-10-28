'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGym } from '@/context/gym-context';
import {
  Dumbbell,
  Lock,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { authenticateUser, updateOwnerPassword, owners, staffList } = useGym();

  const [identifier, setIdentifier] = useState('');
  const [credential, setCredential] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Forgot Password / Reset State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newResetPass, setNewResetPass] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [forgotStep, setForgotStep] = useState<'input' | 'reset' | 'staff_info' | 'success'>('input');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [matchedOwnerName, setMatchedOwnerName] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = authenticateUser(identifier, credential);

      if (result.success && result.targetUrl) {
        router.push(result.targetUrl);
      } else {
        setError(result.message || 'Invalid credentials. Please verify your email, phone, or 4-digit Shift PIN.');
        setLoading(false);
      }
    }, 450);
  };

  const handleForgotLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const query = forgotIdentifier.trim().toLowerCase();
    const cleanPhone = query.replace(/\s+/g, '');

    // Check if it's Founder
    if (query === 'wincodes2@gmail.com' || query.includes('admin') || query === 'abiodun') {
      setMatchedOwnerName('Platform Founder (Abiodun Oludolapo)');
      setForgotStep('reset');
      return;
    }

    // Check if it's an Owner
    const ownerMatch = owners.find(
      (o) =>
        o.email.toLowerCase() === query ||
        o.phone.replace(/\s+/g, '') === cleanPhone ||
        o.fullName.toLowerCase() === query
    );

    if (ownerMatch) {
      setMatchedOwnerName(`${ownerMatch.fullName} (Owner)`);
      setForgotStep('reset');
      return;
    }

    // Check if it's a Staff member
    const staffMatch = staffList.find(
      (s) =>
        s.phone.replace(/\s+/g, '') === cleanPhone ||
        s.fullName.toLowerCase().includes(query)
    );

    if (staffMatch) {
      setForgotStep('staff_info');
      return;
    }

    setForgotError('No account found for that email or WhatsApp number. Please check for typos.');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (newResetPass.length < 4) {
      setForgotError('New password must be at least 4 characters.');
      return;
    }

    updateOwnerPassword(forgotIdentifier, newResetPass);
    setCredential(newResetPass);
    setForgotStep('success');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl -top-32 -left-32 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl -bottom-32 -right-32 pointer-events-none"></div>

      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-600/30">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight">FitLedger OS</span>
        </Link>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5">
          ← Back to Commercial Website
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto my-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">Sign In to Your Workspace</h1>
          <p className="text-xs text-zinc-400">
            Authorized access for Gym Owners, Staff & Platform Admins
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-2xl text-xs text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block">Authentication Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-300 block mb-1">
              Email Address, WhatsApp Number, or Name
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. tunde@fitledger.ng or 0802 345 6789"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-zinc-300">
                Password or 4-Digit Shift PIN
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotStep('input');
                  setForgotError(null);
                  setForgotIdentifier(identifier || '');
                }}
                className="text-[11px] text-red-400 hover:text-red-300 hover:underline transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder={showPassword ? 'Enter password or PIN' : '•••••••• or 4-digit PIN'}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Workspace Access...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Commercial Registration / Pilot Link */}
        <div className="border-t border-zinc-800/80 pt-4 text-center">
          <p className="text-[11px] text-zinc-400">
            Want to use FitLedger for your fitness club?{' '}
            <Link
              href="/admin"
              className="text-red-400 hover:text-red-300 font-bold hover:underline"
            >
              Start 14-Day Free Pilot →
            </Link>
          </p>
        </div>

      </div>

      {/* Forgot Password / Reset PIN Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-red-500" />
                  <span>Password & PIN Recovery</span>
                </h3>
                <p className="text-xs text-zinc-400">Reset your workspace login or recover counter PIN</p>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {forgotStep === 'input' && (
              <form onSubmit={handleForgotLookup} className="space-y-4 text-xs">
                {forgotError && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Enter your Registered Email or WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. tunde@fitledger.ng or 0802 345 6789"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Verify Account & Continue
                </button>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs">
                  Account Verified: <strong>{matchedOwnerName}</strong>
                </div>

                {forgotError && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Enter New Password</label>
                  <div className="relative">
                    <input
                      type={showResetPass ? 'text' : 'password'}
                      required
                      value={newResetPass}
                      onChange={(e) => setNewResetPass(e.target.value)}
                      placeholder="Enter at least 4 characters"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-xl p-3 pr-10 text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                    >
                      {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Confirm & Update Password
                </button>
              </form>
            )}

            {forgotStep === 'staff_info' && (
              <div className="space-y-4 text-xs">
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2 text-zinc-300">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Front-Desk Shift PIN Notice</span>
                  </div>
                  <p className="leading-relaxed">
                    To prevent counter theft, front-desk Shift PINs cannot be changed anonymously by staff.
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    Please ask your <strong>Gym Owner</strong> to open their Owner Business Suite, go to tab <strong>&quot;2. Staff & Reception PINs&quot;</strong>, and generate a new PIN for you.
                  </p>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                >
                  Understood
                </button>
              </div>
            )}

            {forgotStep === 'success' && (
              <div className="space-y-4 text-xs py-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-400 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Password Successfully Reset!</span>
                    <span>Your new password is now active. You can sign in immediately.</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[11px] text-zinc-600 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Protected by 256-Bit SSL Encryption
        </span>
        <span className="hidden sm:inline">•</span>
        <span>FitLedger OS Lagos, Nigeria</span>
        <span className="hidden sm:inline">•</span>
        <a href="mailto:support@fitledger.ng" className="text-zinc-500 hover:text-zinc-400 underline">
          Platform Support
        </a>
      </footer>

    </div>
  );
}
