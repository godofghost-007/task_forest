'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh">
        <AppSidebar />
        <SidebarInset className="flex-1 bg-background">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
