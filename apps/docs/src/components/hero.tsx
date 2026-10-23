import { ArrowRight, QrCode, Heart, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-ivory">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sand/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-sand text-xs font-medium text-forest mb-6">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Patient-Controlled Health Records</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-forest leading-[1.08] mb-6">
              Your Health Story, <br />
              <span className="italic text-terracotta">Always Within Reach.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-brown max-w-2xl font-normal leading-relaxed mb-8">
              MedSecure enables you to organize your medical history, manage allergies and medications, and generate a secure, revocable QR code so healthcare professionals can view authorized vital records instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href={`${WEB_URL}/signup`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-forest hover:bg-forest-light text-ivory text-base font-semibold shadow-warm-lg hover:shadow-xl transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 text-sand" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-cream hover:bg-sand/60 border border-sand text-base font-semibold text-dark-brown transition-colors"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-sand/70 w-full max-w-lg">
              <div>
                <div className="font-serif text-2xl font-bold text-forest">100%</div>
                <div className="text-xs text-muted-brown mt-0.5">Patient Owned</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-forest">SHA-256</div>
                <div className="text-xs text-muted-brown mt-0.5">Hashed QR Tokens</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-forest">Instant</div>
                <div className="text-xs text-muted-brown mt-0.5">Revocation Control</div>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Visual Mockup Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-sand/80 shadow-warm-lg p-6 relative overflow-hidden">
              {/* Header badge */}
              <div className="flex items-center justify-between pb-5 border-b border-sand/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
                    <ShieldCheck className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-dark-brown leading-tight">Emergency Health ID</h3>
                    <p className="text-[11px] text-muted-brown">Patient Verified</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sage/20 text-forest">
                  Active Token
                </span>
              </div>

              {/* Dynamic QR Illustration */}
              <div className="my-6 p-4 rounded-xl bg-ivory border border-sand/70 flex flex-col items-center">
                <div className="w-36 h-36 bg-white p-2 rounded-lg border border-sand shadow-inner flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-forest" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-medium text-muted-brown mt-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                  Scannable by authorized medical staff
                </span>
              </div>

              {/* Patient Vital Summary Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-cream/50 border border-sand/50">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-medium text-dark-brown">Blood Group</span>
                  </div>
                  <span className="text-xs font-bold text-forest">O-Positive (O+)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-cream/50 border border-sand/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-medium text-dark-brown">Known Allergies</span>
                  </div>
                  <span className="text-xs font-bold text-terracotta">Penicillin (Severe)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-cream/50 border border-sand/50">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-forest" />
                    <span className="text-xs font-medium text-dark-brown">Emergency Contact</span>
                  </div>
                  <span className="text-xs font-medium text-dark-brown">+1 (555) 019-2834</span>
                </div>
              </div>

              {/* Data Minimization Security Notice */}
              <p className="text-[10px] text-muted-brown text-center mt-5 pt-3 border-t border-sand/50">
                Full clinical history is shielded. Emergency scan presents only vital indicators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
