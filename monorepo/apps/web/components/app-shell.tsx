"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/records", label: "Health logs" },
  { href: "/qr", label: "QR code" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="landing-mesh relative min-h-screen overflow-hidden text-white">
      <div className="page-grid pointer-events-none absolute inset-0" aria-hidden />

      <div
        className="animate-pulse-glow pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-16 top-1/3 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="glass-panel flex items-center justify-between gap-4 rounded-2xl px-5 py-3">
          <Link href="/dashboard" className="text-lg font-semibold text-teal-200">
            MedSecure
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-white/12 text-teal-100"
                    : "text-white/65 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                pathname === item.href
                  ? "bg-white/12 text-teal-100"
                  : "text-white/65"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="glass-panel mb-6 rounded-3xl px-5 py-4 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
