import { ArrowRight, Shield } from 'lucide-react';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

export function CtaBanner() {
  return (
    <section className="py-20 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-forest p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-warm-lg">
          {/* Subtle decorative background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-sand mb-6">
              <Shield className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ivory tracking-tight leading-tight mb-6">
              Take Ownership of Your Health Information Today.
            </h2>

            <p className="text-base sm:text-lg text-sand/90 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
              Set up your profile in minutes. Be prepared for every medical consultation and unexpected emergency with a single secure QR code.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${WEB_URL}/signup`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-sand hover:bg-cream text-forest text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5 text-forest" />
              </a>
              <a
                href={`${WEB_URL}/login`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-ivory hover:text-white border border-sand/30 hover:border-sand/60 text-base font-medium transition-colors"
              >
                Log In to Existing Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
