
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Using an interface for the task to match task-item.tsx
export interface Task {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  streak: number;
  showPlay?: boolean;
  completed?: boolean;
  time?: string;
  duration?: number;
  music?: {
    id?: string;
    title: string;
    duration: string;
  };
  date: string; // YYYY-MM-DD
  isDefault?: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  defaultTasks: Task[];
  addDefaultTask: (task: Task) => void;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  closeTaskModal: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const today = format(new Date(), 'yyyy-MM-dd');

const initialTasks: Task[] = [
  {
    id: '1',
    icon: 'Pencil',
    title: 'WRITE JOURNAL',
    streak: 2,
    subtitle: 'Daily',
    completed: false,
    duration: 5,
    date: today,
  },
  {
    id: '2',
    icon: 'Dumbbell',
    title: 'MOBILISE',
    streak: 4,
    subtitle: '10 min',
    completed: false,
    time: '10:00',
    duration: 10,
    date: today,
  },
  {
    id: '3',
    icon: 'Heart',
    title: 'MEDITATE',
    streak: 0,
    subtitle: '15 min',
    showPlay: true,
    completed: false,
    time: '09:00',
    duration: 15,
    music: {
      id: '2',
      title: 'Gentle Stream',
      duration: '15:00',
    },
    date: today,
  },
  {
    id: '4',
    icon: 'BookOpen',
    title: 'WRITE NOVEL',
    streak: 3,
    subtitle: 'Daily*',
    completed: false,
    duration: 25,
    date: today,
  },
  {
    id: '5',
    icon: 'RunIcon',
    title: 'RUN 10 MILES',
    streak: 6,
    subtitle: 'Weekly*',
    completed: false,
    duration: 60,
    date: today,
  },
  {
    id: '6',
    icon: 'Star',
    title: 'TAKE VITAMINS',
    streak: 4,
    subtitle: 'Daily*',
    completed: false,
    duration: 1,
    date: today,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [defaultTasks, setDefaultTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const savedDefaultTasks = localStorage.getItem('defaultTasks');
      
      setTasks(savedTasks ? JSON.parse(savedTasks) : initialTasks);
      if (savedDefaultTasks) {
        setDefaultTasks(JSON.parse(savedDefaultTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      setTasks(initialTasks);
    }
    setIsLoaded(true);
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  const addTask = (task: Task) => {
    updateTasks([...tasks, task]);
  };
  
  const addDefaultTask = (task: Task) => {
    const newDefaultTasks = [...defaultTasks, task];
    setDefaultTasks(newDefaultTasks);
    localStorage.setItem('defaultTasks', JSON.stringify(newDefaultTasks));
  };

  const deleteTask = (taskId: string) => {
    updateTasks(tasks.filter((task) => task.id !== taskId));
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  }

  const completeTask = (taskId: string) => {
    const newTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true, streak: task.streak + 1 } : task
      );
    updateTasks(newTasks);
    toast({
        title: "Task Completed!",
        description: "Great job! Your forest is growing thanks to your hard work.",
    });
  };
  
  if (!isLoaded) {
    return null;
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, completeTask, defaultTasks, addDefaultTask, isTaskModalOpen, setTaskModalOpen, closeTaskModal, selectedDate, setSelectedDate }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
