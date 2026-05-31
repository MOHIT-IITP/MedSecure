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
        <Card>
          <h2 className="mb-4 font-medium text-slate-900">Add today&apos;s entry</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Blood pressure</Label>
                <Input
                  placeholder="120/80"
                  value={form.bloodPressure}
                  onChange={(e) =>
                    setForm({ ...form, bloodPressure: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Sugar level</Label>
                <Input
                  value={form.sugarLevel}
                  onChange={(e) =>
                    setForm({ ...form, sugarLevel: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Pulse</Label>
                <Input
                  value={form.pulse}
                  onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                />
              </div>
              <div>
                <Label>Weight</Label>
                <Input
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            {message && (
              <Alert tone={message.includes("saved") ? "success" : "error"}>
                {message}
              </Alert>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save log"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 font-medium text-slate-900">Recent logs</h2>
          {loading ? (
            <p className="text-sm text-slate-600">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-slate-600">No entries yet.</p>
          ) : (
            <ul className="max-h-[28rem] space-y-3 overflow-y-auto">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                >
                  <p className="text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-1">
                    {r.bloodPressure && (
                      <>
                        <dt className="text-slate-500">BP</dt>
                        <dd>{r.bloodPressure}</dd>
                      </>
                    )}
                    {r.sugarLevel && (
                      <>
                        <dt className="text-slate-500">Sugar</dt>
                        <dd>{r.sugarLevel}</dd>
                      </>
                    )}
                    {r.pulse && (
                      <>
                        <dt className="text-slate-500">Pulse</dt>
                        <dd>{r.pulse}</dd>
                      </>
                    )}
                    {r.weight && (
                      <>
                        <dt className="text-slate-500">Weight</dt>
                        <dd>{r.weight}</dd>
                      </>
                    )}
                  </dl>
                  {r.notes && (
                    <p className="mt-2 text-slate-700">{r.notes}</p>
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
