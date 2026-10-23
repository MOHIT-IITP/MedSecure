'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please verify your connection.');
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
          Welcome back
        </h1>
        <p className="text-sm text-muted-brown mt-2">
          Sign in to access your digital medical records and QR tokens.
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-dark-brown/90"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-sand focus:border-forest focus:ring-1 focus:ring-forest text-dark-brown text-sm placeholder:text-muted-brown/60 transition-colors outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-ivory text-sm font-semibold shadow-warm transition-all hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sand" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 text-sand" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand/70 text-center">
            <p className="text-xs text-muted-brown">
              Don’t have an account yet?{' '}
              <Link
                href="/signup"
                className="font-semibold text-forest hover:text-forest-dark underline underline-offset-2"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
