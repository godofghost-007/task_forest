
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
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicLibrary, setMusicLibrary] = useState<MusicFile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

  const updateLibrary = (newLibrary: MusicFile[]) => {
    setMusicLibrary(newLibrary);
    localStorage.setItem('musicLibrary', JSON.stringify(newLibrary));
  };

  const addMusicToLibrary = async (music: { title: string, file: File }) => {
    setIsUploading(true);
    try {
        const id = `music-${Date.now()}`;
        const fileExtension = music.title.split('.').pop() || 'mp3';
        const storagePath = `music/${id}.${fileExtension}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, music.file);
        const downloadUrl = await getDownloadURL(storageRef);
        
        const newMusicFile: MusicFile = {
            id,
            title: music.title,
            url: downloadUrl,
            path: storagePath,
        };

        updateLibrary([...musicLibrary, newMusicFile]);
        toast({ title: 'Success', description: 'Music uploaded to your library.' });
    } catch (error) {
        console.error("Error uploading music:", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload music. Please try again.' });
    } finally {
        setIsUploading(false);
    }
  };

  const removeMusic = async (musicFile: MusicFile) => {
    try {
        const storageRef = ref(storage, musicFile.path);
        await deleteObject(storageRef);

        const newLibrary = musicLibrary.filter(m => m.id !== musicFile.id);
        updateLibrary(newLibrary);
        toast({ title: 'Success', description: 'Music removed from your library.' });
    } catch (error) {
        console.error("Error deleting music:", error);
        toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not remove music. Please try again.' });
    }
  }
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <MusicContext.Provider value={{ musicLibrary, addMusicToLibrary, removeMusic, isUploading }}>
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
