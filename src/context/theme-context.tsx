
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('task-forest-theme') || 'Default';
    setTheme(savedTheme);
  }, []);

  const setTheme = (themeName: string) => {
    const root = window.document.documentElement;
    const selectedTheme = themes.find(t => t.name === themeName);
    
    if (!selectedTheme) return;

    // Clean up all possible theme classes
    themes.forEach(t => {
      if (t.className) {
        root.classList.remove(t.className);
      }
    });
    
    // Add the new theme class
    if (selectedTheme.className) {
        root.classList.add(selectedTheme.className);
    }
    
    setThemeState(themeName);
    localStorage.setItem('task-forest-theme', themeName);
  };
  
  // On initial load, apply the theme from state
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
