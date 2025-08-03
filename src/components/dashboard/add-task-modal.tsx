'use client';
import { useState, useRef } from 'react';
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
  Pencil,
  Search,
  Bike,
  Waves,
  TrendingUp,
  X,
  Plus,
  ArrowLeft,
  Music,
  BookOpen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/context/task-context';
import type { Task } from '@/context/task-context';
import { cn } from '@/lib/utils';


const healthTasks = [
  { icon: Footprints, name: 'Walk or Run' },
  { icon: Clock, name: 'Stand Minutes' },
  { icon: Bike, name: 'Cycle' },
  { icon: Waves, name: 'Swim' },
  { icon: Heart, name: 'Mindful Minutes', indicator: 'red' },
  { icon: BookOpen, name: 'Study' },
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

const meditationMusic = [
    { id: '1', title: 'Quiet Forest', duration: '10:00' },
    { id: '2', title: 'Gentle Stream', duration: '15:00' },
    { id: '3', title: 'Morning Birds', duration: '5:00' },
    { id: '4', title: 'Rainfall', duration: '20:00' },
    { id: '5', title: 'Ocean Waves', duration: '30:00' },
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

function MusicSelectionView({ task, onBack, onClose }: { task: Partial<Task>, onBack: () => void, onClose: () => void }) {
  const { addTask } = useTasks();
  const [selectedMusic, setSelectedMusic] = useState<Task['music']>(meditationMusic[0]);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleAddTask = () => {
    let musicData = selectedMusic;
    if (localFileName) {
      musicData = { title: localFileName, duration: 'Custom' };
    }
    
    addTask({
      id: Date.now().toString(),
      title: (task.title || 'Mindful Minutes').toUpperCase(),
      subtitle: musicData ? musicData.title : 'No music',
      icon: task.icon || 'Heart',
      streak: 0,
      completed: false,
      showPlay: true,
      music: musicData,
    });
    onClose();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLocalFileName(event.target.files[0].name);
      setSelectedMusic(undefined);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-headline font-semibold text-white uppercase">{task.title}</h3>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-white/90">Select Music</h4>
        {meditationMusic.map((music) => (
          <button
            key={music.id}
            onClick={() => {
              setSelectedMusic(music)
              setLocalFileName(null);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
              selectedMusic?.id === music.id ? "bg-white/30" : "hover:bg-white/10"
            )}
          >
            <div>
              <p className="font-medium">{music.title}</p>
              <p className="text-sm text-white/70">{music.duration}</p>
            </div>
            {selectedMusic?.id === music.id && <Check className="h-5 w-5 text-white" />}
          </button>
        ))}
         <div>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="audio/mp3,audio/*"
            />
            <button
                onClick={handleUploadClick}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                  localFileName ? "bg-white/30" : "hover:bg-white/10"
                )}
            >
                <div>
                    <p className="font-medium">From your device</p>
                    {localFileName && <p className="text-sm text-white/70 truncate max-w-xs">{localFileName}</p>}
                </div>
                {localFileName && <Check className="h-5 w-5 text-white" />}
            </button>
        </div>
      </div>
      <Button onClick={handleAddTask} className="w-full bg-white text-primary hover:bg-white/90">
        <Plus className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </div>
  );
}


