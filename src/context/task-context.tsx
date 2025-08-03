
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  completeTask: (taskId: string) => void;
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  closeTaskModal: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: '1',
    icon: 'Pencil',
    title: 'WRITE JOURNAL',
    streak: 2,
    subtitle: 'Daily',
    completed: false,
    duration: 5,
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
    }
  },
  {
    id: '4',
    icon: 'BookOpen',
    title: 'WRITE NOVEL',
    streak: 3,
    subtitle: 'Daily*',
    completed: false,
    duration: 25,
  },
  {
    id: '5',
    icon: 'RunIcon',
    title: 'RUN 10 MILES',
    streak: 6,
    subtitle: 'Weekly*',
    completed: false,
    duration: 60,
  },
  {
    id: '6',
    icon: 'Pill',
    title: 'TAKE VITAMINS',
    streak: 4,
    subtitle: 'Daily*',
    completed: false,
    duration: 1,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  }

  const completeTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true, streak: task.streak + 1 } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, completeTask, isTaskModalOpen, setTaskModalOpen, closeTaskModal }}>
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
