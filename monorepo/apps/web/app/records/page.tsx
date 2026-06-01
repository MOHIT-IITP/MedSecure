"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { Alert, Button, Card, Input, Label, Textarea } from "../../components/ui";

type HealthRecord = {
  id: string;
  bloodPressure: string | null;
  sugarLevel: string | null;
  weight: string | null;
  pulse: string | null;
  notes: string | null;
  createdAt: string;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [form, setForm] = useState({
    bloodPressure: "",
    sugarLevel: "",
    pulse: "",
    weight: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRecords() {
    const res = await fetch("/api/health");
    const data = await res.json();
    if (data.success && Array.isArray(data.records)) {
      setRecords(data.records);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok || !data.success) {
      setMessage("Could not save entry.");
      return;
    }

    setForm({
      bloodPressure: "",
      sugarLevel: "",
      pulse: "",
      weight: "",
      notes: "",
    });
    setMessage("Health log saved.");
    await loadRecords();
  }

  return (
    <AppShell title="Daily health logs">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-panel-strong border-white/10 bg-white/6 p-6 text-white shadow-none sm:p-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Add today&apos;s entry
          </h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-white/70">Blood pressure</Label>
                <Input
                  placeholder="120/80"
                  value={form.bloodPressure}
                  onChange={(e) =>
                    setForm({ ...form, bloodPressure: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
                />
              </div>
              <div>
                <Label className="text-white/70">Sugar level</Label>
                <Input
                  value={form.sugarLevel}
                  onChange={(e) =>
                    setForm({ ...form, sugarLevel: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
                />
              </div>
              <div>
                <Label className="text-white/70">Pulse</Label>
                <Input
                  value={form.pulse}
                  onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
                />
              </div>
              <div>
                <Label className="text-white/70">Weight</Label>
                <Input
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
                />
              </div>
            </div>
            <div>
              <Label className="text-white/70">Notes</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-teal-300/40 focus:ring-teal-400/20"
              />
            </div>
            {message && (
              <Alert
                tone={message.includes("saved") ? "success" : "error"}
                className={
                  message.includes("saved")
                    ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                    : "border border-rose-400/20 bg-rose-400/10 text-rose-100"
                }
              >
                {message}
              </Alert>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-300 hover:to-cyan-400"
            >
              {saving ? "Saving…" : "Save log"}
            </Button>
          </form>
        </Card>

        <Card className="glass-panel border-white/10 bg-white/6 p-6 text-white shadow-none sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent logs</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                The most recent entries are shown here in a translucent glass list.
              </p>
            </div>
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-100 ring-1 ring-cyan-300/20">
              Private
            </span>
          </div>
          {loading ? (
            <p className="text-sm text-white/70">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-white/60">No entries yet.</p>
          ) : (
            <ul className="mt-5 max-h-112 space-y-3 overflow-y-auto pr-1">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
                >
                  <p className="text-xs text-white/45">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-1">
                    {r.bloodPressure && (
                      <>
                        <dt className="text-white/45">BP</dt>
                        <dd className="text-white/90">{r.bloodPressure}</dd>
                      </>
                    )}
                    {r.sugarLevel && (
                      <>
                        <dt className="text-white/45">Sugar</dt>
                        <dd className="text-white/90">{r.sugarLevel}</dd>
                      </>
                    )}
                    {r.pulse && (
                      <>
                        <dt className="text-white/45">Pulse</dt>
                        <dd className="text-white/90">{r.pulse}</dd>
                      </>
                    )}
                    {r.weight && (
                      <>
                        <dt className="text-white/45">Weight</dt>
                        <dd className="text-white/90">{r.weight}</dd>
                      </>
                    )}
                  </dl>
                  {r.notes && (
                    <p className="mt-2 text-white/75">{r.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
