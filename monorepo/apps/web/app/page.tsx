import React from "react";
import Link from "next/link";
import { LandingFooter } from "../components/landing-footer";
import {
  Shield,
  Activity,
  FileText,
  Heart,
  QrCode,
  User,
  Phone,
  CheckCircle2,
  Lock,
  Download,
  ChevronRight,
} from "../components/ui/icons";

const features = [
  {
    icon: User,
    title: "Emergency Health Profile",
    description:
      "Maintain critical medical data including blood group, allergies, chronic conditions, and emergency contacts with 1-tap dial.",
  },
  {
    icon: FileText,
    title: "Encrypted Report Vault",
    description:
      "Securely upload, organize, and download lab results, prescriptions, and imaging files protected by Supabase cloud storage.",
  },
  {
    icon: Activity,
    title: "Vitals & Trend Tracking",
    description:
      "Log blood pressure, resting heart rate, blood glucose, and body weight over time with visual trend summaries.",
  },
  {
    icon: QrCode,
    title: "Tokenized Emergency QR",
    description:
      "Generate an unguessable public QR token. Responders scan to view vital emergency context instantly without requiring an account.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
              <Shield size={18} />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              MedSecure
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Next-Gen Digital Health Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]">
                Health records,{" "}
                <span className="text-slate-500 font-bold">
                  one secure scan away.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage your medical profile, store clinical reports, track daily vitals, and share an emergency health card instantly through tokenized QR codes.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                >
                  Sign In to Dashboard
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="text-lg font-bold text-slate-900">Zero Login</p>
                  <p className="text-xs text-slate-500 mt-0.5">Emergency access</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">256-bit</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tokenized privacy</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">100% Free</p>
                  <p className="text-xs text-slate-500 mt-0.5">Patient first</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Emergency Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white font-bold text-xs">
                      +
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Emergency Health ID</p>
                      <p className="text-[10px] text-slate-400">MedSecure Verified</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>

                {/* Patient Summary */}
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">John Doe</h3>
                    <p className="text-xs text-slate-500">Age: 32 · Male</p>
                  </div>
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-center">
                    <span className="text-[10px] font-bold uppercase text-red-600 block">
                      Blood Group
                    </span>
                    <span className="text-lg font-black text-red-700 leading-none block mt-0.5">
                      O+
                    </span>
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                      Allergies
                    </span>
                    <span className="font-semibold text-slate-800">
                      Penicillin, Peanut derivative
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                      Emergency Contact
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-semibold text-slate-800">
                        Sarah (Spouse) +1 (555) 019-2834
                      </span>
                      <Phone size={13} className="text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Simulated QR footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-slate-900 text-white rounded flex items-center justify-center">
                      <QrCode size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-900">
                        Scan for Emergency View
                      </p>
                      <p className="text-[10px] text-slate-400">No login required</p>
                    </div>
                  </div>
                  <Shield size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white py-20 border-y border-slate-200/80">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Core Capabilities
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything required to safeguard your health data.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 hover:border-slate-300 hover:bg-white transition duration-150"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs text-slate-900 mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Privacy & Security Callout */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Security First Architecture
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Built to keep sensitive clinical documents completely private.
                </h3>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-xl">
                  MedSecure isolates public emergency response snapshots from private diagnostic lab reports. Even if someone scans your emergency QR code, your private reports are never visible.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-xs font-bold text-slate-950 shadow-xs hover:bg-slate-100 transition text-center"
                >
                  Create Your Health Profile
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition text-center"
                >
                  Existing User Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
