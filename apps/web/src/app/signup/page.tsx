'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time password criteria verification
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password fulfills all security requirements.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || undefined,
          role,
        }),
      });

      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-ivory shadow-sm transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5 text-sand" />
          </div>
          <span className="font-serif text-3xl font-semibold text-forest tracking-tight">
            MedSecure
          </span>
        </Link>
        <h1 className="font-serif text-3xl font-normal text-forest tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-brown mt-2">
          Start your secure digital health profile in seconds.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-sand/80 shadow-warm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-terracotta/10 border border-terracotta/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-xs text-dark-brown font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90 mb-1.5"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />

              {/* Password checklist */}
              <div className="mt-3 p-3 rounded-lg bg-cream/40 border border-sand/60 space-y-1.5">
                <span className="text-[11px] font-semibold text-forest block">
                  Password security requirements:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className={`flex items-center gap-1.5 ${rules.length ? 'text-forest font-medium' : 'text-muted-brown'}`}>
                    {rules.length ? <Check className="w-3 h-3 text-forest" /> : <X className="w-3 h-3 text-terracotta" />}
                    Min 8 characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${rules.upper ? 'text-forest font-medium' : 'text-muted-brown'}`}>
                    {rules.upper ? <Check className="w-3 h-3 text-forest" /> : <X className="w-3 h-3 text-terracotta" />}
                    Uppercase letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${rules.lower ? 'text-forest font-medium' : 'text-muted-brown'}`}>
                    {rules.lower ? <Check className="w-3 h-3 text-forest" /> : <X className="w-3 h-3 text-terracotta" />}
                    Lowercase letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${rules.number ? 'text-forest font-medium' : 'text-muted-brown'}`}>
                    {rules.number ? <Check className="w-3 h-3 text-forest" /> : <X className="w-3 h-3 text-terracotta" />}
                    At least 1 number
                  </span>
                  <span className={`flex items-center gap-1.5 col-span-2 ${rules.special ? 'text-forest font-medium' : 'text-muted-brown'}`}>
                    {rules.special ? <Check className="w-3 h-3 text-forest" /> : <X className="w-3 h-3 text-terracotta" />}
                    Special symbol (@, $, !, %, *, #, ?)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90 mb-1.5">
                Account Role
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                    role === 'patient'
                      ? 'bg-forest text-ivory border-forest shadow-sm'
                      : 'bg-ivory text-dark-brown border-sand hover:bg-cream'
                  }`}
                >
                  Patient Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                    role === 'doctor'
                      ? 'bg-forest text-ivory border-forest shadow-sm'
                      : 'bg-ivory text-dark-brown border-sand hover:bg-cream'
                  }`}
                >
                  Doctor / Clinician
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-ivory text-sm font-semibold shadow-warm transition-all hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sand" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-sand" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand/70 text-center">
            <p className="text-xs text-muted-brown">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-forest hover:text-forest-dark underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
