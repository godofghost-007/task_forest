'use client';

import { useAuth } from '@/context/auth-context';
import { AuthForm } from '@/components/auth/auth-form';
import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/components/dashboard/dashboard-page';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-12 w-12 text-primary animate-pulse"
            >
                <rect width="256" height="256" fill="none" />
                <path
                d="M213.4,181.9,141.4,45.9a15.9,15.9,0,0,0-26.8,0L42.6,181.9a16.1,16.1,0,0,0,13.4,24.6H200A16.1,16.1,0,0,0,213.4,181.9Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
                />
                <line
                x1="128"
                y1="208"
                x2="128"
                y2="120"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
                />
            </svg>
            <p className="text-muted-foreground">Loading Task Forest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
