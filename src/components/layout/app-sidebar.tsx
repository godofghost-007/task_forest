
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Trees,
  Users,
  UserCircle,
  PanelLeft,
  Settings,
  Star,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/forest', icon: Trees, label: 'Forest' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-7 w-7 text-primary"
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
          <span className="font-headline text-xl font-semibold">
            Task Forest
          </span>
          {isMobile && (
            <div className="ml-auto">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PanelLeft />
                </Button>
              </SidebarTrigger>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between p-2 group-data-[collapsible=icon]:hidden">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-foreground"></span>
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
          </div>
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
