
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

  const applyTheme = (themeName: string) => {
    const root = window.document.documentElement;
    const selectedTheme = themes.find(t => t.name === themeName);

    if (!selectedTheme) return;

    // Remove all possible theme classes first.
    themes.forEach(t => {
      if (t.className) {
        root.classList.remove(t.className);
      }
    });

    // Add the new theme class if it's not the default.
    if (selectedTheme.className && selectedTheme.className !== 'theme-default') {
      root.classList.add(selectedTheme.className);
    }
    
    setThemeState(themeName);
    localStorage.setItem('task-forest-theme', themeName);
  };
  
  // On initial load, get theme from local storage and apply it.
  useEffect(() => {
    const savedTheme = localStorage.getItem('task-forest-theme') || 'Default';
    applyTheme(savedTheme);
  }, []);

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
