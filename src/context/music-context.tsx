
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CustomMusic = {
    id: string;
    title: string;
    dataUrl: string;
};

interface MusicContextType {
  customMusic: CustomMusic[];
  addCustomMusic: (music: CustomMusic) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [customMusic, setCustomMusic] = useState<CustomMusic[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedMusic = localStorage.getItem('customMusic');
      if (savedMusic) {
        setCustomMusic(JSON.parse(savedMusic));
      }
    } catch (error) {
      console.error("Failed to parse custom music from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const addCustomMusic = (music: CustomMusic) => {
    setCustomMusic((prevMusic) => {
        const newMusic = [...prevMusic, music];
        localStorage.setItem('customMusic', JSON.stringify(newMusic));
        return newMusic;
    });
  };
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <MusicContext.Provider value={{ customMusic, addCustomMusic }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
