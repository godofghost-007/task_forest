
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
    setThemeState(savedTheme);
  }, []);

  const setTheme = (themeName: string) => {
    const root = window.document.documentElement;
    const selectedTheme = themes.find(t => t.name === themeName);
    if (!selectedTheme) return;

    // Remove old theme class if it exists
    const oldTheme = themes.find(t => t.name === theme);
    if (oldTheme && oldTheme.className) {
        root.classList.remove(oldTheme.className);
    }
    
    // Add new theme class
    if (selectedTheme.className) {
        root.classList.add(selectedTheme.className);
    }
    
    setThemeState(themeName);
    localStorage.setItem('task-forest-theme', themeName);
  };
  
  // On initial load, apply the theme from state
  useEffect(() => {
      const selectedTheme = themes.find(t => t.name === theme);
      if (selectedTheme && selectedTheme.className) {
          const root = window.document.documentElement;
          // Clean up other theme classes
          themes.forEach(t => {
              if (t.className) root.classList.remove(t.className);
          });
          root.classList.add(selectedTheme.className);
      }
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
