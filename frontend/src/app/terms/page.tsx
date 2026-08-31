export default function TermsOfService() {
  return (
    <div className="w-full bg-brand-bg relative overflow-hidden">
      
      {/* Aurora Radial Glows */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* 🍵 Section 1: Hero Block */}
      <section className="relative border-b border-brand-neon/20 py-20 md:py-24 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block border border-brand-neon bg-brand-neon/15 px-3 py-1 text-xs uppercase font-bold tracking-widest text-brand-neon shadow-[0_0_10px_rgba(0,255,136,0.15)] mb-6">
              Agronomy Agreement Manifesto
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-brand-white leading-[1.05] mb-8">
              Terms & General <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">
                Conditions of Use
              </span>
            </h1>
            <p className="text-xs font-mono text-brand-cyan tracking-wider uppercase">
              Last Updated Protocol Revision: May 18, 2026
            </p>
          </div>
        </div>
      </section>

      {/* 📜 Section 2: Terms Details - Raised descriptions from text-xs to text-sm */}
      <section className="py-20 bg-brand-panel">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 text-brand-white/80">
          
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-brand-white">1. Diagnostic Platform Access</h2>
            <p className="text-sm font-light leading-relaxed">
              By accessing Tea Diagnostics, you accept these terms of service in full. Smallholders are granted unrestricted, royalty-free web interface diagnostic access. Commercial entities, drone networks, or corporate agricultural estates must use their dedicated API keys and agree not to overload our GPU cluster nodes via custom automated scraping scripts.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-brand-white">2. Neural Model Advisory Limits</h2>
            <p className="text-sm font-light leading-relaxed">
              Our hybrid deep-learning models (ViT + EfficientNet) are mathematical abstractions trained on localized agricultural visual leaf vectors. The model predictions represent statistical likelihood estimates, NOT certified absolute biological diagnostics. Under no circumstances shall Tea Diagnostics or its researchers be liable for crop loss, improper pesticide application, or financial deviations resulting from statistical AI classifications.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-brand-white">3. Acceptable Agricultural Use</h2>
            <p className="text-sm font-light leading-relaxed">
              Users agree to submit only authentic visual leaf crop photographs. Submitting offensive, unrelated, or spam images to the inference queue triggers an automatic ban of the estate's IP address.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold text-brand-white">4. Policy Alterations</h2>
            <p className="text-sm font-light leading-relaxed">
              We reserve the absolute right to modify these terms and our Price Policy tiers at any time to align with GPU server upkeep costs. Continuing to upload visuals and query our server API nodes signifies your consent to the updated agronomist agreements.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
