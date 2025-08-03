
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

type Background = {
    id: string;
    type: 'image' | 'video';
    url: string;
    title: string;
    path: string; // Firebase storage path
};

interface BackgroundContextType {
  pomodoroBackground: Background | null;
  taskSessionBackground: Background | null;
  backgroundLibrary: Background[];
  setPomodoroBackground: (background: Background | null) => void;
  setTaskSessionBackground: (background: Background | null) => void;
  addBackgroundToLibrary: (background: Pick<Background, 'type' | 'title'> & { file: File }) => Promise<void>;
  removeBackground: (background: Background) => Promise<void>;
  isUploading: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [pomodoroBackground, setPomodoroBackgroundState] = useState<Background | null>(null);
  const [taskSessionBackground, setTaskSessionBackgroundState] = useState<Background | null>(null);
  const [backgroundLibrary, setBackgroundLibrary] = useState<Background[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
  
  const updateLibrary = (newLibrary: Background[]) => {
    setBackgroundLibrary(newLibrary);
    localStorage.setItem('backgroundLibrary', JSON.stringify(newLibrary));
  }

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

  const addBackgroundToLibrary = async (background: Pick<Background, 'type' | 'title'> & { file: File }) => {
    setIsUploading(true);
    try {
        const id = `bg-${Date.now()}`;
        const fileExtension = background.title.split('.').pop() || 'file';
        const storagePath = `backgrounds/${id}.${fileExtension}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, background.file);
        const downloadUrl = await getDownloadURL(storageRef);

        const newBackground: Background = {
            id,
            type: background.type,
            title: background.title,
            url: downloadUrl,
            path: storagePath,
        };
        
        updateLibrary([...backgroundLibrary, newBackground]);
        toast({ title: 'Success', description: 'Background uploaded to your library.' });
    } catch (error) {
        console.error("Error uploading background:", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload the background. Please try again.' });
    } finally {
        setIsUploading(false);
    }
  };

  const removeBackground = async (background: Background) => {
    try {
        const storageRef = ref(storage, background.path);
        await deleteObject(storageRef);

        const newLibrary = backgroundLibrary.filter(bg => bg.id !== background.id);
        updateLibrary(newLibrary);

        // If the deleted background was set for pomodoro or task session, clear it.
        if (pomodoroBackground?.id === background.id) {
            setPomodoroBackground(null);
        }
        if (taskSessionBackground?.id === background.id) {
            setTaskSessionBackground(null);
        }

        toast({ title: 'Success', description: 'Background removed from your library.' });
    } catch(error) {
        console.error("Error deleting background:", error);
        toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not remove the background. Please try again.' });
    }
  }
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <BackgroundContext.Provider value={{ pomodoroBackground, taskSessionBackground, backgroundLibrary, setPomodoroBackground, setTaskSessionBackground, addBackgroundToLibrary, removeBackground, isUploading }}>
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
