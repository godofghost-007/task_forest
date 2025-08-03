
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

export type MusicFile = {
    id: string;
    title: string;
    url: string;
    path: string; // Firebase storage path
};

interface MusicContextType {
  musicLibrary: MusicFile[];
  addMusicToLibrary: (music: { title: string, file: File }) => Promise<void>;
  removeMusic: (musicFile: MusicFile) => Promise<void>;
  isUploading: boolean;
  pomodoroMusic: MusicFile | null;
  taskSessionMusic: MusicFile | null;
  setPomodoroMusic: (music: MusicFile | null) => void;
  setTaskSessionMusic: (music: MusicFile | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicLibrary, setMusicLibrary] = useState<MusicFile[]>([]);
  const [pomodoroMusic, setPomodoroMusicState] = useState<MusicFile | null>(null);
  const [taskSessionMusic, setTaskSessionMusicState] = useState<MusicFile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedMusic = localStorage.getItem('musicLibrary');
      if (savedMusic) setMusicLibrary(JSON.parse(savedMusic));
      
      const savedPomodoroMusic = localStorage.getItem('pomodoroMusic');
      if (savedPomodoroMusic) setPomodoroMusicState(JSON.parse(savedPomodoroMusic));

      const savedTaskSessionMusic = localStorage.getItem('taskSessionMusic');
      if (savedTaskSessionMusic) setTaskSessionMusicState(JSON.parse(savedTaskSessionMusic));

    } catch (error) {
      console.error("Failed to parse music library from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const updateLibrary = (newLibrary: MusicFile[]) => {
    setMusicLibrary(newLibrary);
    localStorage.setItem('musicLibrary', JSON.stringify(newLibrary));
  };
  
  const setPomodoroMusic = (music: MusicFile | null) => {
    setPomodoroMusicState(music);
    if (music) {
      localStorage.setItem('pomodoroMusic', JSON.stringify(music));
    } else {
      localStorage.removeItem('pomodoroMusic');
    }
  }

  const setTaskSessionMusic = (music: MusicFile | null) => {
    setTaskSessionMusicState(music);
    if (music) {
      localStorage.setItem('taskSessionMusic', JSON.stringify(music));
    } else {
      localStorage.removeItem('taskSessionMusic');
    }
  }

  const addMusicToLibrary = async (music: { title: string, file: File }) => {
    setIsUploading(true);
    const id = `music-${Date.now()}`;
    const fileExtension = music.file.name.split('.').pop() || 'mp3';
    const storagePath = `music/${id}.${fileExtension}`;
    const localUrl = URL.createObjectURL(music.file);

    // Optimistic update
    const optimisticMusicFile: MusicFile = {
        id,
        title: music.title,
        url: localUrl,
        path: storagePath,
    };

    const newLibrary = [...musicLibrary, optimisticMusicFile];
    updateLibrary(newLibrary);
    
    try {
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, music.file);
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Final update
        const finalMusicFile: MusicFile = { ...optimisticMusicFile, url: downloadUrl };
        const finalLibrary = newLibrary.map(m => m.id === id ? finalMusicFile : m);
        updateLibrary(finalLibrary);
        
        URL.revokeObjectURL(localUrl); // Clean up
        toast({ title: 'Success', description: 'Music uploaded to your library.' });
    } catch (error) {
        console.error("Error uploading music:", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload music. It has been removed.' });
        // Rollback
        updateLibrary(musicLibrary.filter(m => m.id !== id));
    } finally {
        setIsUploading(false);
    }
  };

  const removeMusic = async (musicFile: MusicFile) => {
    try {
        if (!musicFile.url.startsWith('blob:')) {
            const storageRef = ref(storage, musicFile.path);
            await deleteObject(storageRef);
        }

        const newLibrary = musicLibrary.filter(m => m.id !== musicFile.id);
        updateLibrary(newLibrary);

        if (pomodoroMusic?.id === musicFile.id) {
          setPomodoroMusic(null);
        }
        if (taskSessionMusic?.id === musicFile.id) {
          setTaskSessionMusic(null);
        }

        toast({ title: 'Success', description: 'Music removed from your library.' });
    } catch (error) {
        console.error("Error deleting music:", error);
         if (!musicFile.url.startsWith('blob:')) {
            updateLibrary([musicFile, ...musicLibrary]);
        }
        toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not remove music. Please try again.' });
    }
  }
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <MusicContext.Provider value={{ musicLibrary, addMusicToLibrary, removeMusic, isUploading, pomodoroMusic, taskSessionMusic, setPomodoroMusic, setTaskSessionMusic }}>
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

    