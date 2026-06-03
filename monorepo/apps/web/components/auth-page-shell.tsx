import Link from "next/link";
import { CiHospital1 } from "react-icons/ci";

export function AuthPageShell({
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLinkLabel,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
}) {
  return (
    <div className="auth-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="page-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-teal-200 ring-1 ring-white/20">
            <CiHospital1 className="h-4 w-4" />
          </span>
          MedSecure
        </Link>

        <div className="auth-form-card p-8 sm:p-10">
          <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-white/55">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-medium text-teal-300 transition hover:text-teal-200"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AuthLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-white/75">{children}</label>
  );
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/50 focus:bg-white/15 focus:ring-2 focus:ring-teal-400/25 ${props.className ?? ""}`}
      style={{
        borderRadius: "var(--auth-radius-sm)",
        ...props.style,
      }}
    />
  );
}

export function AuthButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className={`w-full bg-gradient-to-r from-teal-400/90 to-cyan-500/90 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-teal-900/20 transition hover:brightness-110 disabled:opacity-50 ${props.className ?? ""}`}
      style={{
        borderRadius: "var(--auth-radius-sm)",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export function AuthAlert({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "success";
}) {
  return (
    <p
      className={`px-4 py-2.5 text-sm ${
        tone === "success"
          ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25"
          : "bg-red-500/15 text-red-200 ring-1 ring-red-400/25"
      }`}
      style={{ borderRadius: "var(--auth-radius-sm)" }}
    >
      {children}
    </p>
  );
}
