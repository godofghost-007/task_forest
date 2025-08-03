'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Footprints,
  Heart,
  LayoutGrid,
  Pencil,
  Search,
  Bike,
  Waves,
  TrendingUp,
  X,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/context/task-context';
import type { Task } from '@/context/task-context';

const actionIcons = [
  { icon: Check, label: 'Completion' },
  { icon: Heart, label: 'Health' },
  { icon: LayoutGrid, label: 'Categories' },
  { icon: Clock, label: 'Schedule' },
  { icon: Pencil, label: 'Custom' },
];

const healthTasks = [
  { icon: Footprints, name: 'Walk or Run' },
  { icon: Clock, name: 'Stand Minutes' },
  { icon: Bike, name: 'Cycle' },
  { icon: Waves, name: 'Swim' },
  { icon: Heart, name: 'Mindful Minutes', indicator: 'red' },
  { icon: TrendingUp, name: 'Climb Flights' },
  {
    icon: () => (
      <div className="relative h-6 w-6">
        <div className="absolute h-4 w-4 rounded-full bg-cyan-400" />
        <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-green-400" />
        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-pink-400" />
      </div>
    ),
    name: 'Activity Rings',
  },
  { icon: Clock, name: 'Stand Hours', indicator: 'blue' },
  { icon: Dumbbell, name: 'Exercise Minutes', indicator: 'green' },
];

const iconMap: { [key: string]: React.ElementType } = {
  Footprints,
  Clock,
  Bike,
  Waves,
  Heart,
  TrendingUp,
  Dumbbell,
  Pencil,
  Check,
  Scissors: Icons.Scissors,
  PenTool: Icons.PenTool,
  Leaf: Icons.Leaf,
  BookOpen: Icons.BookOpen,
  RunIcon: RunIcon,
  Pill: Icons.Pill,
};

import * as Icons from 'lucide-react';
import { RunIcon } from '@/components/icons/run-icon';
import { Label } from '../ui/label';

function DetailsView({ task, onBack, onClose }: { task: Partial<Task>, onBack: () => void, onClose: () => void }) {
  const { addTask } = useTasks();
  const [time, setTime] = useState(task.time || '10:00');
  const [duration, setDuration] = useState(task.duration || 30);

  const handleAddTask = () => {
    addTask({
      id: Date.now().toString(),
      title: (task.title || 'New Task').toUpperCase(),
      subtitle: `${duration} min`,
      icon: task.icon || 'Pencil',
      streak: 0,
      completed: false,
      time: time,
      duration: duration,
    });
    onClose();
  };
  
  const Icon = task.icon && iconMap[task.icon] ? iconMap[task.icon] : Pencil;

  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-headline font-semibold text-white uppercase">{task.title}</h3>
      </div>
       <div className="flex items-center justify-center">
          <Icon className="h-16 w-16 text-white" />
       </div>
      <div className="space-y-4">
        <div>
            <Label htmlFor="time" className="text-white/80">Time</Label>
            <Input 
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white/20 text-white placeholder:text-white/70 border-white/30"
            />
        </div>
        <div>
            <Label htmlFor="duration" className="text-white/80">Duration (minutes)</Label>
            <Input 
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="bg-white/20 text-white placeholder:text-white/70 border-white/30"
            />
        </div>
      </div>
      <Button onClick={handleAddTask} className="w-full bg-white text-primary hover:bg-white/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Task
      </Button>
    </div>
  );
}


function CustomTaskView({ onBack, onClose }: { onBack: () => void, onClose: () => void }) {
  const [title, setTitle] = useState('');
  const { addTask } = useTasks();

  const handleAddTask = () => {
    if (title.trim()) {
      addTask({
        id: Date.now().toString(),
        title: title.toUpperCase(),
        subtitle: 'Daily',
        icon: 'Pencil',
        streak: 0,
        completed: false,
      });
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-headline font-semibold text-white">CUSTOM TASK</h3>
      </div>
      <p className="text-center text-xs text-white/70">
        Create a custom task to track your personal goals.
      </p>
      <Input
        placeholder="e.g. Write Journal"
        className="bg-white/20 text-white placeholder:text-white/70 border-white/30"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button onClick={handleAddTask} className="w-full bg-white text-primary hover:bg-white/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Custom Task
      </Button>
    </div>
  );
}

function DefaultView({ onCustomClick, onDetailsClick }: { onCustomClick: () => void, onDetailsClick: (task: Partial<Task>) => void }) {
  const { addTask } = useTasks();
  
  const handleHealthTaskClick = (taskName: string, iconName: string) => {
    addTask({
      id: Date.now().toString(),
      title: taskName.toUpperCase(),
      subtitle: 'Health Task',
      icon: iconName,
      streak: 0,
      completed: false,
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-around">
        {actionIcons.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              className="rounded-full h-14 w-14 bg-white/20 hover:bg-white/30"
              onClick={() => label === 'Custom' && onCustomClick()}
            >
              <Icon className="h-7 w-7 text-white" />
            </Button>
            <span className="text-xs text-white/80">{label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-center text-xs text-white/70">
          Health tasks are linked to the Health app and are automatically
          marked as complete when new data is recorded.
        </p>

        <h3 className="font-headline font-semibold text-white">
          CREATE A HEALTH TASK:
        </h3>

        <div className="space-y-2">
          {healthTasks.map(({ icon: Icon, name, indicator }) => {
            const iconName = (Icon as any).displayName || 'Heart';
            return (
              <DialogClose asChild key={name}>
                <div className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white/10">
                  <button
                    className="flex flex-1 items-center gap-4"
                    onClick={() => handleHealthTaskClick(name, iconName)}
                  >
                    <Icon />
                    <span className="flex-1 font-medium">{name}</span>
                    {indicator && (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: indicator }}
                      />
                    )}
                  </button>
                  <Button variant="ghost" size="icon" className="text-white/50 hover:bg-white/20 hover:text-white/80" onClick={(e) => {
                    e.stopPropagation();
                    onDetailsClick({ title: name, icon: iconName });
                  }}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </DialogClose>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export function AddTaskModal({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<'default' | 'custom' | 'details'>('default');
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDetailsClick = (task: Partial<Task>) => {
    setSelectedTask(task);
    setView('details');
  };

  const handleBack = () => {
    setView('default');
    setSelectedTask(null);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setView('default');
        setSelectedTask(null);
      }
    }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 border-0 bg-gradient-to-br from-gradient-gold-start to-gradient-gold-end text-white">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-white/20">
          <DialogTitle className="font-headline text-lg text-white">Add Task</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {view === 'default' && <DefaultView onCustomClick={() => setView('custom')} onDetailsClick={handleDetailsClick} />}
        {view === 'custom' && <CustomTaskView onBack={handleBack} onClose={handleClose} />}
        {view === 'details' && selectedTask && <DetailsView task={selectedTask} onBack={handleBack} onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
