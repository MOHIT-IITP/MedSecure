import React from "react";
import Link from "next/link";
import { Shield } from "./ui/icons";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
                <Shield size={16} />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                MedSecure
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
              Modern digital health record platform with instant QR-based emergency access. Designed for patients, families, and first responders.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-slate-500 hover:text-slate-900 transition">
                  Medical Reports
                </Link>
              </li>
              <li>
                <Link href="/vitals" className="text-slate-500 hover:text-slate-900 transition">
                  Vitals Tracking
                </Link>
              </li>
              <li>
                <Link href="/qr" className="text-slate-500 hover:text-slate-900 transition">
                  Emergency QR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Account
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/signup" className="text-slate-500 hover:text-slate-900 transition">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-500 hover:text-slate-900 transition">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-slate-500 hover:text-slate-900 transition">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {year} MedSecure. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Encrypted Cloud Storage</span>
            <span>·</span>
            <span>Tokenized Public Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
