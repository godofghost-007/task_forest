
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  TrendingUp,
  Trees,
  UserCircle,
  PanelLeft,
  Settings,
  Star,
  Timer,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  sidebarMenuButtonVariants,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/forest', icon: Trees, label: 'Forest' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
            >
              <g>
                <circle cx="50" cy="50" r="46" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="3" />
                <path
                  d="M 50,25 L 75,75 L 60,75 L 50,55 L 40,75 L 25,75 Z"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                 <line
                  x1="50"
                  y1="25"
                  x2="50"
                  y2="75"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                 <line
                  x1="38"
                  y1="50"
                  x2="62"
                  y2="50"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
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
              <Link
                href={item.href}
                data-active={pathname === item.href}
                className={cn(sidebarMenuButtonVariants({ variant: 'default', size: 'default' }))}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
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
