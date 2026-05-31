"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { Alert, Button, Card } from "../../components/ui";

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
        <p className="text-slate-600">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Hello, ${user?.name ?? "there"}`}>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link href="/profile" className="block">
          <Card className="transition hover:border-teal-200 hover:shadow-md">
            <p className="text-sm text-slate-500">Emergency profile</p>
            <p className="mt-1 font-medium">Update blood type & contacts</p>
          </Card>
        </Link>
        <Link href="/records" className="block">
          <Card className="transition hover:border-teal-200 hover:shadow-md">
            <p className="text-sm text-slate-500">Daily tracking</p>
            <p className="mt-1 font-medium">Log BP, sugar, pulse, weight</p>
          </Card>
        </Link>
        <Link href="/qr" className="block">
          <Card className="transition hover:border-teal-200 hover:shadow-md">
            <p className="text-sm text-slate-500">QR sharing</p>
            <p className="mt-1 font-medium">View & print your QR code</p>
          </Card>
        </Link>
      </div>

      <Card>
        <h2 className="mb-4 font-medium text-slate-900">Medical reports</h2>
        <form onSubmit={uploadReport} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. Blood test — Jan 2026"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              File (PDF or image)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="submit">Upload</Button>
        </form>

        {status && (
          <Alert tone={status.includes("uploaded") ? "success" : "error"}>
            {status}
          </Alert>
        )}

        {reports.length === 0 ? (
          <p className="text-sm text-slate-600">No reports uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">
                    {r.fileType} · {new Date(r.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => downloadReport(r.id)}>
                    Download
                  </Button>
                  <Button variant="danger" onClick={() => deleteReport(r.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
