'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to our crop advisory letter!');
  };

  return (
    <footer className="w-full border-t border-brand-neon/30 bg-brand-panel text-brand-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-brand-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="pb-8 md:pb-0 md:pr-8 space-y-4">
            <div className="flex items-center gap-2">
              <div className="border border-brand-neon p-2 bg-brand-neon text-brand-bg shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-white">
                TEA.DIAGNOSTICS
              </span>
            </div>
            {/* Raised from text-xs to text-sm */}
            <p className="text-sm text-brand-white/70 leading-relaxed font-light">
              Empowering tea estates, cooperatives, and local agronomists worldwide with hybrid deep learning architectures (ViT + EfficientNet) for real-time leaf diagnosis and Explainable AI overlays.
            </p>
          </div>

          {/* Column 2: Corporate Links - Raised from text-xs to text-sm */}
          <div className="pt-8 md:pt-0 md:px-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-neon">
              Corporate
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  Homepage
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  About Our Research
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  Our Capabilities
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Policy - Raised from text-xs to text-sm */}
          <div className="pt-8 md:pt-0 md:px-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-neon">
              Legal & Policy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm font-medium hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    localStorage.removeItem('cookies-consent');
                    window.location.reload();
                  }}
                  className="text-sm font-medium text-left hover:text-brand-neon text-brand-white/80 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Cookies Preference
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="pt-8 md:pt-0 md:pl-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-neon">
              Advisory Letter
            </h3>
            {/* Raised from text-xs to text-sm */}
            <p className="text-sm text-brand-white/70 leading-relaxed font-light">
              Receive advanced scientific reports, anomalies tracking logs, and deep learning core updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex border-2 border-brand-cyan bg-brand-bg shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                <input
                  type="email"
                  required
                  placeholder="Agronomist Email"
                  className="w-full px-4 py-2.5 bg-transparent text-sm text-brand-white placeholder-brand-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-brand-cyan text-brand-bg hover:bg-brand-neon p-2.5 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar - Raised addresses from text-xs to text-sm, copyrights from text-[10px] to text-xs */}
        <div className="mt-16 pt-8 border-t border-brand-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-brand-white/75 font-mono">
            <span className="flex items-center gap-1.5"><MapPin className="h-4.5 w-4.5 text-brand-gold" /> Nuwara Eliya, Sri Lanka</span>
            <span className="flex items-center gap-1.5"><Phone className="h-4.5 w-4.5 text-brand-gold" /> +94 52 222 4000</span>
            <span className="flex items-center gap-1.5"><Mail className="h-4.5 w-4.5 text-brand-gold" /> admin@tea-diagnostics.org</span>
          </div>
          <p className="text-xs text-brand-white/50 text-center font-mono uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Tea Diagnostics. All rights reserved. Precision Crop Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
