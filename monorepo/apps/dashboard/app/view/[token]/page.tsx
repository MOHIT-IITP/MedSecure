"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PublicProfile = {
  name: string;
  age: number | null;
  bloodGroup: string | null;
  allergies: string | null;
  chronicDiseases: string | null;
  emergencyContact: string | null;
};

type HealthRecord = {
  bloodPressure: string | null;
  sugarLevel: string | null;
  weight: string | null;
  pulse: string | null;
  notes: string | null;
  createdAt: string;
};

type ViewPayload = {
  success: boolean;
  profile?: PublicProfile;
  healthRecords?: HealthRecord[];
  message?: string;
};

export default function PublicViewPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [data, setData] = useState<ViewPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/view/${token}`);
        const json = (await res.json()) as ViewPayload;
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  // Extract phone number digits for tel: link if available
  const extractPhone = (contactStr?: string | null) => {
    if (!contactStr) return null;
    const match = contactStr.match(/(\+?\d[\d\s\-().]{6,}\d)/);
    return match ? match[0].replace(/[^\d+]/g, "") : null;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-slate-900">Loading emergency profile...</p>
          <p className="text-xs text-slate-500 mt-1">Decrypting tokenized health snapshot</p>
        </div>
      </main>
    );
  }

  if (!data?.success || !data.profile) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-3 border border-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-900">Emergency Access Unavailable</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {data?.message ?? "This emergency QR link may be invalid, expired, or deactivated."}
          </p>
        </div>
      </main>
    );
  }

  const { profile, healthRecords = [] } = data;
  const phoneNumber = extractPhone(profile.emergencyContact);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Emergency Identification Bar */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              +
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-white">
              MedSecure Emergency View
            </span>
          </div>
          <span className="text-[11px] font-medium bg-white/10 px-2 py-0.5 rounded text-slate-200">
            Read-Only
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-6 space-y-4">
        {/* Patient Identity Banner */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Patient Emergency Record
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {profile.name}
              </h1>
              {profile.age != null && (
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Age: <span className="text-slate-900 font-semibold">{profile.age} years</span>
                </p>
              )}
            </div>

            {/* Prominent Blood Group Badge */}
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-center shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                Blood Group
              </span>
              <span className="text-2xl font-black text-red-700 leading-none mt-1 block">
                {profile.bloodGroup?.trim() || "N/A"}
              </span>
            </div>
          </div>
        </section>

        {/* Emergency Contact Quick Action */}
        {profile.emergencyContact && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Emergency Contact
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                  {profile.emergencyContact}
                </p>
              </div>

              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 active:bg-emerald-900 transition shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call Now</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Clinical Alerts: Allergies & Chronic Conditions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-700 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Allergies
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {profile.allergies?.trim() || "None reported"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-700 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Chronic Conditions
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {profile.chronicDiseases?.trim() || "None reported"}
            </p>
          </div>
        </section>

        {/* Recent Health Logs */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Vital History</h2>
            <span className="text-[11px] text-slate-400 font-medium">Last 10 Logs</span>
          </div>

          {healthRecords.length === 0 ? (
            <p className="mt-4 text-xs text-slate-500 text-center py-4">
              No recent vitals shared.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {healthRecords.map((record, index) => (
                <div key={index} className="py-3 text-xs first:pt-1 last:pb-0">
                  <div className="flex items-center justify-between text-slate-500 mb-1.5">
                    <span className="font-semibold text-slate-700">
                      {new Date(record.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium">
                    {record.bloodPressure && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase">BP</span>
                        <span className="font-bold text-slate-900">{record.bloodPressure}</span>
                      </div>
                    )}
                    {record.pulse && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase">Pulse</span>
                        <span className="font-bold text-slate-900">{record.pulse} bpm</span>
                      </div>
                    )}
                    {record.sugarLevel && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase">Sugar</span>
                        <span className="font-bold text-slate-900">{record.sugarLevel} mg/dL</span>
                      </div>
                    )}
                    {record.weight && (
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase">Weight</span>
                        <span className="font-bold text-slate-900">{record.weight} kg</span>
                      </div>
                    )}
                  </div>

                  {record.notes && (
                    <p className="mt-1.5 text-slate-600 bg-slate-50/60 p-2 rounded text-[11px] italic">
                      &ldquo;{record.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Security & Access Notice Footer */}
        <footer className="pt-4 text-center text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-600">
            Powered by MedSecure · Secure tokenized access
          </p>
          <p className="text-[11px]">
            This record is generated dynamically for emergency response. Diagnostic documents remain protected in private encrypted storage.
          </p>
        </footer>
      </div>
    </main>
  );
}
