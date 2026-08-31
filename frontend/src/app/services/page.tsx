import Link from 'next/link';
import { Cpu, Eye, CloudLightning, BarChart3, HelpCircle } from 'lucide-react';

export default function Services() {
  return (
    <div className="w-full bg-brand-bg relative overflow-hidden">
      
      {/* Radial Glow Filters */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* 🍵 Section 1: Hero Block */}
      <section className="relative border-b border-brand-neon/20 py-20 md:py-28 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block border border-brand-neon bg-brand-neon/15 px-3 py-1 text-xs uppercase font-bold tracking-widest text-brand-neon shadow-[0_0_10px_rgba(0,255,136,0.15)] mb-6">
              Our Capabilities & Solutions
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-[1.05] mb-8">
              Agricultural <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">
                Analytical Services
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-brand-white/80 leading-relaxed max-w-2xl">
              We deploy field-ready AI model intelligence, automated botanical reporting, and API channels to support high-yield sustainable tea growing.
            </p>
          </div>
        </div>
      </section>

      {/* 🛠 Section 2: Services Grid - Raised descriptions from text-xs to text-sm */}
      <section className="border-b border-brand-neon/10 bg-brand-panel">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Service 1 */}
            <div className="glass-panel p-8 space-y-4 shadow-[0_0_20px_rgba(0,255,136,0.05)] hover:border-brand-neon/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-all duration-300">
              <div className="border border-brand-neon p-2.5 bg-brand-neon/15 text-brand-neon w-fit shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2.5xl font-bold text-brand-white">
                Ensemble Leaf Diagnosis
              </h3>
              <p className="text-sm text-brand-white/70 leading-relaxed">
                Run immediate multi-spectral and standard RGB leaf image processing. Our model automatically segments lesion zones to identify Blister Blight, Red Rust, and Brown Blight, outputting detailed reports containing severity analytics and exact botanical cures.
              </p>
            </div>

            {/* Service 2 */}
            <div className="glass-panel p-8 space-y-4 shadow-[0_0_20px_rgba(0,255,136,0.05)] hover:border-brand-neon/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-all duration-300">
              <div className="border border-brand-neon p-2.5 bg-brand-neon/15 text-brand-neon w-fit shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2.5xl font-bold text-brand-white">
                Explainable Grad-CAM XAI
              </h3>
              <p className="text-sm text-brand-white/70 leading-relaxed">
                We reject "black-box" artificial intelligence. Every analysis outputs a high-contrast Class Activation Map, visually plotting gradient overlays onto the uploaded leaf structure so field engineers can instantly verify the neural network's visual diagnosis.
              </p>
            </div>

            {/* Service 3 */}
            <div className="glass-panel p-8 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-brand-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300">
              <div className="border border-brand-cyan p-2.5 bg-brand-cyan/15 text-brand-cyan w-fit shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                <CloudLightning className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2.5xl font-bold text-brand-white">
                REST API Core Integrations
              </h3>
              <p className="text-sm text-brand-white/70 leading-relaxed">
                Connect your farm drone networks, stationary field surveillance cams, or custom greenhouse soil tracking hardware directly into our secure REST API channel. Stream raw binary data and receive structured JSON arrays instantly.
              </p>
            </div>

            {/* Service 4 */}
            <div className="glass-panel p-8 space-y-4 shadow-[0_0_20px_rgba(244,196,48,0.05)] hover:border-brand-gold/50 hover:shadow-[0_0_30px_rgba(244,196,48,0.15)] transition-all duration-300">
              <div className="border border-brand-gold p-2.5 bg-brand-gold/15 text-brand-gold w-fit shadow-[0_0_10px_rgba(244,196,48,0.2)]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2.5xl font-bold text-brand-white">
                Epidemic Risk Modeling
              </h3>
              <p className="text-sm text-brand-white/70 leading-relaxed">
                Leverage advanced temporal forecasting. By matching daily diagnosis counts with localized weather datasets (monsoon precipitation, humidity ranges, wind currents), our platform maps early blight warning vectors across regional grids.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🏷 Section 3: Price Policy Matrix */}
      <section className="py-20 bg-brand-bg border-b border-brand-neon/10" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-neon block">Pricing Framework</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-white">
              Our Clear Price Policy
            </h2>
            {/* Raised from text-sm to text-base */}
            <p className="text-base font-light text-brand-white/60">
              We operate under a fair-share agricultural mandate: Smallholder tea growers receive unrestricted free leaf diagnosis, while commercial estates support backend GPU operations via scalable tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1 - Raised lists to text-sm, summaries to text-sm */}
            <div className="border-2 border-brand-white/20 bg-brand-panel p-8 flex flex-col justify-between space-y-8 relative">
              <div className="space-y-4">
                <span className="inline-block border border-brand-white/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-white/70 bg-brand-bg">
                  Smallholder Free
                </span>
                <h3 className="font-serif text-4.5xl font-bold text-brand-white">
                  $0 <span className="text-xs font-sans font-light text-brand-white/50">/ Forever</span>
                </h3>
                <p className="text-sm font-light text-brand-white/60 leading-relaxed">
                  Engineered to secure local farming livelihoods. 100% free web portal diagnostic query.
                </p>
                <div className="border-t border-brand-white/10 pt-4">
                  <ul className="space-y-3 text-sm font-light text-brand-white/70 font-mono">
                    <li className="flex items-center gap-2">✓ Unlimited leaf image uploads</li>
                    <li className="flex items-center gap-2">✓ Instant ViT + EfficientNet diagnosis</li>
                    <li className="flex items-center gap-2">✓ Complete Grad-CAM visual heatmaps</li>
                    <li className="flex items-center gap-2">✓ Primary botanical cure tips</li>
                  </ul>
                </div>
              </div>
              <Link href="/#analyzer" className="w-full btn-neon btn-neon-secondary text-center justify-center text-xs py-3.5">
                Launch Analyzer
              </Link>
            </div>

            {/* Tier 2 - Raised lists to text-sm, summaries to text-sm */}
            <div className="border-2 border-brand-neon bg-brand-panel p-8 flex flex-col justify-between space-y-8 shadow-[0_0_30px_rgba(0,255,136,0.15)] relative">
              <div className="absolute top-4 right-4 bg-brand-neon text-brand-bg px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest">
                estate core
              </div>
              <div className="space-y-4">
                <span className="inline-block border border-brand-neon px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-neon bg-brand-bg">
                  Estate Pro
                </span>
                <h3 className="font-serif text-4.5xl font-bold text-brand-white">
                  $89 <span className="text-xs font-sans font-light text-brand-white/50">/ month</span>
                </h3>
                <p className="text-sm font-light text-brand-white/60 leading-relaxed">
                  Tailored for private mid-sized growers, cooperatives, and high-yield tea processing hubs.
                </p>
                <div className="border-t border-brand-white/10 pt-4">
                  <ul className="space-y-3 text-sm font-light text-brand-white/75 font-mono">
                    <li className="flex items-center gap-2">✓ All Free capabilities included</li>
                    <li className="flex items-center gap-2">✓ High-speed priority GPU queue (&lt; 200ms)</li>
                    <li className="flex items-center gap-2">✓ Rest API hook (10,000 requests/mo)</li>
                    <li className="flex items-center gap-2">✓ Monthly agronomic outbreak report</li>
                  </ul>
                </div>
              </div>
              <Link href="/contact" className="w-full btn-neon btn-neon-primary text-center justify-center text-xs py-3.5">
                Get Started
              </Link>
            </div>

            {/* Tier 3 - Raised lists to text-sm, summaries to text-sm */}
            <div className="border-2 border-brand-white/20 bg-brand-panel p-8 flex flex-col justify-between space-y-8 relative">
              <div className="space-y-4">
                <span className="inline-block border border-brand-white/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-white/70 bg-brand-bg">
                  Enterprise
                </span>
                <h3 className="font-serif text-4.5xl font-bold text-brand-white">
                  Custom <span className="text-xs font-sans font-light text-brand-white/50">/ Contract</span>
                </h3>
                <p className="text-sm font-light text-brand-white/60 leading-relaxed">
                  Designed for multinational agricultural producers, national tea boards, and sensor arrays.
                </p>
                <div className="border-t border-brand-white/10 pt-4">
                  <ul className="space-y-3 text-sm font-light text-brand-white/70 font-mono">
                    <li className="flex items-center gap-2">✓ Unrestricted API requests</li>
                    <li className="flex items-center gap-2">✓ Drone spatial telemetry mapping</li>
                    <li className="flex items-center gap-2">✓ Dedicated agronomist consultation</li>
                    <li className="flex items-center gap-2">✓ Custom model weights training</li>
                  </ul>
                </div>
              </div>
              <Link href="/contact" className="w-full btn-neon btn-neon-secondary text-center justify-center text-xs py-3.5">
                Request Contract
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ - Raised descriptions to text-sm */}
      <section className="py-20 bg-brand-panel border-t border-brand-neon/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-lg mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-brand-white">Pricing Policy F.A.Q.</h3>
          </div>

          <div className="divide-y divide-brand-white/10 border-y border-brand-white/10">
            <div className="py-6 space-y-2.5">
              <h4 className="font-bold text-base text-brand-neon uppercase tracking-wider font-mono">Are there hidden diagnostics processing fees?</h4>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                No. In accordance with our agronomist price manifesto, web interface leaf diagnoses and primary Grad-CAM rendering are fully free for smallholders. Paid tiers support dedicated commercial REST API tokens.
              </p>
            </div>
            <div className="py-6 space-y-2.5">
              <h4 className="font-bold text-base text-brand-neon uppercase tracking-wider font-mono">Can I terminate my Estate Pro subscription at any time?</h4>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                Yes. Subscription cancellation triggers an immediate halt of monthly billing, downgrading your estate dashboard to the Smallholder Free plan.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
