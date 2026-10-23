import { Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-cream/60 border-t border-sand/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-ivory">
                <Shield className="w-4 h-4 text-sand" />
              </div>
              <span className="font-serif text-2xl font-semibold text-forest tracking-tight">
                MedSecure
              </span>
            </Link>
            <p className="text-xs text-muted-brown leading-relaxed">
              A patient-controlled digital health-record platform designed for emergency clarity and routine consultation continuity.
            </p>
            <p className="text-[11px] text-muted-brown/80">
              © {new Date().getFullYear()} MedSecure Platform. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-brown">
              <li>
                <a href="#features" className="hover:text-forest transition-colors">
                  Product Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-forest transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-forest transition-colors">
                  Privacy & Security
                </a>
              </li>
              <li>
                <a href="http://localhost:3000/login" className="hover:text-forest transition-colors">
                  Patient Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-4">
              Privacy & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-brown">
              <li>
                <span className="text-dark-brown/90 font-medium">Data Sovereignty:</span>
                <span className="block text-[11px] text-muted-brown mt-0.5">
                  You own and control access to your records at all times.
                </span>
              </li>
              <li>
                <span className="text-dark-brown/90 font-medium">Encryption Standard:</span>
                <span className="block text-[11px] text-muted-brown mt-0.5">
                  SHA-256 token hashing and encrypted PostgreSQL storage.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact (Clearly labeled placeholders) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-4">
              Inquiries & Support
            </h4>
            <div className="p-3.5 rounded-xl bg-ivory border border-sand/70 text-xs text-muted-brown space-y-2">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sand/60 text-dark-brown uppercase tracking-wider">
                Placeholder
              </span>
              <p className="text-[11px] leading-relaxed">
                Contact channels below are simulated for demonstration:
              </p>
              <p className="font-mono text-[11px] text-dark-brown">support@medsecure.example</p>
              <p className="font-mono text-[11px] text-dark-brown">+1 (800) 555-0199</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
