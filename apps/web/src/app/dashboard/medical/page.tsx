'use client';

import React, { useEffect, useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Pill,
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { MedicalDetailsData } from '@medsecure/types';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalDetailsPage() {
  const [, setMedical] = useState<MedicalDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bloodGroup: '',
    allergies: '',
    medications: '',
    chronicConditions: '',
    organDonor: 'undecided',
    emergencyNotes: '',
  });

  useEffect(() => {
    async function loadMedicalDetails() {
      try {
        const data = await apiFetch<MedicalDetailsData>('/medical-details/me');
        setMedical(data);
        setFormData({
          bloodGroup: data.bloodGroup || '',
          allergies: data.allergies || '',
          medications: data.medications || '',
          chronicConditions: data.chronicConditions || '',
          organDonor: data.organDonor || 'undecided',
          emergencyNotes: data.emergencyNotes || '',
        });
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load medical records.');
      } finally {
        setLoading(false);
      }
    }

    loadMedicalDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await apiFetch<MedicalDetailsData>('/medical-details/me', {
        method: 'PUT',
        body: JSON.stringify({
          bloodGroup: formData.bloodGroup || null,
          allergies: formData.allergies || null,
          medications: formData.medications || null,
          chronicConditions: formData.chronicConditions || null,
          organDonor: formData.organDonor || 'undecided',
          emergencyNotes: formData.emergencyNotes || null,
        }),
      });

      setMedical(updated);
      setSuccessMessage('Medical details and clinical preferences saved successfully.');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to save medical details. Please verify your connection.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
        <p className="text-sm font-medium text-muted-brown mt-3">Loading clinical details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Clinical Profile
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
          Medical & Emergency Details
        </h1>
        <p className="text-sm text-muted-brown mt-1">
          Critical clinical information accessible to attending physicians and emergency services.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-forest/10 border border-forest/30 flex items-center gap-3 text-forest text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-terracotta/10 border border-terracotta/30 flex items-center gap-3 text-terracotta text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Vitals & Blood Type */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">Blood & Organ Registry</h2>
              <p className="text-xs text-muted-brown">Immediate life-saving biological traits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bloodGroup" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Blood Group (ABO & Rh Factor)
              </label>
              <select
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              >
                <option value="">Select blood group...</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="organDonor" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Organ Donor Status
              </label>
              <select
                id="organDonor"
                value={formData.organDonor}
                onChange={(e) => setFormData({ ...formData, organDonor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              >
                <option value="yes">Yes, registered organ donor</option>
                <option value="no">No</option>
                <option value="undecided">Undecided / Prefer not to specify</option>
              </select>
            </div>
          </div>
        </div>

        {/* Allergies & Reactions */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">Known Allergies</h2>
              <p className="text-xs text-muted-brown">
                Adverse drug reactions, food intolerances, and environmental allergies
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="allergies" className="block text-xs font-semibold text-dark-brown mb-1.5">
              Allergies List
            </label>
            <textarea
              id="allergies"
              rows={3}
              placeholder="e.g. Penicillin (Anaphylaxis), Peanuts, Latext, NSAIDs"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
            />
            <p className="text-[11px] text-muted-brown mt-1.5">
              Specify the severity and type of reaction if known.
            </p>
          </div>
        </div>

        {/* Active Medications & Chronic Conditions */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">
                Medications & Chronic Conditions
              </h2>
              <p className="text-xs text-muted-brown">
                Ongoing prescriptions, dosages, and diagnosed illnesses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="medications" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Current Medications
              </label>
              <textarea
                id="medications"
                rows={4}
                placeholder="e.g. Metformin 500mg (2x daily), Lisinopril 10mg (morning)"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="chronicConditions"
                className="block text-xs font-semibold text-dark-brown mb-1.5"
              >
                Chronic Diagnoses
              </label>
              <textarea
                id="chronicConditions"
                rows={4}
                placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Emergency Clinical Notes */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-sand/60 flex items-center justify-center text-dark-brown">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">
                Paramedic & First Responder Notes
              </h2>
              <p className="text-xs text-muted-brown">
                Special warnings displayed prominently during emergency QR code scans
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="emergencyNotes"
              className="block text-xs font-semibold text-dark-brown mb-1.5"
            >
              Emergency Directive / Implants / Critical Directives
            </label>
            <textarea
              id="emergencyNotes"
              rows={3}
              placeholder="e.g. Cardiac pacemaker fitted (Medtronic 2022). Do not administer Aspirin. Blood thinner therapy in effect."
              value={formData.emergencyNotes}
              onChange={(e) => setFormData({ ...formData, emergencyNotes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forest hover:bg-forest-light text-ivory text-sm font-semibold shadow-warm transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sand" />
                <span>Saving Details...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-sand" />
                <span>Save Medical Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