function DetailsView({ task, onBack, onClose }: { task: Partial<Task>, onBack: () => void, onClose: () => void }) {
  const { addTask } = useTasks();
  const [time, setTime] = useState(task.time || '10:00');
  const [duration, setDuration] = useState(task.duration || 30);
  const [selectedMusic, setSelectedMusic] = useState<Task['music']>(undefined);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    let musicData = selectedMusic;
    if (localFileName) {
      musicData = { title: localFileName, duration: 'Custom' };
    }
    addTask({
      id: Date.now().toString(),
      title: (task.title || 'New Task').toUpperCase(),
      subtitle: `${duration} min`,
      icon: task.icon || 'Pencil',
      streak: 0,
      completed: false,
      time: time,
      duration: duration,
      music: musicData,
      showPlay: !!musicData
    });
    onClose();
  };
  
  const Icon = task.icon && iconMap[task.icon as string] ? iconMap[task.icon as string] : Pencil;
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLocalFileName(event.target.files[0].name);
      setSelectedMusic(undefined);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

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
        <div className="space-y-2">
          <h4 className="font-semibold text-white/90">Select Music (Optional)</h4>
          {meditationMusic.map((music) => (
            <button
              key={music.id}
              onClick={() => {
                setSelectedMusic(music.id === selectedMusic?.id ? undefined : music)
                setLocalFileName(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusic?.id === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
                <p className="text-sm text-white/70">{music.duration}</p>
              </div>
              {selectedMusic?.id === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
           <div>
              <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="audio/mp3,audio/*"
              />
              <button
                  onClick={handleUploadClick}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                    localFileName ? "bg-white/30" : "hover:bg-white/10"
                  )}
              >
                  <div>
                      <p className="font-medium">From your device</p>
                      {localFileName && <p className="text-sm text-white/70 truncate max-w-xs">{localFileName}</p>}
                  </div>
                  {localFileName && <Check className="h-5 w-5 text-white" />}
              </button>
          </div>
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
  const [duration, setDuration] = useState(10);
  const [selectedMusic, setSelectedMusic] = useState<Task['music']>(undefined);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    if (title.trim()) {
      let musicData = selectedMusic;
      if (localFileName) {
        musicData = { title: localFileName, duration: 'Custom' };
      }
      addTask({
        id: Date.now().toString(),
        title: title.toUpperCase(),
        subtitle: `${duration} min`,
        icon: 'Pencil',
        streak: 0,
        completed: false,
        duration: duration,
        music: musicData,
        showPlay: !!musicData
      });
      setTitle('');
      onClose();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLocalFileName(event.target.files[0].name);
      setSelectedMusic(undefined);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }


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
       <div className="space-y-2">
          <h4 className="font-semibold text-white/90">Select Music (Optional)</h4>
          {meditationMusic.map((music) => (
            <button
              key={music.id}
              onClick={() => {
                setSelectedMusic(music.id === selectedMusic?.id ? undefined : music)
                setLocalFileName(null);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusic?.id === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
                <p className="text-sm text-white/70">{music.duration}</p>
              </div>
              {selectedMusic?.id === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
           <div>
              <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="audio/mp3,audio/*"
              />
              <button
                  onClick={handleUploadClick}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                    localFileName ? "bg-white/30" : "hover:bg-white/10"
                  )}
              >
                  <div>
                      <p className="font-medium">From your device</p>
                      {localFileName && <p className="text-sm text-white/70 truncate max-w-xs">{localFileName}</p>}
                  </div>
                  {localFileName && <Check className="h-5 w-5 text-white" />}
              </button>
          </div>
        </div>

      <Button onClick={handleAddTask} className="w-full bg-white text-primary hover:bg-white/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Custom Task
      </Button>
    </div>
  );
}

function DefaultView({ onCustomClick, onDetailsClick, onMusicClick }: { onCustomClick: () => void, onDetailsClick: (task: Partial<Task>) => void, onMusicClick: (task: Partial<Task>) => void }) {
  const { addTask, closeTaskModal } = useTasks();
  
  const handleHealthTaskClick = (task: {name: string, icon: React.ElementType, indicator?: string}) => {
    const iconName = (task.icon as any).displayName || Object.keys(iconMap).find(key => iconMap[key] === task.icon) || 'Heart';

    if (task.name === 'Mindful Minutes') {
      onMusicClick({ title: task.name, icon: iconName });
      return;
    }
    
    // For simple tasks without details, go to details view with defaults
    onDetailsClick({
      title: task.name,
      icon: iconName,
      duration: 10,
    });
  }

  return (
    <div className="p-6 space-y-6">
       <div className="space-y-4">
        <p className="text-center text-xs text-white/70">
          Add a new health task or create a custom one.
        </p>

        <Button onClick={onCustomClick} variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white">
          <Pencil className="mr-2 h-4 w-4" />
          Create a Custom Task
        </Button>


        <h3 className="font-headline font-semibold text-white pt-4">
          CREATE A HEALTH TASK:
        </h3>
        <p className="text-xs text-white/70 -mt-3">
          Health tasks are linked to the Health app and are automatically
          marked as complete when new data is recorded.
        </p>

        <div className="space-y-2">
          {healthTasks.map((task, index) => {
            const { icon: Icon, name } = task;
            const iconName = (Icon as any).displayName || Object.keys(iconMap).find(key => iconMap[key] === Icon) || 'Heart';
            return (
                <div key={`${name}-${index}`} className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white/10">
                    <button
                        className="flex flex-1 items-center gap-4"
                        onClick={() => handleHealthTaskClick(task)}
                    >
                        <Icon />
                        <span className="flex-1 font-medium">{name}</span>
                    </button>
                  <Button variant="ghost" size="icon" className="text-white/50 hover:bg-white/20 hover:text-white/80" onClick={(e) => {
                    e.stopPropagation();
                    if (name === 'Mindful Minutes') {
                        onMusicClick({ title: name, icon: iconName });
                    } else {
                        onDetailsClick({ title: name, icon: iconName, duration: 10 });
                    }
                  }}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export function AddTaskModal({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<'default' | 'custom' | 'details' | 'musicSelection'>('default');
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const { isTaskModalOpen, setTaskModalOpen } = useTasks();

  const handleDetailsClick = (task: Partial<Task>) => {
    setSelectedTask(task);
    setView('details');
  };

  const handleMusicClick = (task: Partial<Task>) => {
    setSelectedTask(task);
    setView('musicSelection');
  }

  const handleBack = () => {
    setView('default');
    setSelectedTask(null);
  }

  const handleClose = () => {
    setTaskModalOpen(false);
  }

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={(open) => {
      setTaskModalOpen(open);
      if (!open) {
        setView('default');
        setSelectedTask(null);
      }
    }}>
      <DialogTrigger asChild onClick={() => setTaskModalOpen(true)}>{children}</DialogTrigger>
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

        {view === 'default' && <DefaultView onCustomClick={() => setView('custom')} onDetailsClick={handleDetailsClick} onMusicClick={handleMusicClick} />}
        {view === 'custom' && <CustomTaskView onBack={handleBack} onClose={handleClose} />}
        {view === 'details' && selectedTask && <DetailsView task={selectedTask} onBack={handleBack} onClose={handleClose} />}
        {view === 'musicSelection' && selectedTask && <MusicSelectionView task={selectedTask} onBack={handleBack} onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
