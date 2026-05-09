'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { api } from '@/lib/api';
import type { User } from '@/types';

import { UserProvider, useUser } from '@/contexts/UserContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-surface-bg">
      <Sidebar />

      {/* Main content — offset for sidebar */}
      <div className="lg:pl-60 transition-all duration-300 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">

          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  );
}

