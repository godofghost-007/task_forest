'use client';
import { Heart, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { RunIcon } from '@/components/icons/run-icon';
import { useMemo } from 'react';

// A type guard to check if a key is a valid Lucide icon name
function isLucideIcon(key: string): key is keyof typeof Icons {
  return key in Icons;
}

export interface Task {
  icon: string;
  title: string;
  subtitle: string;
  streak: number;
  showPlay?: boolean;
}

export function TaskItem({ icon, title, subtitle, streak, showPlay }: Task) {
  const Icon = useMemo(() => {
    if (icon === 'RunIcon') {
      return RunIcon;
    }
    if (isLucideIcon(icon)) {
      return Icons[icon];
    }
    return Icons.HelpCircle; // Fallback icon
  }, [icon]);
  
  return (
    <div className="group flex flex-col items-center gap-3 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
      <div
        className={cn(
          'relative flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-lg',
          'md:h-36 md:w-36'
        )}
      >
        <Icon className="h-12 w-12 text-gray-700" />
        {streak > 0 && (
          <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">
            {streak}
          </div>
        )}
        {showPlay && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Play className="h-10 w-10 text-white" fill="white" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="flex items-center gap-2 font-headline text-sm font-semibold text-white">
          <Heart className="h-4 w-4 text-red-400" fill="currentColor" />
          {title}
        </h3>
        <p className="text-xs text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
