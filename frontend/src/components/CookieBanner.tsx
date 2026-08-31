'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookies-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookies-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="mx-auto max-w-4xl border-2 border-brand-neon bg-brand-panel p-6 shadow-[0_0_30px_rgba(0,255,136,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        
        {/* Neon Light Corner Indicator */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-brand-neon" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-brand-neon" />

        {/* Banner content */}
        <div className="flex gap-4 items-start">
          <div className="border border-brand-neon p-2.5 bg-brand-neon/10 text-brand-neon shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.15)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-mono font-bold uppercase tracking-wider text-brand-white">
              Cookies & Leaf Telemetry Consent
            </h4>
            {/* Raised from text-xs to text-sm */}
            <p className="text-sm text-brand-white/80 leading-relaxed font-light">
              We employ lightweight analytical cookies and localized browser memory states to accelerate model loading speeds and monitor crop outbreak telemetry. Leaf scans are processed securely and sandboxed under our privacy manifesto. Review our{' '}
              <a href="/privacy-policy" className="text-brand-neon underline font-bold hover:text-brand-cyan">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>

        {/* Action Buttons - Raised to text-xs / text-sm */}
        <div className="flex gap-3 w-full md:w-auto justify-end shrink-0">
          <button
            onClick={declineCookies}
            className="px-5 py-2.5 border-2 border-brand-white/40 hover:border-brand-white hover:bg-brand-gray text-xs uppercase tracking-wider font-bold text-brand-white transition-all cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-5 py-2.5 border-2 border-brand-neon bg-brand-neon text-brand-bg hover:bg-transparent hover:text-brand-neon text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.25)]"
          >
            Accept All
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="hidden md:block p-1.5 hover:text-brand-neon text-brand-white/60 transition-colors ml-2"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
