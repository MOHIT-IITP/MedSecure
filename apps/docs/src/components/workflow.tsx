import { UserPlus, ClipboardList, QrCode, Stethoscope } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Register with your email and password. A secure, empty patient profile is provisioned instantly.',
  },
  {
    step: '02',
    icon: ClipboardList,
    title: 'Add your health information',
    description:
      'Enter your blood group, known allergies, current medications, chronic conditions, and emergency contacts.',
  },
  {
    step: '03',
    icon: QrCode,
    title: 'Generate your QR code',
    description:
      'Create a revocable emergency QR token. Only a secure cryptographic hash is stored on our servers.',
  },
  {
    step: '04',
    icon: Stethoscope,
    title: 'Share with a professional',
    description:
      'Present your QR code during doctor appointments or medical emergencies for instant, verified care.',
  },
];

export function Workflow() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-forest mt-2 mb-4">
            How MedSecure Works
          </h2>
          <p className="text-base sm:text-lg text-muted-brown leading-relaxed">
            Four simple steps to safeguard your medical history and enable instant emergency access.
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-cream/30 rounded-2xl p-7 border border-sand/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-normal text-terracotta/70">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-sand flex items-center justify-center text-forest shadow-sm">
                      <Icon className="w-5 h-5 text-forest" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-forest mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-brown leading-relaxed font-normal">
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
