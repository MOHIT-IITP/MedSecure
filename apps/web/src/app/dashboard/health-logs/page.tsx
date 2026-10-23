'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  Plus,
  Stethoscope,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { HealthLogData, PaginatedResult } from '@medsecure/types';

export default function HealthLogsPage() {
  const [logs, setLogs] = useState<HealthLogData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'patient_note' | 'doctor_consultation'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [vitals, setVitals] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchLogs = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const data = await apiFetch<PaginatedResult<HealthLogData>>(
        `/patients/me/health-logs?page=${targetPage}&limit=10`
      );
      setLogs(data.items);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
    } catch (err: any) {
      console.error('Failed to load health logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      await apiFetch<HealthLogData>('/patients/me/health-logs', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          vitals: vitals.trim() || null,
        }),
      });

      setTitle('');
      setContent('');
      setVitals('');
      setIsModalOpen(false);
      setSuccessBanner('Health note added successfully.');
      fetchLogs(1);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setModalError(err.message);
      } else {
        setModalError('Failed to record health note.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.entryType === filter;
  });

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header & New Entry CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand/80">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Clinical History
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
            Health & Consultation Logs
          </h1>
          <p className="text-sm text-muted-brown mt-1">
            Chronological records of doctor visits, clinical findings, and personal health notes.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-sand" />
          <span>New Health Note</span>
        </button>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-forest/10 border border-forest/30 flex items-center justify-between gap-3 text-forest text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs text-muted-brown hover:text-dark-brown"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-forest text-ivory shadow-sm'
              : 'bg-white border border-sand text-dark-brown/70 hover:bg-sand/30'
          }`}
        >
          All Entries ({totalItems})
        </button>
        <button
          onClick={() => setFilter('doctor_consultation')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filter === 'doctor_consultation'
              ? 'bg-forest text-ivory shadow-sm'
              : 'bg-white border border-sand text-dark-brown/70 hover:bg-sand/30'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Doctor Consultations</span>
        </button>
        <button
          onClick={() => setFilter('patient_note')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filter === 'patient_note'
              ? 'bg-forest text-ivory shadow-sm'
              : 'bg-white border border-sand text-dark-brown/70 hover:bg-sand/30'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Patient Notes</span>
        </button>
      </div>

      {/* Logs Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
          <p className="text-sm font-medium text-muted-brown mt-3">Loading records...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-sand/80 text-center shadow-warm">
          <FileText className="w-10 h-10 text-muted-brown/40 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-normal text-forest">No Records Found</h3>
          <p className="text-xs text-muted-brown mt-1 max-w-sm mx-auto">
            {filter === 'all'
              ? 'You have not added any health notes or consultation summaries yet.'
              : `No entries matching the '${filter.replace('_', ' ')}' filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isDoctor = log.entryType === 'doctor_consultation';
            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm space-y-3 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand/50">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isDoctor
                          ? 'bg-forest/10 text-forest border border-forest/20'
                          : 'bg-sand/40 text-dark-brown border border-sand'
                      }`}
                    >
                      {isDoctor ? (
                        <>
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Doctor Consultation</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5" />
                          <span>Patient Note</span>
                        </>
                      )}
                    </span>
                    {log.authorName && (
                      <span className="text-xs text-muted-brown">
                        by <strong className="text-dark-brown">{log.authorName}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-brown">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-lg font-semibold text-forest">{log.title}</h2>
                  <p className="text-sm text-dark-brown/90 mt-1.5 leading-relaxed whitespace-pre-line">
                    {log.content}
                  </p>
                </div>

                {log.vitals && (
                  <div className="pt-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-terracotta" />
                    <span className="text-xs font-mono text-terracotta bg-cream/70 px-2.5 py-1 rounded-lg border border-sand/60">
                      {log.vitals}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-sand/80">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-dark-brown hover:bg-sand/30 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-muted-brown">
            Page <strong className="text-dark-brown">{page}</strong> of{' '}
            <strong className="text-dark-brown">{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-dark-brown hover:bg-sand/30 disabled:opacity-40 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal for Creating New Health Log */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sand space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl font-normal text-forest">Add Health Entry</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-muted-brown hover:text-dark-brown"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-terracotta/10 border border-terracotta/30 flex items-center gap-2 text-terracotta text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label htmlFor="logTitle" className="block text-xs font-semibold text-dark-brown mb-1.5">
                  Entry Title *
                </label>
                <input
                  id="logTitle"
                  type="text"
                  required
                  placeholder="e.g. Blood pressure spike after workout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
              </div>

              <div>
                <label htmlFor="logContent" className="block text-xs font-semibold text-dark-brown mb-1.5">
                  Detailed Notes / Symptoms / Observations *
                </label>
                <textarea
                  id="logContent"
                  required
                  rows={4}
                  placeholder="Describe your health symptoms, clinical observations, or relevant context..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="logVitals" className="block text-xs font-semibold text-dark-brown mb-1.5">
                  Measured Vitals (Optional)
                </label>
                <input
                  id="logVitals"
                  type="text"
                  placeholder="e.g. BP: 128/84 mmHg, HR: 72 bpm, SpO2: 98%"
                  value={vitals}
                  onChange={(e) => setVitals(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-sand/70">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-dark-brown hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Note</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
