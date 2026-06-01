import Link from "next/link";
import { LandingFooter } from "../components/landing-footer";
import { Card } from "../components/ui";

type FeatureItem = { title: string; desc: string };

const featureGroups: {
  category: string;
  accent: "teal" | "indigo" | "violet" | "amber";
  items: [FeatureItem, FeatureItem];
}[] = [
  {
    category: "Account",
    accent: "teal",
    items: [
      {
        title: "Sign up & secure sessions",
        desc: "Register, log in, and stay signed in with HTTP-only JWT cookies and hashed passwords.",
      },
      {
        title: "Profile & emergency info",
        desc: "Set blood group, allergies, chronic conditions, emergency contact, and personal details.",
      },
    ],
  },
  {
    category: "Reports",
    accent: "indigo",
    items: [
      {
        title: "Upload medical reports",
        desc: "Store PDFs and images in encrypted cloud storage linked to your account.",
      },
      {
        title: "Organize & download",
        desc: "Browse history, download with signed URLs, or delete files you no longer need.",
      },
    ],
  },
  {
    category: "Health",
    accent: "violet",
    items: [
      {
        title: "Daily vitals tracking",
        desc: "Log blood pressure, sugar, pulse, weight, and notes each day.",
      },
      {
        title: "Health log timeline",
        desc: "Review past entries in order to spot trends over time.",
      },
    ],
  },
  {
    category: "QR",
    accent: "amber",
    items: [
      {
        title: "QR code & public view",
        desc: "Generate your code; scans open a read-only emergency dashboard with no login.",
      },
      {
        title: "Token-only sharing",
        desc: "Opaque QR tokens — not user IDs. Private reports never appear on the public page.",
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="landing-mesh relative flex min-h-screen flex-col overflow-hidden text-white">
      <div className="page-grid pointer-events-none absolute inset-0" aria-hidden />

      <div
        className="animate-pulse-glow pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float-delayed pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6">
        <div className="glass-panel flex items-center justify-between rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20 text-sm font-bold text-teal-200 ring-1 ring-teal-300/30">
              M
            </span>
            <span className="text-lg font-semibold tracking-tight">MedSecure</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/30"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pt-8 pb-16 sm:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="glass-panel mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-teal-100/90">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.8)]" />
              Digital health · QR emergency access
            </p>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your health records,{" "}
              <span className="bg-linear-to-r from-teal-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
                one scan away
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:mx-0">
              Store medical reports, track daily vitals, and share emergency info through a
              secure QR code — built for patients, clinicians, and first responders.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/signup"
                className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-teal-400/90 to-cyan-500/90 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-teal-500/25 transition hover:shadow-teal-400/40"
              >
                <span className="relative z-10">Get started free</span>
                <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
              </Link>
              <Link
                href="/login"
                className="glass-panel rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                I have an account
              </Link>
            </div>

            <dl className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start">
              {[
                { label: "Setup", value: "< 2 min" },
                { label: "Sharing", value: "Token-only" },
                { label: "Storage", value: "Encrypted" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <dt className="text-xs font-medium uppercase tracking-wider text-white/45">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-white/95">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="glass-panel-strong animate-float-slow relative z-10 rounded-3xl p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white/60">Emergency profile</span>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/45">Blood group</p>
                  <p className="text-lg font-semibold">O+</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/45">Allergies</p>
                  <p className="text-sm text-white/85">Penicillin</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-white/45">Emergency contact</p>
                  <p className="text-sm text-white/85">+1 (555) 010-0247</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="h-14 w-14 shrink-0 rounded-lg bg-white p-1">
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${i % 2 === 0 ? "bg-slate-800" : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/50">Scan for full view</p>
                  <p className="text-sm text-white/80">No login required</p>
                </div>
              </div>
            </div>

            <div className="glass-panel absolute -bottom-4 -left-4 z-20 rounded-2xl px-4 py-3 sm:-left-8">
              <p className="text-xs text-white/50">Latest vitals</p>
              <p className="text-sm font-medium">BP 118/76 · Pulse 72</p>
            </div>

            <div className="glass-panel absolute -right-2 -top-3 z-0 rounded-2xl px-3 py-2 sm:-right-6">
              <p className="text-xs font-medium text-teal-200/90">JWT secured</p>
            </div>
          </div>
        </div>

        <section className="mt-24" aria-labelledby="features-heading">
          <Card className="mt-8 p-6 sm:p-8 glass-panel">
            <div className="text-center lg:text-left">
              <h2
                id="features-heading"
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Everything in one platform
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/60 lg:mx-0">
                From secure sign-in to emergency QR sharing — every feature you need to
                manage and share health information safely.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {featureGroups.map((group) => (
                <Card
                  key={`mini-${group.category}`}
                  className={`p-6 sm:p-8 glass-panel backdrop-blur-2xl feature-card--minimal feature-card--${group.accent} text-white/95 h-full`}
                >
                  <span className={`feature-tag feature-tag--${group.accent} px-5 py-3 backdrop-blur-2xl rounded-4xl bg-white/10 uppercase text-sm`}>{group.category}</span>

                  <ul className="mt-4 space-y-3">
                    {group.items.map((it) => (
                      <li key={it.title} className="text-left">
                        <h4 className="text-base font-semibold text-white/95">{it.title}</h4>
                        <p className="text-sm text-white/60">{it.desc}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            {/* Detailed feature list removed — mini tagged cards display each group's features */}
          </Card>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}