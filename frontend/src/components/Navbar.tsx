'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf, Cpu, Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, setAuthModalOpen } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Packages', href: '/packages' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-neon/30 bg-brand-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="border border-brand-neon p-2 bg-brand-neon text-brand-bg group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-all shadow-[0_0_10px_rgba(0,255,136,0.3)] shrink-0">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl md:text-2.5xl font-bold tracking-tight text-brand-white shrink-0">
                TEA<span className="text-brand-neon font-sans font-light">.</span>DIAGNOSTICS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase font-bold tracking-widest transition-all relative py-2 shrink-0 ${
                    isActive
                      ? 'text-brand-neon drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                      : 'text-brand-white/80 hover:text-brand-neon'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-neon shadow-[0_0_8px_#00ff88]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA / Auth Blocks */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-3 xl:gap-4 animate-fade-in shrink-0">
                <div className="text-right hidden xl:block shrink-0">
                  <span className="block text-[8px] text-brand-white/40 font-mono font-bold uppercase tracking-wider">Operator Account</span>
                  <span className="block text-xs font-light text-brand-white/85 max-w-[140px] truncate" title={user.email}>
                    {user.email}
                  </span>
                </div>
                
                <Link
                  href="/packages"
                  className="border border-brand-neon bg-brand-neon/15 px-2.5 py-1.5 text-xs font-mono font-bold text-brand-neon shadow-[0_0_8px_rgba(0,255,136,0.15)] flex items-center gap-1.5 hover:bg-brand-neon/20 transition-all cursor-pointer shrink-0"
                >
                  <Coins className="h-3.5 w-3.5 shrink-0" />
                  <span>{user.credits.toLocaleString()} Credits</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-xs uppercase font-mono tracking-wider text-brand-cyan hover:text-brand-neon transition-colors cursor-pointer py-1.5 px-2.5 border border-brand-cyan/20 hover:border-brand-neon shrink-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-neon text-xs py-2.5 px-4 flex items-center gap-2 font-bold cursor-pointer shrink-0"
              >
                Sign In
              </button>
            )}

            <Link
              href="/#analyzer"
              className="btn-neon btn-neon-secondary text-xs py-2.5 px-4 flex items-center gap-2 font-bold shrink-0"
            >
              <Cpu className="h-4 w-4 shrink-0" />
              Analyzer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="border border-brand-neon/40 p-2 text-brand-white hover:bg-brand-panel hover:text-brand-neon transition-all"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-brand-neon/30 bg-brand-panel" id="mobile-menu">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block border-l-4 py-3 px-4 text-base font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'border-brand-neon bg-brand-bg text-brand-neon drop-shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                      : 'border-transparent text-brand-white/80 hover:bg-brand-bg hover:text-brand-neon'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Auth Actions */}
            <div className="pt-4 pb-2 border-t border-brand-white/10 space-y-3">
              {user ? (
                <div className="space-y-3 px-4">
                  <div className="text-left">
                    <span className="block text-[10px] text-brand-white/40 font-mono uppercase">Operator Account</span>
                    <span className="block text-sm text-brand-white/80 break-all">{user.email}</span>
                  </div>
                  
                  <Link
                    href="/packages"
                    onClick={() => setIsOpen(false)}
                    className="border border-brand-neon bg-brand-neon/15 px-3 py-2 text-sm font-mono font-bold text-brand-neon flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Coins className="h-4 w-4" />
                    <span>{user.credits.toLocaleString()} Credits</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-xs uppercase font-mono tracking-widest text-brand-cyan hover:text-brand-neon py-2.5 border border-brand-cyan/20 hover:border-brand-neon cursor-pointer block"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full btn-neon justify-center flex items-center gap-2 text-xs py-3 cursor-pointer"
                >
                  Sign In
                </button>
              )}

              <Link
                href="/#analyzer"
                onClick={() => setIsOpen(false)}
                className="w-full btn-neon btn-neon-secondary justify-center flex items-center gap-2 text-xs py-3"
              >
                <Cpu className="h-4 w-4" />
                Leaf Analyzer
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
