'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Heart,
  AlertTriangle,
  Phone,
  FileSpreadsheet,
  Award,
  Activity,
  ShieldAlert,
  Loader2,
  XCircle,
} from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { QrPublicEmergencyView } from '@medsecure/types';

export default function PublicEmergencyProfilePage() {
  const params = useParams();
  const token = params?.token as string;

  const [record, setRecord] = useState<QrPublicEmergencyView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmergencyData() {
      if (!token) return;

      try {
        const data = await apiFetch<QrPublicEmergencyView>(`/public/patients/${token}`);
        setRecord(data);
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to reach medical record server. Please check your network.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadEmergencyData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
          <p className="text-sm font-semibold text-dark-brown">
            Retrieving Emergency Medical Data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-sand p-8 shadow-warm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta/10 border border-terracotta/30 flex items-center justify-center text-terracotta mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-normal text-forest">Access Revoked or Invalid</h1>
          <p className="text-xs text-muted-brown leading-relaxed">
            {error || 'This emergency QR access link is expired, invalid, or has been revoked by the patient.'}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-ivory text-xs font-semibold hover:bg-forest-light transition-colors"
            >
              <span>Go to MedSecure Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Emergency Header Bar */}
      <header className="bg-terracotta text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-serif text-base font-semibold block leading-tight">
                Emergency Medical Record
              </span>
              <span className="text-[10px] text-white/80 block">
                Official MedSecure Emergency Triage View
              </span>
            </div>
          </div>

          <div className="text-[11px] font-medium bg-black/20 px-2.5 py-1 rounded-full border border-white/20">
            Read-Only Emergency Access
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Patient Hero Card */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand/60">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-brown">
                Verified Patient
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
                {record.patientName}
              </h1>
            </div>

            {/* Blood Type Badge */}
            <div className="flex items-center gap-3 bg-terracotta/10 border border-terracotta/30 px-5 py-3 rounded-2xl self-start sm:self-auto">
              <Heart className="w-6 h-6 text-terracotta fill-terracotta" />
              <div>
                <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider block">
                  Blood Group
                </span>
                <span className="font-serif text-2xl font-bold text-dark-brown block leading-tight">
                  {record.bloodGroup || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Critical Directives & Notes */}
          {record.emergencyNotes && (
            <div className="mt-6 p-4 rounded-xl bg-sand/30 border border-sand flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-dark-brown uppercase tracking-wider block">
                  Critical Emergency Directives
                </span>
                <p className="text-xs text-dark-brown/90 mt-1 leading-relaxed whitespace-pre-line font-medium">
                  {record.emergencyNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact & Organ Donor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Emergency Contact Card with Click-to-call */}
          <div className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
                <Phone className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-normal text-forest">Emergency Contact</h2>
            </div>

            {record.emergencyContactPhone ? (
              <div className="space-y-3">
                <div>
                  <p className="text-base font-semibold text-dark-brown">
                    {record.emergencyContactName || 'Primary Contact'}
                  </p>
                  {record.emergencyContactRelationship && (
                    <p className="text-xs text-muted-brown capitalize">
                      {record.emergencyContactRelationship}
                    </p>
                  )}
                </div>

                <a
                  href={`tel:${record.emergencyContactPhone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-light text-ivory text-xs font-semibold shadow-warm transition-all"
                >
                  <Phone className="w-4 h-4 text-sand" />
                  <span>Call {record.emergencyContactPhone}</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-brown">No emergency contact on file.</p>
            )}
          </div>

          {/* Organ Donor Status */}
          <div className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-normal text-forest">Organ Donor Status</h2>
            </div>

            <div className="space-y-2">
              <span
                className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  record.organDonor === 'yes'
                    ? 'bg-forest/10 text-forest border border-forest/30'
                    : 'bg-sand/40 text-muted-brown border border-sand'
                }`}
              >
                {record.organDonor === 'yes'
                  ? 'Registered Organ Donor'
                  : record.organDonor === 'no'
                  ? 'Non-Donor'
                  : 'Undecided / Not Registered'}
              </span>
              <p className="text-xs text-muted-brown leading-relaxed">
                Legally verified clinical consent preference.
              </p>
            </div>
          </div>
        </div>

        {/* Allergies & Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Allergies */}
          <div className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-normal text-forest">Known Allergies</h2>
            </div>

            <p className="text-xs text-dark-brown leading-relaxed whitespace-pre-line font-medium">
              {record.allergies || 'No known allergies documented.'}
            </p>
          </div>

          {/* Chronic Conditions */}
          <div className="bg-white rounded-2xl border border-sand/80 p-6 shadow-warm space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sand/60">
              <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-normal text-forest">Chronic Conditions</h2>
            </div>

            <p className="text-xs text-dark-brown leading-relaxed whitespace-pre-line font-medium">
              {record.chronicConditions || 'No chronic conditions reported.'}
            </p>
          </div>
        </div>

        {/* Data Minimization Notice */}
        <div className="p-4 rounded-xl bg-cream border border-sand flex items-center gap-3 text-xs text-muted-brown">
          <Shield className="w-5 h-5 text-forest flex-shrink-0" />
          <span>
            MedSecure Privacy Guarantee: Private consultation histories, progress reports, and non-emergency records are strictly redacted from public access.
          </span>
        </div>
      </main>
    </div>
  );
}
