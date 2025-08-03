
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MusicFile = {
    id: string;
    title: string;
    url: string;
};

interface MusicContextType {
  musicLibrary: MusicFile[];
  addMusicToLibrary: (music: MusicFile) => void;
  removeMusic: (id: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicLibrary, setMusicLibrary] = useState<MusicFile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedMusic = localStorage.getItem('musicLibrary');
      if (savedMusic) {
        setMusicLibrary(JSON.parse(savedMusic));
      }
    } catch (error) {
      console.error("Failed to parse music library from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const addMusicToLibrary = (music: MusicFile) => {
    setMusicLibrary((prevMusic) => {
        const newMusic = [...prevMusic, music];
        localStorage.setItem('musicLibrary', JSON.stringify(newMusic));
        return newMusic;
    });
  };

  const removeMusic = (id: string) => {
    setMusicLibrary((prevMusic) => {
        const newMusic = prevMusic.filter(m => m.id !== id);
        localStorage.setItem('musicLibrary', JSON.stringify(newMusic));
        return newMusic;
    })
  }
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <MusicContext.Provider value={{ musicLibrary, addMusicToLibrary, removeMusic }}>
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
