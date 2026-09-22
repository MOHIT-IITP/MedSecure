"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/app-shell";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Label,
  Textarea,
  Modal,
  Alert,
  StatCard,
  StatCardSkeleton,
  EmptyState,
} from "../../components/ui";
import {
  Activity,
  Heart,
  Droplet,
  Weight,
  FileText,
  Download,
  Trash2,
  Plus,
  QrCode,
  Shield,
  Phone,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  Eye,
} from "../../components/ui/icons";

type User = {
  name: string;
  email: string;
  age?: number | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  chronicDiseases?: string | null;
  emergencyContact?: string | null;
};

type Report = {
  id: string;
  title: string;
  fileType: string;
  uploadedAt: string;
};

type HealthRecord = {
  id: string;
  bloodPressure: string | null;
  sugarLevel: string | null;
  weight: string | null;
  pulse: string | null;
  notes: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Record Vital modal state
  const [vitalModalOpen, setVitalModalOpen] = useState(false);
  const [vitalForm, setVitalForm] = useState({
    bloodPressure: "",
    sugarLevel: "",
    pulse: "",
    weight: "",
    notes: "",
  });
  const [vitalSaving, setVitalSaving] = useState(false);
  const [vitalStatus, setVitalStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, profileRes, reportsRes, healthRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/profile"),
          fetch("/api/reports"),
          fetch("/api/health"),
        ]);

        const me = await meRes.json();
        const prof = await profileRes.json();
        const reps = await reportsRes.json();
        const health = await healthRes.json();

        if (prof.success && prof.user) {
          setUser(prof.user);
        } else if (me.success && me.user) {
          setUser(me.user);
        }

        if (reps.success && Array.isArray(reps.reports)) {
          setReports(reps.reports);
        }

        if (health.success && Array.isArray(health.records)) {
          setRecords(health.records);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const latestRecord = records[0] ?? null;

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", uploadTitle.trim() || file.name);

      const res = await fetch("/api/reports/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadStatus(data.error ?? data.message ?? "Upload failed.");
        return;
      }

      setReports((prev) => [data.report, ...prev]);
      setFile(null);
      setUploadTitle("");
      setUploadModalOpen(false);
    } catch {
      setUploadStatus("Network error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownloadReport(id: string) {
    try {
      const res = await fetch(`/api/reports/${id}`);
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to download report", err);
    }
  }

  async function handleDeleteReport(id: string) {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  }

  async function handleSaveVital(e: React.FormEvent) {
    e.preventDefault();
    setVitalSaving(true);
    setVitalStatus(null);

    try {
      const res = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitalForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setVitalStatus(data.message ?? "Failed to save vitals.");
        return;
      }

      if (data.record) {
        setRecords((prev) => [data.record, ...prev]);
      }
      setVitalForm({
        bloodPressure: "",
        sugarLevel: "",
        pulse: "",
        weight: "",
        notes: "",
      });
      setVitalModalOpen(false);
    } catch {
      setVitalStatus("Network error saving entry.");
    } finally {
      setVitalSaving(false);
    }
  }

  return (
    <AppShell
      title={`${getGreeting()}, ${user?.name ? user.name.split(" ")[0] : "there"}`}
      subtitle="Here's your health overview and recent activity."
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVitalModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Record Vital</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Upload Report</span>
          </Button>
        </div>
      }
    >
      {/* Vitals Summary Metric Grid */}
      <section className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Blood Pressure"
                value={latestRecord?.bloodPressure || "120/80"}
                unit="mmHg"
                subtitle={latestRecord ? "Latest entry" : "Normal reference"}
                status="success"
                statusLabel="Normal"
                icon={Activity}
              />
              <StatCard
                title="Heart Rate"
                value={latestRecord?.pulse || "72"}
                unit="BPM"
                subtitle={latestRecord ? "Resting heart rate" : "Typical resting"}
                status="success"
                statusLabel="Optimal"
                icon={Heart}
              />
              <StatCard
                title="Blood Sugar"
                value={latestRecord?.sugarLevel || "95"}
                unit="mg/dL"
                subtitle="Fasting glucose"
                status="neutral"
                statusLabel="In range"
                icon={Droplet}
              />
              <StatCard
                title="Weight"
                value={latestRecord?.weight || "68.0"}
                unit="kg"
                subtitle="Body mass"
                status="neutral"
                statusLabel="Stable"
                icon={Weight}
              />
            </>
          )}
        </div>
      </section>

      {/* Main Grid: Reports & Vitals vs Emergency Profile */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Reports & Vitals Activity */}
        <div className="space-y-8 lg:col-span-2">
          {/* Medical Reports Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  Encrypted medical documents and lab results
                </CardDescription>
              </div>
              <Link
                href="/reports"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                View all ({reports.length})
                <ChevronRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              ) : reports.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={FileText}
                    title="No medical reports uploaded"
                    description="Upload your lab results, imaging scans, and prescriptions for secure access anywhere."
                    actionLabel="+ Upload First Report"
                    onAction={() => setUploadModalOpen(true)}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-hidden">
                  {reports.slice(0, 4).map((report) => {
                    const isPdf = report.fileType.toLowerCase().includes("pdf");
                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                              isPdf
                                ? "bg-red-50 text-red-700 border-red-200/60"
                                : "bg-blue-50 text-blue-700 border-blue-200/60"
                            }`}
                          >
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {report.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {isPdf ? "PDF Document" : "Medical Image"} ·{" "}
                              {new Date(report.uploadedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                            title="Download / View"
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Download size={15} />
                            <span className="hidden sm:inline text-xs">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            title="Delete"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Vitals Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Vitals Logs</CardTitle>
                <CardDescription>
                  Timeline of daily measurements and observations
                </CardDescription>
              </div>
              <Link
                href="/vitals"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                Track vitals
                <ChevronRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              ) : records.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={Activity}
                    title="No vitals recorded yet"
                    description="Keep track of your blood pressure, sugar levels, and pulse over time."
                    actionLabel="+ Record Today's Vital"
                    onAction={() => setVitalModalOpen(true)}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {records.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="p-4 hover:bg-slate-50/70 transition">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700">
                          {new Date(rec.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <Badge variant="neutral" size="sm">
                          Recorded
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        {rec.bloodPressure && (
                          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5">
                            <span className="text-[11px] font-medium text-slate-500 block">
                              BP
                            </span>
                            <span className="font-semibold text-slate-900">
                              {rec.bloodPressure}
                            </span>
                          </div>
                        )}
                        {rec.pulse && (
                          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5">
                            <span className="text-[11px] font-medium text-slate-500 block">
                              Pulse
                            </span>
                            <span className="font-semibold text-slate-900">
                              {rec.pulse} bpm
                            </span>
                          </div>
                        )}
                        {rec.sugarLevel && (
                          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5">
                            <span className="text-[11px] font-medium text-slate-500 block">
                              Sugar
                            </span>
                            <span className="font-semibold text-slate-900">
                              {rec.sugarLevel} mg/dL
                            </span>
                          </div>
                        )}
                        {rec.weight && (
                          <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5">
                            <span className="text-[11px] font-medium text-slate-500 block">
                              Weight
                            </span>
                            <span className="font-semibold text-slate-900">
                              {rec.weight} kg
                            </span>
                          </div>
                        )}
                      </div>
                      {rec.notes && (
                        <p className="mt-2.5 text-xs text-slate-600 bg-slate-50/50 p-2 rounded-md border border-slate-100 italic">
                          &ldquo;{rec.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Emergency Profile Snapshot & QR Sharing */}
        <div className="space-y-6">
          {/* Emergency Profile Card */}
          <Card className="border-red-100/80 bg-linear-to-b from-white to-red-50/20">
            <CardHeader className="pb-3 border-b border-red-100/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <CardTitle className="text-red-950">Emergency Profile</CardTitle>
                </div>
                <Link
                  href="/profile"
                  className="text-xs font-semibold text-red-700 hover:text-red-800"
                >
                  Edit
                </Link>
              </div>
              <CardDescription>
                Public snapshot shared during medical emergencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Blood Group
                </span>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {user?.bloodGroup?.trim() || "Not set (e.g. O+)"}
                </p>
              </div>

              <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Allergies
                </span>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {user?.allergies?.trim() || "None reported"}
                </p>
              </div>

              <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Chronic Conditions
                </span>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {user?.chronicDiseases?.trim() || "None recorded"}
                </p>
              </div>

              <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Emergency Contact
                  </span>
                  <Phone size={13} className="text-slate-400" />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.emergencyContact?.trim() || "Not configured"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-red-50/50 border-t border-red-100/60 flex items-center justify-between">
              <span className="text-xs text-slate-600">Always keep this updated</span>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="text-xs bg-white">
                  Update Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* QR Emergency Access Callout */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
                  <QrCode size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Emergency QR Access
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Responders scan this code to view critical emergency data
                    without needing a login.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <Shield size={14} />
                  <span>Tokenized link active</span>
                </div>
                <Link href="/qr">
                  <Button variant="outline" size="sm" className="text-xs">
                    View QR Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Report Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Medical Report"
        description="Encrypted storage for PDFs and imaging results."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="report-title">Report Title</Label>
            <Input
              id="report-title"
              placeholder="e.g. Comprehensive Blood Test — Q1 2026"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="report-file" required>
              Select File (PDF or Image)
            </Label>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center hover:bg-slate-50 transition">
              <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
              <input
                id="report-file"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <label
                htmlFor="report-file"
                className="cursor-pointer text-xs font-semibold text-slate-900 underline hover:text-slate-700"
              >
                Choose a file
              </label>
              <span className="text-xs text-slate-500"> or drag and drop here</span>
              {file && (
                <p className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50 py-1 px-2 rounded inline-block">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {uploadStatus && (
            <Alert tone={uploadStatus.includes("failed") ? "error" : "warning"}>
              {uploadStatus}
            </Alert>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={uploading}>
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Vital Modal */}
      <Modal
        isOpen={vitalModalOpen}
        onClose={() => setVitalModalOpen(false)}
        title="Record Today's Vital"
        description="Log your physiological metrics for health tracking."
      >
        <form onSubmit={handleSaveVital} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="bp">Blood Pressure</Label>
              <Input
                id="bp"
                placeholder="120/80"
                value={vitalForm.bloodPressure}
                onChange={(e) =>
                  setVitalForm({ ...vitalForm, bloodPressure: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="pulse">Heart Rate (Pulse)</Label>
              <Input
                id="pulse"
                placeholder="72"
                value={vitalForm.pulse}
                onChange={(e) =>
                  setVitalForm({ ...vitalForm, pulse: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="sugar">Blood Sugar (mg/dL)</Label>
              <Input
                id="sugar"
                placeholder="95"
                value={vitalForm.sugarLevel}
                onChange={(e) =>
                  setVitalForm({ ...vitalForm, sugarLevel: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                placeholder="68.5"
                value={vitalForm.weight}
                onChange={(e) =>
                  setVitalForm({ ...vitalForm, weight: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vital-notes">Notes or Symptoms</Label>
            <Textarea
              id="vital-notes"
              rows={2}
              placeholder="e.g. Taken 30 mins after morning walk, rested."
              value={vitalForm.notes}
              onChange={(e) =>
                setVitalForm({ ...vitalForm, notes: e.target.value })
              }
            />
          </div>

          {vitalStatus && <Alert tone="error">{vitalStatus}</Alert>}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setVitalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={vitalSaving}>
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
