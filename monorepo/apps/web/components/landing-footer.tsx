import Link from "next/link";
import { CiHospital1 } from "react-icons/ci";

const links = {
  product: [
    { href: "/signup", label: "Get started" },
    { href: "/login", label: "Log in" },
  ],
  account: [
    { href: "/signup", label: "Create account" },
    { href: "/login", label: "Sign in" },
  ],
};

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20 text-sm font-bold text-teal-200 ring-1 ring-teal-300/30">
                <CiHospital1 className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold text-white">MedSecure</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              Digital health records with token-based QR sharing for emergencies.
              Private vault for reports and vitals; public view only when you choose.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {links.product.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              {links.account.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {year} MedSecure. All rights reserved.
          </p>
          <p className="text-xs text-white/35">
            Built for patients, clinicians, and first responders.
          </p>
        </div>
      </div>
    </footer>
  );
}
