
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Background = {
    id: string;
    type: 'image' | 'video';
    url: string;
    title: string;
};

interface BackgroundContextType {
  pomodoroBackground: Background | null;
  taskSessionBackground: Background | null;
  backgroundLibrary: Background[];
  setPomodoroBackground: (background: Background | null) => void;
  setTaskSessionBackground: (background: Background | null) => void;
  addBackgroundToLibrary: (background: Background) => void;
  removeBackground: (id: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [pomodoroBackground, setPomodoroBackgroundState] = useState<Background | null>(null);
  const [taskSessionBackground, setTaskSessionBackgroundState] = useState<Background | null>(null);
  const [backgroundLibrary, setBackgroundLibrary] = useState<Background[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedPomodoroBg = localStorage.getItem('pomodoroBackground');
      if (savedPomodoroBg) setPomodoroBackgroundState(JSON.parse(savedPomodoroBg));

      const savedTaskSessionBg = localStorage.getItem('taskSessionBackground');
      if (savedTaskSessionBg) setTaskSessionBackgroundState(JSON.parse(savedTaskSessionBg));
      
      const savedLibrary = localStorage.getItem('backgroundLibrary');
      if (savedLibrary) setBackgroundLibrary(JSON.parse(savedLibrary));

    } catch (error) {
      console.error("Failed to parse backgrounds from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const setPomodoroBackground = (background: Background | null) => {
    setPomodoroBackgroundState(background);
    if (background) {
      localStorage.setItem('pomodoroBackground', JSON.stringify(background));
    } else {
      localStorage.removeItem('pomodoroBackground');
    }
  };

  const setTaskSessionBackground = (background: Background | null) => {
    setTaskSessionBackgroundState(background);
    if (background) {
      localStorage.setItem('taskSessionBackground', JSON.stringify(background));
    } else {
      localStorage.removeItem('taskSessionBackground');
    }
  };

  const addBackgroundToLibrary = (background: Background) => {
    setBackgroundLibrary(prev => {
        const newLibrary = [...prev, background];
        localStorage.setItem('backgroundLibrary', JSON.stringify(newLibrary));
        return newLibrary;
    });
  };

  const removeBackground = (id: string) => {
    setBackgroundLibrary(prev => {
        const newLibrary = prev.filter(bg => bg.id !== id);
        localStorage.setItem('backgroundLibrary', JSON.stringify(newLibrary));
        return newLibrary;
    });
  }
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <BackgroundContext.Provider value={{ pomodoroBackground, taskSessionBackground, backgroundLibrary, setPomodoroBackground, setTaskSessionBackground, addBackgroundToLibrary, removeBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackgrounds() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackgrounds must be used within a BackgroundProvider');
  }
  return context;
}
