import { ShieldAlert, KeyRound, EyeOff, Ban } from 'lucide-react';

const securityCommitments = [
  {
    icon: KeyRound,
    title: 'SHA-256 Token Hashing',
    description:
      'We never store plaintext QR tokens in our database. Only cryptographic SHA-256 hashes are persisted, preventing credential harvesting even in the event of an infrastructure breach.',
  },
  {
    icon: EyeOff,
    title: 'Emergency Data Minimization',
    description:
      'Public QR scans strictly expose emergency-approved details (blood type, critical allergies, emergency contacts). Your comprehensive consultation logs and private notes remain shielded.',
  },
  {
    icon: Ban,
    title: 'Instant Server-Side Revocation',
    description:
      'If you lose a printed card or wish to expire a shared QR, revoke it instantly with one click. Our database validates token status in real-time on every single scan.',
  },
  {
    icon: ShieldAlert,
    title: 'Zero Anonymous Write Access',
    description:
      'No visitor can modify or append notes to your medical history without verified credentials. Doctor-authored consultation logs require an authenticated medical practitioner account.',
  },
];

export function PrivacySecurity() {
  return (
    <section id="security" className="py-20 lg:py-28 bg-cream/40 border-t border-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Privacy By Design
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-forest mt-2 mb-4">
            Security That Respects Your Rights
          </h2>
          <p className="text-base sm:text-lg text-muted-brown leading-relaxed">
            We make only factual, verifiable claims about how MedSecure stores, verifies, and protects your sensitive health data.
          </p>
        </div>

        {/* 4 Security Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {securityCommitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-sand/70 shadow-warm flex gap-5 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-ivory border border-sand flex-shrink-0 flex items-center justify-center text-forest">
                  <Icon className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-normal text-forest mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-brown leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
