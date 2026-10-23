'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowUpRight } from 'lucide-react';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-ivory shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-sand" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-tight text-forest font-semibold leading-none">
                MedSecure
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-brown font-medium mt-0.5">
                Digital Health Records
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-dark-brown/80 hover:text-forest transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-dark-brown/80 hover:text-forest transition-colors"
            >
              How It Works
            </a>
            <a
              href="#security"
              className="text-sm font-medium text-dark-brown/80 hover:text-forest transition-colors"
            >
              Privacy & Security
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`${WEB_URL}/login`}
              className="text-sm font-medium text-forest hover:text-forest-dark px-4 py-2.5 rounded-lg transition-colors"
            >
              Log In
            </a>
            <a
              href={`${WEB_URL}/signup`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-forest hover:bg-forest-light text-ivory px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-4 h-4 text-sand" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-dark-brown hover:bg-cream transition-colors"
              aria-label="Toggle mobile navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand bg-cream px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-dark-brown hover:text-forest py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-dark-brown hover:text-forest py-1"
            >
              How It Works
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-dark-brown hover:text-forest py-1"
            >
              Privacy & Security
            </a>
          </nav>
          <div className="pt-3 border-t border-sand/80 flex flex-col gap-2.5">
            <a
              href={`${WEB_URL}/login`}
              className="w-full text-center py-2.5 text-sm font-medium text-forest border border-forest/30 rounded-lg hover:bg-sand/30"
            >
              Log In
            </a>
            <a
              href={`${WEB_URL}/signup`}
              className="w-full text-center py-2.5 text-sm font-semibold bg-forest text-ivory rounded-lg shadow-sm"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
