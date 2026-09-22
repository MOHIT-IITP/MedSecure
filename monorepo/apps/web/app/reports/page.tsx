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
  Modal,
  Alert,
  EmptyState,
  TableRowSkeleton,
} from "../../components/ui";
import {
  FileText,
  Download,
  Trash2,
  Plus,
  UploadCloud,
  Eye,
  Shield,
  Search,
} from "../../components/ui/icons";

type Report = {
  id: string;
  title: string;
  fileType: string;
  uploadedAt: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload modal & state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function loadReports() {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please choose a file to upload.");
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
      setUploadStatus("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(id: string) {
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this medical report? This action cannot be undone.")) return;
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

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      title="Medical Reports"
      subtitle="Store, organize, and securely download your medical documents and diagnostic reports."
      actions={
        <Button
          variant="primary"
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Upload Report</span>
        </Button>
      }
    >
      {/* Search & Filter Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search reports by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield size={14} className="text-emerald-600" />
          <span>Encrypted storage in Supabase Vault</span>
        </div>
      </div>

      {/* Main Reports Table / List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              <TableRowSkeleton cols={5} />
              <TableRowSkeleton cols={5} />
              <TableRowSkeleton cols={5} />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8">
              {searchQuery ? (
                <EmptyState
                  title="No matching reports found"
                  description={`No medical reports matching "${searchQuery}".`}
                  actionLabel="Clear Search"
                  onAction={() => setSearchQuery("")}
                />
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No medical reports yet"
                  description="Upload your first report to keep your medical documents organized and accessible."
                  actionLabel="+ Upload Report"
                  onAction={() => setUploadModalOpen(true)}
                />
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 font-semibold">Document</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Uploaded</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredReports.map((report) => {
                    const isPdf = report.fileType?.toLowerCase().includes("pdf");
                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                                isPdf
                                  ? "bg-red-50 text-red-700 border-red-200/60"
                                  : "bg-blue-50 text-blue-700 border-blue-200/60"
                              }`}
                            >
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {report.title}
                              </p>
                              <p className="text-xs text-slate-400 font-normal">
                                {report.fileType || "application/octet-stream"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs">
                          <Badge variant={isPdf ? "error" : "info"} size="sm">
                            {isPdf ? "PDF" : "IMAGE"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {new Date(report.uploadedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(report.id)}
                              className="text-xs"
                            >
                              <Download size={14} className="mr-1" />
                              <span>Download</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Medical Report"
        description="Select or drag and drop your clinical PDF or medical image."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="upload-title">Report Title</Label>
            <Input
              id="upload-title"
              placeholder="e.g. Echocardiogram Report - Feb 2026"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="file-upload" required>
              Document File
            </Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
              className={`rounded-xl border border-dashed p-8 text-center transition ${
                dragOver
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-300 bg-slate-50/60 hover:bg-slate-50"
              }`}
            >
              <UploadCloud className="mx-auto text-slate-400 mb-2" size={36} />
              <input
                id="file-upload"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-xs font-semibold text-slate-900 underline hover:text-slate-700"
              >
                Browse files
              </label>
              <span className="text-xs text-slate-500"> or drop your file here</span>
              <p className="mt-1 text-[11px] text-slate-400">
                Supports PDF, JPG, PNG, WEBP (Max 10MB)
              </p>
              {file && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-100">
                  <FileText size={14} />
                  <span>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
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
    </AppShell>
  );
}
