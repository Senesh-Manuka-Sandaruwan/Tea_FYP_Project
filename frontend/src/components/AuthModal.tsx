'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, AlertTriangle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear modal inputs when modal is closed/opened
  useEffect(() => {
    if (!isAuthModalOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (!isLoginView && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    let result;

    if (isLoginView) {
      result = await login(email, password);
    } else {
      result = await register(email, password);
    }

    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-md animate-fade-in">
      {/* Glow Backing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-neon/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-md border-2 border-brand-neon bg-brand-panel p-8 shadow-[0_0_50px_rgba(0,255,136,0.2)]">
        
        {/* Technical Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-neon" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-neon" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-neon" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-neon" />

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 border border-brand-white/10 hover:border-brand-neon hover:text-brand-neon text-brand-white/60 transition-all cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 border border-brand-neon/30 bg-brand-neon/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-neon">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Security Gateway
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-white">
            {isLoginView ? 'System Log In' : 'Register Operator'}
          </h2>
          <p className="text-xs font-mono text-brand-white/50 tracking-wider">
            {isLoginView ? 'AUTHENTICATE INFERENCE USER' : 'CREATE NEW BOTANICAL CORE PROFILE'}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-5 border border-brand-rust/35 bg-brand-rust/10 p-3.5 flex gap-2.5 text-brand-rust animate-shake">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="block text-[10px] font-mono uppercase font-bold tracking-widest">Gateway Exception</span>
              <p className="text-xs leading-relaxed font-light">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-[10px] uppercase font-bold tracking-wider text-brand-white/60 font-mono flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-brand-cyan" />
              Corporate Email Address
            </label>
            <input
              type="email"
              id="auth-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. operator@estate.lk"
              className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/30 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-mono"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-[10px] uppercase font-bold tracking-wider text-brand-white/60 font-mono flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-brand-cyan" />
              Passphrase Key
            </label>
            <input
              type="password"
              id="auth-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/30 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-mono"
            />
          </div>

          {/* Confirm Password Input (Register view only) */}
          {!isLoginView && (
            <div className="space-y-1.5 animate-slide-down">
              <label htmlFor="auth-confirm-password" className="text-[10px] uppercase font-bold tracking-wider text-brand-white/60 font-mono flex items-center gap-1.5">
                <KeyRound className="h-3 w-3 text-brand-cyan" />
                Confirm Passphrase Key
              </label>
              <input
                type="password"
                id="auth-confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/30 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-mono"
              />
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-neon btn-neon-primary w-full flex justify-center items-center gap-2 cursor-pointer text-xs py-3.5 mt-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                Authenticating Core...
              </>
            ) : (
              <>
                {isLoginView ? 'Authenticate Credentials' : 'Create Operator Account'}
              </>
            )}
          </button>
        </form>

        {/* View Switcher */}
        <div className="mt-6 pt-4 border-t border-brand-white/10 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-xs font-mono uppercase tracking-widest text-brand-cyan hover:text-brand-neon transition-colors cursor-pointer"
          >
            {isLoginView
              ? 'Need system access? Register operator profile'
              : 'Already have credentials? Return to login'}
          </button>
        </div>

      </div>
    </div>
  );
}
