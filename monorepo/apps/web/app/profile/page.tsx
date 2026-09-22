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
  CardFooter,
  Badge,
  Input,
  Label,
  Textarea,
  Alert,
} from "../../components/ui";
import {
  User,
  Shield,
  Phone,
  AlertCircle,
  CheckCircle2,
  Lock,
  Heart,
} from "../../components/ui/icons";

type UserProfile = {
  name: string;
  email: string;
  age: number | null;
  bloodGroup: string | null;
  allergies: string | null;
  chronicDiseases: string | null;
  emergencyContact: string | null;
};

export default function ProfilePage() {
  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    allergies: "",
    chronicDiseases: "",
    emergencyContact: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok && data.user) {
          const u = data.user as UserProfile;
          setInitialData(u);
          setEmail(u.email ?? "");
          setForm({
            name: u.name ?? "",
            age: u.age != null ? String(u.age) : "",
            bloodGroup: u.bloodGroup ?? "",
            allergies: u.allergies ?? "",
            chronicDiseases: u.chronicDiseases ?? "",
            emergencyContact: u.emergencyContact ?? "",
          });
        } else {
          setFeedback({
            tone: "error",
            message: "Failed to load profile details.",
          });
        }
      } catch (err) {
        console.error(err);
        setFeedback({
          tone: "error",
          message: "Network error loading profile.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleReset() {
    if (!initialData) return;
    setForm({
      name: initialData.name ?? "",
      age: initialData.age != null ? String(initialData.age) : "",
      bloodGroup: initialData.bloodGroup ?? "",
      allergies: initialData.allergies ?? "",
      chronicDiseases: initialData.chronicDiseases ?? "",
      emergencyContact: initialData.emergencyContact ?? "",
    });
    setFeedback(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          age: form.age ? Number(form.age) : undefined,
          bloodGroup: form.bloodGroup.trim() || undefined,
          allergies: form.allergies.trim() || undefined,
          chronicDiseases: form.chronicDiseases.trim() || undefined,
          emergencyContact: form.emergencyContact.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({
          tone: "error",
          message: data.message ?? "Could not save profile updates.",
        });
        return;
      }

      setInitialData(data.user);
      setFeedback({
        tone: "success",
        message: "Profile updated successfully. Emergency QR code updated.",
      });
    } catch {
      setFeedback({
        tone: "error",
        message: "Network error saving profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      title="Health Profile & Emergency Information"
      subtitle="Manage your personal identity, critical clinical indicators, and responder contacts."
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {feedback && (
          <Alert tone={feedback.tone}>
            {feedback.message}
          </Alert>
        )}

        {/* Section 1: Personal & Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <Badge variant="outline" size="sm">
                Identity
              </Badge>
            </div>
            <CardDescription>
              Your legal name and linked email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full-name" required>
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="account-email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="account-email"
                    value={email}
                    disabled
                    className="bg-slate-50 text-slate-500 cursor-not-allowed pr-8"
                  />
                  <Lock
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Email is linked to your authentication credentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  max={150}
                  placeholder="e.g. 34"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="blood-group">Blood Group</Label>
                <Input
                  id="blood-group"
                  placeholder="e.g. O+, A-, B+, AB+"
                  value={form.bloodGroup}
                  onChange={(e) =>
                    setForm({ ...form, bloodGroup: e.target.value })
                  }
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Displayed prominently on emergency QR scan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Clinical & Medical Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-red-500" />
                <CardTitle>Medical Conditions & Allergies</CardTitle>
              </div>
              <Badge variant="warning" size="sm">
                Emergency Visible
              </Badge>
            </div>
            <CardDescription>
              Essential medical context shared with paramedics and physicians
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                rows={2}
                placeholder="e.g. Penicillin, Peanuts, Latex, Aspirin (or 'None')"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                List any severe pharmaceutical or environmental allergies
              </p>
            </div>

            <div>
              <Label htmlFor="chronic-conditions">
                Chronic Diseases & Conditions
              </Label>
              <Textarea
                id="chronic-conditions"
                rows={2}
                placeholder="e.g. Asthma, Type 2 Diabetes, Hypertension (or 'None')"
                value={form.chronicDiseases}
                onChange={(e) =>
                  setForm({ ...form, chronicDiseases: e.target.value })
                }
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Important underlying conditions that clinicians should be aware of
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-slate-700" />
                <CardTitle>Emergency Responder Contact</CardTitle>
              </div>
              <Badge variant="success" size="sm">
                1-Tap Call Link
              </Badge>
            </div>
            <CardDescription>
              Primary contact person and phone number for immediate notification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="emergency-contact">
                Emergency Contact (Name, Relation & Phone)
              </Label>
              <Input
                id="emergency-contact"
                placeholder="e.g. Sarah Jenkins (Spouse) — +1 (555) 019-2834"
                value={form.emergencyContact}
                onChange={(e) =>
                  setForm({ ...form, emergencyContact: e.target.value })
                }
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Include country/area code so first responders can tap-to-call immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleReset}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
