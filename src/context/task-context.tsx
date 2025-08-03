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
    id: string;
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
    icon: 'Scissors',
    title: 'WRITE JOURNAL',
    streak: 2,
    subtitle: 'Daily',
    completed: false,
  },
  {
    id: '2',
    icon: 'PenTool',
    title: 'MOBILISE',
    streak: 4,
    subtitle: '10:00',
    completed: false,
    time: '10:00',
  },
  {
    id: '3',
    icon: 'Leaf',
    title: 'MEDITATE',
    streak: 0,
    subtitle: '15 min',
    showPlay: true,
    completed: false,
    time: '09:00',
    duration: 15,
  },
  {
    id: '4',
    icon: 'BookOpen',
    title: 'WRITE NOVEL',
    streak: 3,
    subtitle: 'Daily*',
    completed: false,
  },
  {
    id: '5',
    icon: 'RunIcon',
    title: 'RUN 10 MILES',
    streak: 6,
    subtitle: 'Weekly*',
    completed: false,
  },
  {
    id: '6',
    icon: 'Pill',
    title: 'TAKE VITAMINS',
    streak: 4,
    subtitle: 'Daily*',
    completed: false,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'streak'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      streak: 0,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const closeTaskModal = () => {
    setTaskModalOpen(false);
  }

  const completeTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed, streak: task.completed ? task.streak -1 : task.streak + 1 } : task
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
