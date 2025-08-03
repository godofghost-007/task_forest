
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes } from '@/lib/themes';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('Default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('task-forest-theme') || 'Default';
    applyTheme(savedTheme, false);
  }, []);

  const applyTheme = (themeName: string, shouldSave: boolean = true) => {
    const root = window.document.documentElement;
    const selectedTheme = themes.find(t => t.name === themeName);
    
    if (!selectedTheme) return;

    // Remove all theme classes
    themes.forEach(t => {
      if (t.className) {
        root.classList.remove(t.className);
      }
    });
    
    // Add the new theme class
    if (selectedTheme.className !== 'theme-default') {
      root.classList.add(selectedTheme.className);
    }
    
    setThemeState(themeName);
    if (shouldSave) {
      localStorage.setItem('task-forest-theme', themeName);
    }
  };

  if (!isMounted) {
    // Avoids flash of unstyled content
    return null;
  }
  

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
