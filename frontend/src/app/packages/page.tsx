'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Coins, Zap, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PackagesPage() {
  const { user, buyCredits, setAuthModalOpen } = useAuth();
  const [loadingPackage, setLoadingPackage] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const packages = [
    {
      id: 100,
      name: 'Field Scouting Core',
      credits: 100,
      scans: 5,
      costPerScan: 'Free / Basic tier',
      price: '$0.00',
      description: 'Ideal for small estates, localized growers, and students evaluating leaf diagnostic layers.',
      features: [
        '5 high-speed ensembled scans',
        'Vision Transformer (ViT) pass',
        'Standard Grad-CAM heatmaps',
        'General pathogen catalog',
      ],
      glowClass: 'shadow-[0_0_15px_rgba(0,240,255,0.05)] border-brand-cyan/20',
      btnClass: 'btn-neon-secondary',
      popular: false,
    },
    {
      id: 1000,
      name: 'Agronomist Professional',
      credits: 1000,
      scans: 50,
      costPerScan: 'Premium telemetry cost',
      price: 'Activated (Sandbox)',
      description: 'Designed for corporate agronomists, regional pathologists, and full estate diagnostic runs.',
      features: [
        '50 high-speed ensembled scans',
        'ViT + CNN joint probability maps',
        'High-res Grad-CAM overlays',
        'Full agronomical protocols desk',
        'Exportable telemetry PDF logs',
      ],
      glowClass: 'shadow-[0_0_25px_rgba(244,196,48,0.15)] border-brand-gold',
      btnClass: 'btn-neon-primary bg-brand-gold border-brand-gold text-brand-bg hover:bg-transparent hover:text-brand-gold',
      popular: true,
    },
    {
      id: 10000,
      name: 'Enterprise Plantation',
      credits: 10000,
      scans: 500,
      costPerScan: 'Bulk processing scale',
      price: 'Activated (Sandbox)',
      description: 'Engineered for massive plantation operations, agricultural cooperatives, and research hubs.',
      features: [
        '500 high-speed ensembled scans',
        'High-density vector API queries',
        'Priority GPU queue slots (0.3s)',
        'Pathogen trend telemetry reports',
        'Dedicated laboratory support',
      ],
      glowClass: 'shadow-[0_0_20px_rgba(0,255,136,0.1)] border-brand-neon/40',
      btnClass: 'btn-neon',
      popular: false,
    },
  ];

  const handleActivate = async (creditsAmount: 100 | 1000 | 10000) => {
    setFeedback(null);

    if (!user) {
      setFeedback({
        type: 'error',
        message: 'You must be signed in to activate compute credits. Opening Security Gateway...',
      });
      setTimeout(() => {
        setAuthModalOpen(true);
      }, 1000);
      return;
    }

    setLoadingPackage(creditsAmount);
    const result = await buyCredits(creditsAmount);
    setLoadingPackage(null);

    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Compute license activated! Successfully credited ${creditsAmount.toLocaleString()} units to ${user.email}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Failed to activate the credits package. Please try again.',
      });
    }
  };

  return (
    <div className="w-full bg-brand-bg relative overflow-hidden flex-grow flex flex-col justify-center">
      {/* Background Radial Glows */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* Hero Section */}
      <section className="relative border-b border-brand-neon/20 py-16 md:py-24 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 border border-brand-neon bg-brand-neon/15 px-3.5 py-1 text-xs uppercase font-bold tracking-widest text-brand-neon shadow-[0_0_12px_rgba(0,255,136,0.15)] mb-2">
            <Coins className="h-4 w-4" /> Sandbox Purchasing Mode Enabled
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-tight">
            Neural Compute <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">Credits Packages</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-brand-white/80 max-w-2xl mx-auto leading-relaxed">
            All AI disease classifications cost 20 credits per request. Purchase sandbox credentials below to instantly top up your account—no payment gateway required.
          </p>

          {user && (
            <div className="inline-flex items-center gap-3 border border-brand-cyan/30 bg-brand-cyan/5 px-5 py-2.5 font-mono text-sm">
              <span className="text-brand-white/60">Current User:</span>
              <span className="text-brand-white font-bold">{user.email}</span>
              <span className="text-brand-cyan font-bold border-l border-brand-cyan/20 pl-3">
                {user.credits.toLocaleString()} Credits Available
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Pricing Grid */}
      <section className="py-20 bg-brand-panel border-b border-brand-neon/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Notification Alert */}
          {feedback && (
            <div
              className={`max-w-3xl mx-auto border-2 p-5 flex items-start gap-4 transition-all duration-300 animate-slide-up ${
                feedback.type === 'success'
                  ? 'border-brand-neon bg-brand-neon/10 text-brand-neon'
                  : 'border-brand-rust bg-brand-rust/10 text-brand-rust'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="block text-xs uppercase font-mono font-bold tracking-wider">
                  {feedback.type === 'success' ? 'Transaction Complete' : 'System Notice'}
                </span>
                <p className="text-sm font-light text-brand-white leading-relaxed">{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`glass-panel border-2 ${pkg.glowClass} p-8 flex flex-col justify-between space-y-8 relative overflow-hidden`}
              >
                {/* Popular Corner Accent */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-brand-gold text-brand-bg font-mono font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 rotate-45 translate-x-4 translate-y-2">
                    Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name and Credits */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-cyan block font-mono">
                      {pkg.name}
                    </span>
                    <h3 className="font-serif text-4xl font-bold text-brand-white flex items-baseline gap-2">
                      {pkg.credits.toLocaleString()}
                      <span className="text-sm font-sans font-normal text-brand-white/50 lowercase">
                        credits
                      </span>
                    </h3>
                    <div className="text-xs font-mono text-brand-neon">
                      ~ {pkg.scans} full diagnosis runs (20 credits ea.)
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="h-px bg-brand-white/10" />

                  {/* Features */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-brand-white/40 tracking-wider block font-mono">
                      Included features:
                    </span>
                    <ul className="space-y-2.5 text-xs text-brand-white/80 font-light">
                      {pkg.features.map((feat, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-neon shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-brand-white/10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-mono text-brand-white/50 uppercase">License Cost:</span>
                    <span className="text-xl font-serif font-bold text-brand-white">{pkg.price}</span>
                  </div>

                  <button
                    onClick={() => handleActivate(pkg.id as 100 | 1000 | 10000)}
                    disabled={loadingPackage === pkg.id}
                    className={`w-full py-3.5 flex justify-center items-center gap-2 font-bold cursor-pointer text-xs ${pkg.btnClass}`}
                  >
                    {loadingPackage === pkg.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating Keys...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" />
                        Activate Package
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Diagnostic telemetry note */}
          <div className="max-w-4xl mx-auto border border-brand-neon/20 p-6 bg-brand-bg text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-neon font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 animate-pulse" />
              Agronomy License Telemetry
            </div>
            {/* Raised text sizes */}
            <p className="text-sm font-light text-brand-white/70 leading-relaxed max-w-2xl mx-auto">
              Credits represent compute allocations on our agricultural hardware clusters. Unused allocations persist indefinitely on your user account database block. All logs are stored securely using local cryptographic session signatures.
            </p>
            <div className="pt-2">
              <Link href="/#analyzer" className="text-xs uppercase font-bold text-brand-cyan hover:text-brand-neon tracking-widest inline-flex items-center gap-1">
                Launch Inference Console <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
