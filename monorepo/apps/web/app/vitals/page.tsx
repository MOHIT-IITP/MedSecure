"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Label,
  Textarea,
  Modal,
  Alert,
  EmptyState,
  StatCard,
} from "../../components/ui";
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  Plus,
  Clock,
  ChevronRight,
  Shield,
} from "../../components/ui/icons";

type HealthRecord = {
  id: string;
  bloodPressure: string | null;
  sugarLevel: string | null;
  weight: string | null;
  pulse: string | null;
  notes: string | null;
  createdAt: string;
};

export default function VitalsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    bloodPressure: "",
    sugarLevel: "",
    pulse: "",
    weight: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function loadRecords() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error("Failed to load health records", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage(data.message ?? "Could not save entry.");
        return;
      }

      setForm({
        bloodPressure: "",
        sugarLevel: "",
        pulse: "",
        weight: "",
        notes: "",
      });
      setModalOpen(false);
      await loadRecords();
    } catch {
      setStatusMessage("Network error saving entry.");
    } finally {
      setSaving(false);
    }
  }

  const latest = records[0] ?? null;

  // Extract trend data for minimal chart visualization
  const recentRecordsForChart = [...records].reverse().slice(-7);

  return (
    <AppShell
      title="Vitals & Health Tracking"
      subtitle="Track your blood pressure, heart rate, blood sugar, and body weight over time."
      actions={
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Record Vital</span>
        </Button>
      }
    >
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Blood Pressure"
          value={latest?.bloodPressure || "—"}
          unit="mmHg"
          subtitle={latest ? "Latest reading" : "No entries"}
          status={latest?.bloodPressure ? "success" : "neutral"}
          statusLabel={latest?.bloodPressure ? "Normal" : undefined}
          icon={Activity}
        />
        <StatCard
          title="Heart Rate"
          value={latest?.pulse || "—"}
          unit="BPM"
          subtitle={latest ? "Resting pulse" : "No entries"}
          status={latest?.pulse ? "success" : "neutral"}
          statusLabel={latest?.pulse ? "Optimal" : undefined}
          icon={Heart}
        />
        <StatCard
          title="Blood Sugar"
          value={latest?.sugarLevel || "—"}
          unit="mg/dL"
          subtitle={latest ? "Glucose level" : "No entries"}
          status="neutral"
          icon={Droplet}
        />
        <StatCard
          title="Weight"
          value={latest?.weight || "—"}
          unit="kg"
          subtitle={latest ? "Body weight" : "No entries"}
          status="neutral"
          icon={Weight}
        />
      </div>

      {/* Minimal Sparkline / Trend Visualizer */}
      {records.length >= 2 && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>
                  Recent physiological progression across logs
                </CardDescription>
              </div>
              <Badge variant="neutral" size="sm">
                Last {recentRecordsForChart.length} readings
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Blood Pressure progression */}
              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Systolic BP Trend
                  </span>
                  <Activity size={14} className="text-slate-400" />
                </div>
                <div className="h-20 flex items-end gap-2 pt-4">
                  {recentRecordsForChart.map((r, i) => {
                    const bpNum = parseInt(r.bloodPressure?.split("/")[0] ?? "120", 10);
                    const heightPercent = Math.min(Math.max(((bpNum - 80) / 80) * 100, 20), 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-slate-900 rounded-t-sm transition-all hover:bg-blue-600"
                          title={`${r.bloodPressure || "120/80"} on ${new Date(r.createdAt).toLocaleDateString()}`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { weekday: "narrow" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pulse progression */}
              <div className="rounded-lg bg-slate-50/70 border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Heart Rate (Pulse)
                  </span>
                  <Heart size={14} className="text-red-500" />
                </div>
                <div className="h-20 flex items-end gap-2 pt-4">
                  {recentRecordsForChart.map((r, i) => {
                    const pulseNum = parseInt(r.pulse ?? "72", 10);
                    const heightPercent = Math.min(Math.max(((pulseNum - 40) / 80) * 100, 20), 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-red-500/80 rounded-t-sm transition-all hover:bg-red-600"
                          title={`${r.pulse || "72"} BPM on ${new Date(r.createdAt).toLocaleDateString()}`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { weekday: "narrow" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historical Logs</CardTitle>
              <CardDescription>
                Chronological record of all submitted vitals
              </CardDescription>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {records.length} {records.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : records.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Activity}
                title="No vitals recorded yet"
                description="Keep a daily record of your health vitals. All measurements stay securely encrypted."
                actionLabel="+ Record Today's Vital"
                onAction={() => setModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Blood Pressure</th>
                    <th className="py-3 px-4">Pulse</th>
                    <th className="py-3 px-4">Blood Sugar</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {records.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock size={13} className="text-slate-400" />
                          <span>
                            {new Date(rec.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {rec.bloodPressure ? (
                          <span className="font-semibold text-slate-900">
                            {rec.bloodPressure}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {rec.pulse ? (
                          <span className="font-medium text-slate-800">
                            {rec.pulse} bpm
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {rec.sugarLevel ? (
                          <span className="font-medium text-slate-800">
                            {rec.sugarLevel} mg/dL
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {rec.weight ? (
                          <span className="font-medium text-slate-800">
                            {rec.weight} kg
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {rec.notes || <span className="text-slate-300">No notes</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Vital Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New Vital"
        description="Log your daily health metrics to maintain an up-to-date timeline."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="v-bp">Blood Pressure (mmHg)</Label>
              <Input
                id="v-bp"
                placeholder="e.g. 120/80"
                value={form.bloodPressure}
                onChange={(e) =>
                  setForm({ ...form, bloodPressure: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="v-pulse">Heart Rate (BPM)</Label>
              <Input
                id="v-pulse"
                placeholder="e.g. 72"
                value={form.pulse}
                onChange={(e) => setForm({ ...form, pulse: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="v-sugar">Blood Sugar (mg/dL)</Label>
              <Input
                id="v-sugar"
                placeholder="e.g. 95"
                value={form.sugarLevel}
                onChange={(e) => setForm({ ...form, sugarLevel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="v-weight">Weight (kg)</Label>
              <Input
                id="v-weight"
                placeholder="e.g. 68.5"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="v-notes">Notes or Observation</Label>
            <Textarea
              id="v-notes"
              rows={3}
              placeholder="e.g. Measured after morning workout. Feeling well."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {statusMessage && <Alert tone="error">{statusMessage}</Alert>}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              Save Vital
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
