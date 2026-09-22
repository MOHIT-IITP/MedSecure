import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-4 shadow-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          MedSecure Emergency Portal
        </h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Scan a patient&apos;s tokenized MedSecure QR code with any smartphone camera to open their emergency health snapshot.
        </p>
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Token-based emergency response network
          </p>
        </div>
      </div>
    </main>
  );
}
