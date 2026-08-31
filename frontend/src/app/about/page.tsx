import Link from 'next/link';
import { Cpu, Layers, BookOpen, ChevronRight } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="w-full bg-brand-bg relative overflow-hidden">
      
      {/* Aurora Radial Glows */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* 🍵 Section 1: Hero Block */}
      <section className="relative border-b border-brand-neon/20 py-20 md:py-32 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block border border-brand-neon bg-brand-neon/15 px-3 py-1 text-xs uppercase font-bold tracking-widest text-brand-neon shadow-[0_0_10px_rgba(0,255,136,0.15)] mb-6">
              Our Academic Heritage & AI Lab
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-[1.05] mb-8">
              Pioneering Botanical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">
                Deep Learning
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-brand-white/80 leading-relaxed max-w-2xl">
              We bridge agricultural science and state-of-the-art computer vision to secure the future of the tea industry. Our hybrid neural network models analyze cellular anomalies in tea leaves with clinical precision.
            </p>
          </div>
        </div>
      </section>

      {/* 🔬 Section 2: Two-Column Vision */}
      <section className="border-b border-brand-neon/10 bg-brand-panel">
        <div className="mx-auto max-w-7xl px-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brand-white/10">
          
          {/* Column 1: Image Frame */}
          <div className="relative min-h-[350px] bg-brand-bg flex items-center justify-center p-8 overflow-hidden">
            <div className="w-full h-full relative border border-brand-neon/30 min-h-[300px] shadow-[0_0_20px_rgba(0,255,136,0.1)]">
              <img
                src="images\about1.png"
                alt="Tea estate leaf inspection"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute bottom-4 left-4 bg-brand-bg border border-brand-neon/40 text-brand-neon px-3 py-1 text-xs uppercase font-mono tracking-wider shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                Estate Telemetry Lab
              </div>
            </div>
          </div>

          {/* Column 2: Content - Raised from text-xs to text-sm */}
          <div className="p-8 md:p-16 flex flex-col justify-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-white">
              Protecting Global Harvests
            </h2>
            <p className="text-sm font-light text-brand-white/70 leading-relaxed">
              Tea is a foundational crop, supporting millions of rural livelihoods worldwide. However, seasonal crop pathogens like Red Rust, Gray Blight and Brown Blight cause substantial losses annually. 
            </p>
            <p className="text-sm font-light text-brand-white/70 leading-relaxed">
              Traditional diagnosis relies on rare botanical inspectors, causing critical treatment delays. Our system integrates custom-trained AI model pipelines to deliver diagnostic accuracy above 99% in under 500 milliseconds, allowing immediate remediation directly in the field.
            </p>
            
            {/* Raised stat subtitle from text-[10px] to text-xs */}
            <div className="pt-4 grid grid-cols-3 gap-4">
              <div className="border border-brand-neon/30 p-3 bg-brand-bg shadow-[0_0_10px_rgba(0,255,136,0.05)]">
                <span className="block font-serif text-3xl font-bold text-brand-neon">88.85%</span>
                <span className="text-xs uppercase font-bold text-brand-white/50">CNN Acc.</span>
              </div>
              <div className="border border-brand-neon/30 p-3 bg-brand-bg shadow-[0_0_10px_rgba(0,255,136,0.05)]">
                <span className="block font-serif text-3xl font-bold text-brand-neon">97.46%</span>
                <span className="text-xs uppercase font-bold text-brand-white/50">EfficientNet-B0 Acc.</span>
              </div>
              <div className="border border-brand-cyan/30 p-3 bg-brand-bg shadow-[0_0_10px_rgba(0,240,255,0.05)]">
                <span className="block font-serif text-3xl font-bold text-brand-cyan">96.69%</span>
                <span className="text-xs uppercase font-bold text-brand-white/50">ViT-Base Acc.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🚀 Section 3: Technical Architecture */}
      <section className="py-20 border-b border-brand-neon/10 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif text-4xl font-bold text-brand-white mb-4">
              Our Hybrid Ensemble Engine
            </h2>
            {/* Raised from text-xs to text-sm */}
            <p className="text-sm font-light text-brand-white/60">
              Unlike generic single-model neural networks, our system leverages a hybrid diagnostic pipeline combining local visual features and global attention patterns:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tech Block 1 - Raised desc to text-sm */}
            <div className="border-2 border-brand-gold/30 bg-brand-panel p-6 space-y-4 shadow-[0_0_15px_rgba(244,196,48,0.05)]">
              <div className="border border-brand-gold p-2 bg-brand-gold/15 text-brand-gold w-fit shadow-[0_0_8px_rgba(244,196,48,0.2)]">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wider text-brand-white font-mono">
                CNN (Weight 0.3)
              </h3>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                Captures local visual disease features such as leaf spots, lesions, colour changes, edges and texture patterns through convolutional layers. The CNN acts as the baseline architecture and contributes its class probability predictions to the final weighted ensemble.
              </p>
            </div>
            

            {/* Tech Block 2 - Raised desc to text-sm */}
            <div className="border-2 border-brand-neon/30 bg-brand-panel p-6 space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
              <div className="border border-brand-neon p-2 bg-brand-neon/15 text-brand-neon w-fit shadow-[0_0_8px_rgba(0,255,136,0.2)]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wider text-brand-white font-mono">
                EfficientNet-B0 (Weight 0.5)
              </h3>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                Captures high-frequency local textures, leaf venation shifts, and localized rust lesion spots. Its depth-wise separable convolutions ensure ultra-fast processing speeds on mobile hardware.
              </p>
            </div>
            

            {/* Tech Block 3 - Raised desc to text-sm */}
            <div className="border-2 border-brand-cyan/30 bg-brand-panel p-6 space-y-4 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
              <div className="border border-brand-cyan p-2 bg-brand-cyan/15 text-brand-cyan w-fit shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg uppercase tracking-wider text-brand-white font-mono">
                ViT-Based (Weight 0.2)
              </h3>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                Processes global self-attention. ViT segments the leaf image into patches to map wide discoloration vectors, outperforming traditional CNNs on complex, overlapping multi-pathogen infections.
              </p>
            </div>
            

          </div>
        </div>
      </section>

      {/* 👥 Section 4: Science Advisory Board */}
      <section className="py-20 bg-brand-panel">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-brand-white mb-4">
              Agronomy & Systems Team
            </h2>
            {/* Raised from text-xs to text-sm */}
            <p className="text-sm font-light text-brand-white/60">
              Meet the research agronomists, Deep Learning researchers, and plant pathologists driving our scientific models forward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Team Member 1 - Raised sub to text-xs */}
            <div className="border border-brand-neon/30 p-4 bg-brand-bg space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
              <div className="aspect-[4/5] bg-brand-panel relative overflow-hidden border border-brand-neon/20">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop"
                  alt="Dr. Aris Thorne"
                  className="w-full h-full object-cover filter grayscale contrast-110"
                />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-brand-neon text-sm">Dr. Aris Thorne</h4>
                <p className="text-xs text-brand-white/50 font-mono">Lead Deep Learning Researcher</p>
              </div>
            </div>

            {/* Team Member 2 - Raised sub to text-xs */}
            <div className="border border-brand-neon/30 p-4 bg-brand-bg space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
              <div className="aspect-[4/5] bg-brand-panel relative overflow-hidden border border-brand-neon/20">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop"
                  alt="Prof. Elena Rostova"
                  className="w-full h-full object-cover filter grayscale contrast-110"
                />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-brand-neon text-sm">Prof. Elena Rostova</h4>
                <p className="text-xs text-brand-white/50 font-mono">Chief Plant Pathologist</p>
              </div>
            </div>

            {/* Team Member 3 - Raised sub to text-xs */}
            <div className="border border-brand-neon/30 p-4 bg-brand-bg space-y-4 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
              <div className="aspect-[4/5] bg-brand-panel relative overflow-hidden border border-brand-neon/20">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop"
                  alt="Sahan Gunawardene"
                  className="w-full h-full object-cover filter grayscale contrast-110"
                />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-brand-neon text-sm">Sahan Gunawardene</h4>
                <p className="text-xs text-brand-white/50 font-mono">Senior Systems Engineer</p>
              </div>
            </div>

          </div>

          {/* Call to Action - Raised desc to text-sm */}
          <div className="mt-20 border-2 border-brand-neon p-8 bg-brand-panel text-brand-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_30px_rgba(0,255,136,0.15)] relative">
            <div className="absolute top-0 left-0 w-2 h-2 bg-brand-neon" />
            <div className="space-y-2 max-w-2xl">
              <h3 className="font-serif text-2xl font-bold">Ready to analyze your crops in real-time?</h3>
              <p className="text-sm text-brand-white/80 font-light">
                Our hybrid ensemble network is running and prepared for immediate image diagnosis.
              </p>
            </div>
            <Link href="/#analyzer" className="btn-neon btn-neon-primary shrink-0 text-sm py-3 px-6">
              Start Diagnosis <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
