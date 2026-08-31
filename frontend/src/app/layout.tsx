 import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Tea Diagnostics | AI-Powered Tea Leaf Disease Analyzer & Agronomy Platform',
  description:
    'An advanced Deep Learning agricultural ensemble model (Vision Transformer & EfficientNet-B0) designed to run instant, high-precision tea crop disease diagnosis with Explainable AI (Grad-CAM heatmaps). Built for modern tea estates and agronomists.',
  keywords: 'tea leaf disease, tea agriculture, crop disease analyzer, blister blight, red rust, brown blight, vit tea model, efficientnet, grad-cam tea, tea farming sri lanka',
  authors: [{ name: 'Tea Diagnostics Agronomy & AI Lab' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-brand-lightcream text-brand-charcoal">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
