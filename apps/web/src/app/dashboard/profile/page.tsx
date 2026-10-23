'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { PatientProfileData } from '@medsecure/types';

export default function ProfilePage() {
  const [, setProfile] = useState<PatientProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch<PatientProfileData>('/patients/me');
        setProfile(data);
        setFormData({
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          address: data.address || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
          emergencyContactRelationship: data.emergencyContactRelationship || '',
        });
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await apiFetch<PatientProfileData>('/patients/me', {
        method: 'PUT',
        body: JSON.stringify({
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          address: formData.address || null,
          emergencyContactName: formData.emergencyContactName || null,
          emergencyContactPhone: formData.emergencyContactPhone || null,
          emergencyContactRelationship: formData.emergencyContactRelationship || null,
        }),
      });

      setProfile(updated);
      setSuccessMessage('Profile information saved successfully.');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to save profile. Please check your connection.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
        <p className="text-sm font-medium text-muted-brown mt-3">Loading personal profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Account Settings
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-forest mt-1">
          Personal Information
        </h1>
        <p className="text-sm text-muted-brown mt-1">
          Keep your demographic and emergency contact details accurate for medical care.
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
        {/* Demographics Card */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">Basic Demographics</h2>
              <p className="text-xs text-muted-brown">General identification details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="dob" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Gender Identity
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              >
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-xs font-semibold text-dark-brown mb-1.5">
                Residential Address
              </label>
              <textarea
                id="address"
                rows={3}
                placeholder="Street address, city, state, postal code"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Card */}
        <div className="bg-white rounded-2xl border border-sand/80 p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sand/60">
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-forest">
                Emergency Contact Information
              </h2>
              <p className="text-xs text-muted-brown">
                Authorized contact person during sudden clinical emergencies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="contactName"
                className="block text-xs font-semibold text-dark-brown mb-1.5"
              >
                Contact Full Name
              </label>
              <input
                id="contactName"
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="contactPhone"
                className="block text-xs font-semibold text-dark-brown mb-1.5"
              >
                Contact Phone Number
              </label>
              <input
                id="contactPhone"
                type="tel"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactPhone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="contactRel"
                className="block text-xs font-semibold text-dark-brown mb-1.5"
              >
                Relationship to Patient
              </label>
              <input
                id="contactRel"
                type="text"
                placeholder="e.g. Spouse, Parent, Sibling, Guardian"
                value={formData.emergencyContactRelationship}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactRelationship: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory/50 text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forest hover:bg-forest-light text-ivory text-sm font-semibold shadow-warm transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sand" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-sand" />
                <span>Save Personal Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
