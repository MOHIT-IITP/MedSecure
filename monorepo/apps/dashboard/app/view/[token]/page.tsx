"use client";

import { useEffect, useState } from "react";
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
      const res = await fetch(`/api/view/${token}`);
      const json = (await res.json()) as ViewPayload;
      setData(json);
      setLoading(false);
    }

    load();
  }, [token]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-slate-600">Loading health profile…</p>
      </main>
    );
  }

  if (!data?.success || !data.profile) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-xl font-semibold text-red-700">Unable to load profile</h1>
        <p className="mt-2 text-slate-600">
          {data?.message ?? "This QR link may be invalid or expired."}
        </p>
      </main>
    );
  }

  const { profile, healthRecords = [] } = data;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Emergency health view
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{profile.name}</h1>
        {profile.age != null && (
          <p className="mt-1 text-slate-600">Age: {profile.age}</p>
        )}
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoCard label="Blood group" value={profile.bloodGroup} highlight />
        <InfoCard label="Emergency contact" value={profile.emergencyContact} highlight />
        <InfoCard label="Allergies" value={profile.allergies} />
        <InfoCard label="Chronic conditions" value={profile.chronicDiseases} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent health logs</h2>
        {healthRecords.length === 0 ? (
          <p className="mt-2 text-slate-600">No daily records shared yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {healthRecords.map((record, index) => (
              <li
                key={`${record.createdAt}-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
              >
                <p className="text-xs text-slate-500">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-2">
                  <Metric label="BP" value={record.bloodPressure} />
                  <Metric label="Sugar" value={record.sugarLevel} />
                  <Metric label="Pulse" value={record.pulse} />
                  <Metric label="Weight" value={record.weight} />
                </dl>
                {record.notes && (
                  <p className="mt-2 text-slate-700">{record.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function InfoCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value?.trim() || "—"}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
