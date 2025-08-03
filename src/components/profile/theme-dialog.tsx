
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTheme } from '@/context/theme-context';
import { themes } from '@/lib/themes';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ThemeDialog({ children }: { children: React.ReactNode }) {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Select a Theme</DialogTitle>
          <DialogDescription>
            Choose a theme that suits your style. Your choice will be saved for your next visit.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {themes.map((theme) => {
              const isActive = activeTheme === theme.name;
              return (
                <div key={theme.name} className="space-y-2">
                  <h3 className="text-sm font-medium text-center">{theme.name}</h3>
                  <button
                    className={cn(
                      'relative w-full rounded-lg border-2 p-4 transition-all',
                      isActive ? 'border-primary scale-105' : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => setTheme(theme.name)}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex -space-x-2 overflow-hidden">
                       <div className="h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.primary})` }} />
                       <div className="h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.secondary})` }} />
                       <div className="h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.accent})` }} />
                       <div className="h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.background})` }} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                        Primary / Secondary / Accent / BG
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
