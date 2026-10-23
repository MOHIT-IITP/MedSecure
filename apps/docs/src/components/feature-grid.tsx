import {
  QrCode,
  FileText,
  AlertTriangle,
  History,
  Lock,
  Stethoscope,
} from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'One QR for essential health information',
    description:
      'A single cryptographic QR token provides immediate access to emergency-approved details without exposing your complete private account.',
  },
  {
    icon: FileText,
    title: 'Organized medical history',
    description:
      'Maintain all your past diagnoses, hospital visits, surgical background, and personal health notes in one structured profile.',
  },
  {
    icon: AlertTriangle,
    title: 'Allergy and medication visibility',
    description:
      'Ensure first responders and attending physicians immediately see critical allergies, active medications, and contraindications.',
  },
  {
    icon: History,
    title: 'Easy access across visits',
    description:
      'Eliminate repetitive paper intake forms every time you visit a new clinic, specialist, or emergency healthcare facility.',
  },
  {
    icon: Lock,
    title: 'Patient-controlled sharing',
    description:
      'You are the sole custodian of your records. Generate temporary emergency tokens and revoke active QR access at any moment with one click.',
  },
  {
    icon: Stethoscope,
    title: 'Updated consultation history',
    description:
      'Authorized healthcare providers can append verified clinical consultation logs and treatment observations directly to your record.',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-cream/40 border-y border-sand/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Capabilities
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-forest mt-2 mb-4">
            Designed for Clarity, Built for Care.
          </h2>
          <p className="text-base sm:text-lg text-muted-brown leading-relaxed">
            MedSecure balances rapid medical accessibility with strict patient privacy. Every feature is engineered to protect your autonomy.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-sand/70 shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-ivory border border-sand flex items-center justify-center text-forest mb-6">
                    <Icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-forest mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-brown leading-relaxed font-normal">
                    {feature.description}
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
