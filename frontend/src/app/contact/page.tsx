'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    estate: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        setIsSent(true);
        setFormData({ name: '', email: '', estate: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Failed to submit telemetry ticket.');
      }
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMsg('Could not establish connection to the telemetry server. Please ensure the backend is active.');
    }
  };

  return (
    <div className="w-full bg-brand-bg relative overflow-hidden">
      
      {/* Aurora Radial Glows */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* 🍵 Section 1: Hero Block */}
      <section className="relative border-b border-brand-neon/20 py-20 md:py-28 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block border border-brand-neon bg-brand-neon/15 px-3 py-1 text-xs uppercase font-bold tracking-widest text-brand-neon shadow-[0_0_10px_rgba(0,255,136,0.15)] mb-6">
              Agronomy Communications Desk
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-[1.05] mb-8">
              Connect With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">
                Our AI Laboratory
              </span>
            </h1>
            <p className="text-lg md:text-xl font-light text-brand-white/80 leading-relaxed max-w-2xl">
              Have technical API queries, model custom-weight requests, or estate diagnostic concerns? Submit a ticket to our central research division.
            </p>
          </div>
        </div>
      </section>

      {/* 🛠 Section 2: Contact Layout */}
      <section className="border-b border-brand-neon/10 bg-brand-panel">
        <div className="mx-auto max-w-7xl px-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-brand-white/10">
          
          {/* Left Column: Form Desk (lg:7) */}
          <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center">
            
            {!isSent ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold text-brand-white">
                    Submit Telemetry Ticket
                  </h2>
                  {/* Raised from text-xs to text-sm */}
                  <p className="text-sm font-light text-brand-white/50 leading-relaxed">
                    All communications are processed through our encrypted lab queue. Standard response delay is under 24 hours.
                  </p>
                </div>

                {errorMsg && (
                  <div className="border border-brand-rust/35 bg-brand-rust/10 p-3.5 flex gap-2.5 text-brand-rust font-mono text-xs uppercase tracking-wider items-center shadow-[0_0_15px_rgba(255,85,51,0.15)]">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name - Label raised from text-[10px] to text-xs, inputs to text-sm */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs uppercase font-bold tracking-wider text-brand-white/60 font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Your Name"
                      className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/40 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs uppercase font-bold tracking-wider text-brand-white/60 font-mono">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. email@estate.lk"
                      className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/40 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Estate */}
                <div className="space-y-1.5">
                  <label htmlFor="estate" className="text-xs uppercase font-bold tracking-wider text-brand-white/60 font-mono">
                    Estate / Cooperative Reference Name
                  </label>
                  <input
                    type="text"
                    id="estate"
                    name="estate"
                    value={formData.estate}
                    onChange={handleInputChange}
                    placeholder="e.g. Nuwara Eliya East Plantation"
                    className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/40 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all font-mono"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs uppercase font-bold tracking-wider text-brand-white/60 font-mono">
                    Technical message / Inquiry details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Provide clear technical parameters or diagnostic questions here..."
                    className="w-full px-4 py-3 bg-brand-bg text-sm border border-brand-white/20 text-brand-white placeholder-brand-white/40 focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all font-mono"
                  />
                </div>

                {/* Submit button - Raised text size to text-sm */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-neon btn-neon-primary w-full flex justify-center items-center gap-2 cursor-pointer text-sm py-3.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Streaming to Lab Server...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Transmit Ticket
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="border border-brand-neon bg-brand-bg p-8 text-center space-y-6 animate-slide-up shadow-[0_0_30px_rgba(0,255,136,0.15)] relative">
                <div className="absolute top-0 left-0 w-2 h-2 bg-brand-neon" />
                <div className="border border-brand-neon p-4 bg-brand-neon/15 text-brand-neon w-fit mx-auto shadow-[0_0_12px_rgba(0,255,136,0.2)]">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-bold text-brand-white">Ticket Transmitted Successfully</h3>
                  {/* Raised from text-xs to text-sm */}
                  <p className="text-sm text-brand-white/70 max-w-md mx-auto leading-relaxed">
                    Your message was logged under encrypted sequence <span className="font-mono text-brand-cyan font-bold text-sm">#SEQ-{(Math.random() * 1000000).toFixed(0)}</span>. Our agronomists will evaluate and respond shortly.
                  </p>
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className="btn-neon btn-neon-secondary text-xs uppercase"
                >
                  Send Another Ticket
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Corporate Addresses & Info (lg:5) - Raised addresses from text-xs to text-sm */}
          <div className="lg:col-span-5 p-8 md:p-16 flex flex-col justify-center space-y-8 bg-brand-bg">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-neon font-mono">
                Agronomy Headquarters
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-white">
                Tea Diagnostics Agronomy & AI Lab
              </h3>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="border border-brand-cyan p-2 bg-brand-cyan/15 text-brand-cyan shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.15)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-white/80 font-mono">Lab Coordinates</h4>
                  <p className="text-sm text-brand-white/60 leading-relaxed font-light">
                    Level 3, Agricultural Research Complex,<br />
                    Glenlyon Estate Road, Nuwara Eliya 22200,<br />
                    Sri Lanka
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex gap-4 items-start">
                <div className="border border-brand-cyan p-2 bg-brand-cyan/15 text-brand-cyan shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.15)]">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-white/80 font-mono">Inquiry Desk</h4>
                  <p className="text-sm text-brand-white/60 leading-relaxed font-light">
                    Office Line: +94 52 222 4000<br />
                    Laboratory Dial-In: +94 52 222 4002
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="border border-brand-cyan p-2 bg-brand-cyan/15 text-brand-cyan shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.15)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-white/80 font-mono">Electronic Mail</h4>
                  <p className="text-sm text-brand-white/60 leading-relaxed font-light">
                    Central Ticket Admin: admin@tea-diagnostics.org<br />
                    Model Telemetry Team: support@tea-diagnostics.org
                  </p>
                </div>
              </div>
            </div>

            {/* Shield Notice - Raised from text-[9px] to text-xs */}
            <div className="border border-brand-neon/20 p-4 bg-brand-panel text-brand-neon font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[inset_0_0_10px_rgba(0,255,136,0.05)]">
              <ShieldCheck className="h-5 w-5 text-brand-neon shrink-0 animate-pulse" />
              <span>Encrypted SSL Telemetry Transmissions Enabled</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
