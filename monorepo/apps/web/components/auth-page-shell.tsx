import React from "react";
import Link from "next/link";
import { Shield } from "./ui/icons";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs group-hover:bg-slate-800 transition">
            <Shield size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            MedSecure
          </span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {/* Form Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200/90 rounded-2xl sm:px-10">
          {children}
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-semibold text-slate-900 hover:text-blue-600 transition underline underline-offset-2"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
