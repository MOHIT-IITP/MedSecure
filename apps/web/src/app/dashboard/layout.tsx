'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  User,
  HeartPulse,
  FileText,
  QrCode,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Personal Profile', icon: User },
  { href: '/dashboard/medical', label: 'Medical Details', icon: HeartPulse },
  { href: '/dashboard/health-logs', label: 'Health Logs', icon: FileText },
  { href: '/dashboard/qr', label: 'Emergency QR', icon: QrCode },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
          <p className="text-sm font-medium text-muted-brown">Loading your records...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-cream border-b border-sand px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-ivory">
            <Shield className="w-4 h-4 text-sand" />
          </div>
          <span className="font-serif text-xl font-bold text-forest tracking-tight">MedSecure</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-dark-brown hover:bg-sand/40"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex">
          <div className="w-72 bg-cream h-full p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand/80 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-ivory">
                    <Shield className="w-4 h-4 text-sand" />
                  </div>
                  <span className="font-serif text-xl font-bold text-forest">MedSecure</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-dark-brown"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-forest text-ivory shadow-sm'
                          : 'text-dark-brown/90 hover:bg-sand/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-sand/80">
              <div className="mb-3 px-2">
                <p className="text-xs font-semibold text-dark-brown truncate">{user.name}</p>
                <p className="text-[11px] text-muted-brown truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-cream/70 border-r border-sand/80 p-6 flex-shrink-0">
        <div>
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 mb-10 group">
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-ivory shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4 text-sand" />
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold text-forest tracking-tight block leading-none">
                MedSecure
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-brown font-medium mt-0.5 block">
                Health Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest text-ivory shadow-warm font-semibold'
                      : 'text-dark-brown/80 hover:bg-sand/40 hover:text-dark-brown'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-sand/80">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-ivory border border-sand/60">
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest font-serif font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-dark-brown truncate leading-tight">
                {user.name}
              </p>
              <span className="inline-block text-[10px] text-forest font-medium capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium text-terracotta hover:bg-terracotta/10 border border-terracotta/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
