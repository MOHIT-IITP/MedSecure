"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { Button, Card } from "../../components/ui";

type User = { name: string; email: string };
type Report = {
  id: string;
  title: string;
  fileType: string;
  uploadedAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [meRes, reportsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/reports"),
      ]);

      const me = await meRes.json();
      const reps = await reportsRes.json();

      if (me.success) setUser(me.user);
      if (reps.success) setReports(reps.reports ?? []);
      setLoading(false);
    }

    load();
  }, []);

  async function uploadReport(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus("Choose a PDF or image file.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("title", uploadTitle || file.name);

    setStatus("Uploading…");
    const res = await fetch("/api/reports/upload", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setStatus(data.error ?? data.message ?? "Upload failed.");
      return;
    }

    setReports((prev) => [data.report, ...prev]);
    setFile(null);
    setUploadTitle("");
    setStatus("Report uploaded.");
  }

  async function downloadReport(id: string) {
    const res = await fetch(`/api/reports/${id}`);
    const data = await res.json();
    if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
  }

  async function deleteReport(id: string) {
    if (!confirm("Delete this report?")) return;
    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  }

  if (loading) {
    return (
      <AppShell title="Dashboard">
        <p className="text-white/70">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Hello, ${user?.name ?? "there"}`}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel-strong rounded-3xl p-6 sm:p-8 backdrop-blur-2xl">
          <p className="inline-flex rounded-full bg-teal-400/15 px-4 backdrop-blur-sm py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-100 ring-1 ring-teal-300/20">
            Private health workspace
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Keep your profile, daily records, QR access, and medical reports in one
            calm, secure place. The dashboard now follows the same dark mesh and
            glass palette as the landing page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link href="/profile" className="block">
              <Card className="h-full border-white/10 bg-white/6 p-5 text-white transition hover:border-teal-300/30 hover:bg-white/10">
                <p className="text-sm text-white/55">Emergency profile</p>
                <p className="mt-2 text-base font-medium text-white/95">
                  Update blood type & contacts
                </p>
              </Card>
            </Link>
            <Link href="/records" className="block">
              <Card className="h-full border-white/10 bg-white/6 p-5 text-white transition hover:border-teal-300/30 hover:bg-white/10">
                <p className="text-sm text-white/55">Daily tracking</p>
                <p className="mt-2 text-base font-medium text-white/95">
                  Log BP, sugar, pulse, weight
                </p>
              </Card>
            </Link>
            <Link href="/qr" className="block">
              <Card className="h-full border-white/10 bg-white/6 p-5 text-white transition hover:border-teal-300/30 hover:bg-white/10">
                <p className="text-sm text-white/55">QR sharing</p>
                <p className="mt-2 text-base font-medium text-white/95">
                  View & print your QR code
                </p>
              </Card>
            </Link>
          </div>
        </section>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className=" backdrop-blur-2xl glass-panel border-white/10 bg-white/6 p-5 text-white shadow-none">
            <p className="text-sm text-white/55">Reports uploaded</p>
            <p className="mt-2 text-3xl font-semibold text-white">{reports.length}</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              PDFs and images stay linked to your account and are available from
              any device.
            </p>
          </Card>
          <Card className=" backdrop-blur-2xl glass-panel border-white/10 bg-white/6 p-5 text-white shadow-none">
            <p className="text-sm text-white/55">Next update</p>
            <p className="mt-2 text-lg font-medium text-white/95">Profile, records, QR</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Keep the essentials current so emergency responders see the right
              information first.
            </p>
          </Card>
        </aside>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className=" backdrop-blur-2xl glass-panel border-white/10 bg-white/6 p-6 text-white shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Medical reports</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Upload PDFs or images, then revisit them from the same secure
                dashboard.
              </p>
            </div>
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-100 ring-1 ring-cyan-300/20">
              Encrypted storage
            </span>
          </div>

          <form onSubmit={uploadReport} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-white/70">
                Title
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-teal-300/40 focus:ring-2 focus:ring-teal-400/20"
                placeholder="e.g. Blood test — Jan 2026"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-white/70">
                File (PDF or image)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                className="w-full rounded-2xl border border-dashed border-white/15 bg-white/4 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/15"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-300 hover:to-cyan-400"
              >
                Upload report
              </Button>
              <p className="text-sm text-white/50">
                Accepted: PDF, JPG, PNG, WEBP
              </p>
            </div>
          </form>

          {status && (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                status.includes("uploaded")
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-100"
              }`}
            >
              {status}
            </div>
          )}

          <div className="mt-6">
            {reports.length === 0 ? (
              <p className="text-sm text-white/55">No reports uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {reports.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">{r.title}</p>
                      <p className="text-xs text-white/50">
                        {r.fileType} · {new Date(r.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => downloadReport(r.id)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
                      >
                        Download
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteReport(r.id)}
                        className="rounded-xl bg-rose-500/90 px-4 py-2 text-white hover:bg-rose-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className=" backdrop-blur-2xl   glass-panel border-white/10 bg-white/6 p-6 text-white shadow-none">
          <h2 className="text-xl font-semibold text-white">Dashboard grid</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            The dashboard now uses the same mesh background, translucent panels,
            and teal-to-cyan accents as the landing page.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-100/80">
                Focus
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Keep the emergency profile accurate, then upload recent reports so
                all critical information stays in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/80">
                Sharing
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Your QR code gives read-only access to the public emergency view
                without exposing the private reports section.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2 xl:col-span-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-100/80">
                Quick status
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  { label: "Profile", value: user ? "Connected" : "Missing" },
                  { label: "Reports", value: `${reports.length} saved` },
                  { label: "Access", value: "QR enabled" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/90">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
