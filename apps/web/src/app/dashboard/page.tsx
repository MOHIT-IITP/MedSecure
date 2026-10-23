'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  AlertCircle,
  Phone,
  QrCode,
  FileText,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import {
  PatientProfileData,
  MedicalDetailsData,
  HealthLogData,
  PaginatedResult,
} from '@medsecure/types';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PatientProfileData | null>(null);
  const [medical, setMedical] = useState<MedicalDetailsData | null>(null);
  const [logs, setLogs] = useState<HealthLogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, medicalData, logsData] = await Promise.all([
          apiFetch<PatientProfileData>('/patients/me').catch(() => null),
          apiFetch<MedicalDetailsData>('/medical-details/me').catch(() => null),
          apiFetch<PaginatedResult<HealthLogData>>('/patients/me/health-logs?page=1&limit=3').catch(
            () => ({ items: [] } as any)
          ),
        ]);

        setProfile(profileData);
        setMedical(medicalData);
        setLogs(logsData?.items || []);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute profile completion percentage
  const fields = [
    profile?.dateOfBirth,
    profile?.gender,
    profile?.address,
    profile?.emergencyContactName,
    profile?.emergencyContactPhone,
    medical?.bloodGroup,
    medical?.allergies,
    medical?.medications,
  ];
  const filledCount = fields.filter(Boolean).length;
  const completionPercentage = Math.round((filledCount / fields.length) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
        <p className="text-sm font-medium text-muted-brown mt-3">Loading dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand/80">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Patient Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-brown mt-1">
            Here is your health overview, emergency status, and recent consultation records.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-sand self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-forest" />
          <span className="text-xs font-semibold text-forest">Account Verified</span>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="p-5 rounded-2xl bg-white border border-sand/80 shadow-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-dark-brown">Profile Completion</span>
            <span className="text-xs font-bold text-forest">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        {completionPercentage < 100 && (
          <Link
            href="/dashboard/profile"
            className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1 self-end sm:self-auto"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Vital Medical Summary Cards */}
      <div>
        <h2 className="font-serif text-2xl font-normal text-forest mb-4">Vital Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Blood Group */}
          <div className="bg-white p-5 rounded-2xl border border-sand/80 shadow-warm">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-brown">Blood Group</span>
            <p className="text-xl font-bold text-forest mt-0.5">
              {medical?.bloodGroup || 'Not specified'}
            </p>
          </div>

          {/* Allergies */}
          <div className="bg-white p-5 rounded-2xl border border-sand/80 shadow-warm">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-brown">Allergies</span>
            <p className="text-sm font-semibold text-dark-brown mt-1 truncate">
              {medical?.allergies || 'None documented'}
            </p>
          </div>

          {/* Medications */}
          <div className="bg-white p-5 rounded-2xl border border-sand/80 shadow-warm">
            <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-brown">Active Medications</span>
            <p className="text-sm font-semibold text-dark-brown mt-1 truncate">
              {medical?.medications || 'None recorded'}
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white p-5 rounded-2xl border border-sand/80 shadow-warm">
            <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-brown">Emergency Contact</span>
            <p className="text-sm font-semibold text-dark-brown mt-1 truncate">
              {profile?.emergencyContactName || 'None assigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Health Logs & QR Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Consultations & Notes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-normal text-forest">Recent Health Logs</h2>
            <Link
              href="/dashboard/health-logs"
              className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-sand/80 text-center shadow-warm">
              <FileText className="w-8 h-8 text-muted-brown/60 mx-auto mb-2" />
              <p className="text-sm font-medium text-dark-brown">No health logs found</p>
              <p className="text-xs text-muted-brown mt-1">
                Record vital observations or consultation notes to track your progress.
              </p>
              <Link
                href="/dashboard/health-logs"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-ivory text-xs font-semibold hover:bg-forest-light"
              >
                <span>Add First Entry</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 rounded-2xl bg-white border border-sand/80 shadow-warm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-forest capitalize">
                      {log.entryType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-muted-brown flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-dark-brown">{log.title}</h3>
                  <p className="text-xs text-muted-brown line-clamp-2 leading-relaxed">
                    {log.content}
                  </p>
                  {log.vitals && (
                    <span className="text-[11px] font-mono text-terracotta bg-cream/60 px-2 py-0.5 rounded self-start mt-1">
                      {log.vitals}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Emergency QR Code Card */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif text-2xl font-normal text-forest">Emergency QR Access</h2>
          <div className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-cream border border-sand flex items-center justify-center text-forest mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-normal text-forest">
              Your Emergency Code
            </h3>
            <p className="text-xs text-muted-brown mt-1.5 leading-relaxed max-w-xs">
              Generate a temporary, scannable QR badge for first responders or medical intake.
            </p>

            <Link
              href="/dashboard/qr"
              className="mt-6 w-full py-3 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <span>Manage QR Code</span>
              <ArrowRight className="w-4 h-4 text-sand" />
            </Link>

            <div className="mt-5 pt-4 border-t border-sand/60 w-full flex items-center justify-center gap-2 text-[11px] text-muted-brown">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
              <span>Full revocation controls enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
