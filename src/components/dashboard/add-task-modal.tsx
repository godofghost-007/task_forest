
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
  CalendarIcon,
  Star,
  Timer,
  Play,
  Loader2,
  Upload,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/context/task-context';
import type { Task } from '@/context/task-context';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useMusic } from '@/context/music-context';


const healthTasks = [
  { icon: Footprints, name: 'Walk or Run' },
  { icon: Clock, name: 'Stand Minutes' },
  { icon: Bike, name: 'Cycle' },
  { icon: Waves, name: 'Swim' },
  { icon: Heart, name: 'Mindful Minutes', indicator: 'red' },
  { icon: BookOpen, name: 'Study' },
  { icon: TrendingUp, name: 'Climb Flights' },
  { icon: Timer, name: 'Pomodoro' },
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

export const meditationMusic = [
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
  BookOpen,
  Star,
  Timer,
};

import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

function MusicSelectionView({ task, onBack, onClose }: { task: Partial<Task>, onBack: () => void, onClose: () => void }) {
  const router = useRouter();
  const { musicLibrary } = useMusic();
  const [selectedMusicId, setSelectedMusicId] = useState<string | undefined>(meditationMusic[0].id);

  const handleStartSession = () => {
    // Simply go to the pomodoro page, which is now the main focus session page.
    router.push(`/pomodoro`);
    onClose();
  };

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
        <ScrollArea className="h-72">
        {meditationMusic.map((music) => (
          <button
            key={music.id}
            onClick={() => setSelectedMusicId(music.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
              selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
            )}
          >
            <div>
              <p className="font-medium">{music.title}</p>
              <p className="text-sm text-white/70">{music.duration}</p>
            </div>
            {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
          </button>
        ))}
        {musicLibrary.map((music) => (
             <button
                key={music.id}
                onClick={() => setSelectedMusicId(music.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                  selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
                )}
            >
                <div>
                  <p className="font-medium">{music.title}</p>
                </div>
                {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
        ))}
        </ScrollArea>
      </div>
      <Button onClick={handleStartSession} className="w-full bg-white text-primary hover:bg-white/90">
        <Play className="h-5 w-5 mr-2" />
        Start Session
      </Button>
    </div>
  );
}


function DetailsView({ task, onBack, onClose }: { task: Partial<Task>, onBack: () => void, onClose: () => void }) {
  const { addTask, selectedDate } = useTasks();
  const { musicLibrary } = useMusic();
  const [date, setDate] = useState<Date | undefined>(new Date(selectedDate));
  const [time, setTime] = useState(task.time || '10:00');
  const [duration, setDuration] = useState(task.duration || 30);
  const [selectedMusicId, setSelectedMusicId] = useState<string | undefined>(undefined);

  const handleAddTask = () => {
    let musicData: Task['music'] | undefined;
    if (selectedMusicId) {
        const standardMusic = meditationMusic.find(m => m.id === selectedMusicId);
        if (standardMusic) {
            musicData = standardMusic;
        } else {
            const custom = musicLibrary.find(m => m.id === selectedMusicId);
            if (custom) {
                musicData = { id: custom.id, title: custom.title, duration: 'Custom' };
            }
        }
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
      showPlay: !!musicData || task.icon === 'Timer',
      date: date ? format(date, 'yyyy-MM-dd') : selectedDate,
    });
    onClose();
  };
  
  const Icon = task.icon && iconMap[task.icon as string] ? iconMap[task.icon as string] : Pencil;

  return (
    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
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
          <Label htmlFor="date" className="text-white/80">Date</Label>
           <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/20 text-white placeholder:text-white/70 border-white/30",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
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
          <ScrollArea className="h-40">
          {meditationMusic.map((music) => (
            <button
              key={music.id}
              onClick={() => setSelectedMusicId(music.id === selectedMusicId ? undefined : music.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
                <p className="text-sm text-white/70">{music.duration}</p>
              </div>
              {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
          {musicLibrary.map((music) => (
            <button
              key={music.id}
              onClick={() => setSelectedMusicId(music.id === selectedMusicId ? undefined : music.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
              </div>
              {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
          </ScrollArea>
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
  const { addTask, addDefaultTask, selectedDate } = useTasks();
  const { musicLibrary } = useMusic();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(10);
  const [selectedMusicId, setSelectedMusicId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date(selectedDate));
  const [isDefault, setIsDefault] = useState(false);

  const handleAddTask = () => {
    if (title.trim()) {
      let musicData: Task['music'] | undefined;
        if (selectedMusicId) {
            const standardMusic = meditationMusic.find(m => m.id === selectedMusicId);
            if (standardMusic) {
                musicData = standardMusic;
            } else {
                const custom = musicLibrary.find(m => m.id === selectedMusicId);
                if (custom) {
                    musicData = { id: custom.id, title: custom.title, duration: 'Custom' };
                }
            }
        }
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.toUpperCase(),
        subtitle: `${duration} min`,
        icon: 'Pencil',
        streak: 0,
        completed: false,
        duration: duration,
        music: musicData,
        showPlay: !!musicData,
        date: date ? format(date, 'yyyy-MM-dd') : selectedDate,
      };

      addTask(newTask);

      if (isDefault) {
        addDefaultTask({ ...newTask, isDefault: true, id: `default-${Date.now()}` });
      }

      setTitle('');
      onClose();
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
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
        <Label htmlFor="date" className="text-white/80">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white/20 text-white placeholder:text-white/70 border-white/30",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
          <ScrollArea className="h-40">
          {meditationMusic.map((music) => (
            <button
              key={music.id}
              onClick={() => setSelectedMusicId(music.id === selectedMusicId ? undefined : music.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
                <p className="text-sm text-white/70">{music.duration}</p>
              </div>
              {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
          {musicLibrary.map((music) => (
            <button
              key={music.id}
              onClick={() => setSelectedMusicId(music.id === selectedMusicId ? undefined : music.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors",
                selectedMusicId === music.id ? "bg-white/30" : "hover:bg-white/10"
              )}
            >
              <div>
                <p className="font-medium">{music.title}</p>
              </div>
              {selectedMusicId === music.id && <Check className="h-5 w-5 text-white" />}
            </button>
          ))}
          </ScrollArea>
        </div>

      <div className="flex items-center justify-between rounded-lg p-3 bg-white/10">
        <div>
          <Label htmlFor="default-task" className="font-medium">Set as Default Task</Label>
          <p className="text-xs text-white/70">Add to your list of quick-add tasks.</p>
        </div>
        <Switch
          id="default-task"
          checked={isDefault}
          onCheckedChange={setIsDefault}
        />
      </div>

      <Button onClick={handleAddTask} className="w-full bg-white text-primary hover:bg-white/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Custom Task
      </Button>
    </div>
  );
}

function DefaultView({ onCustomClick, onDetailsClick, onMusicClick, onClose }: { onCustomClick: () => void, onDetailsClick: (task: Partial<Task>) => void, onMusicClick: (task: Partial<Task>) => void, onClose: () => void }) {
  const { defaultTasks, addTask, selectedDate } = useTasks();

  const getIconName = (IconComponent: React.ElementType) => {
    if (typeof IconComponent !== 'string') {
        const iconName = Object.keys(iconMap).find(key => iconMap[key] === IconComponent);
        return iconName || 'Pencil'; // Fallback icon
    }
    return IconComponent;
  };
  
  const handleHealthTaskClick = (task: {name: string, icon: React.ElementType, indicator?: string}) => {
    const iconName = getIconName(task.icon);

    if (task.name === 'Mindful Minutes') {
      onMusicClick({ title: task.name, icon: iconName });
      return;
    }
    
    // For simple tasks without details, go to details view with defaults
    onDetailsClick({
      title: task.name,
      icon: iconName,
      duration: task.name === 'Pomodoro' ? 25 : 10,
    });
  }

  const handleDefaultTaskClick = (task: Task) => {
    addTask({ ...task, id: Date.now().toString(), date: selectedDate, completed: false, streak: 0 });
    onClose();
  }

  return (
    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
       <div className="space-y-4">
        <p className="text-center text-xs text-white/70">
          Add a new health task or create a custom one.
        </p>

        <Button onClick={onCustomClick} variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white">
          <Pencil className="mr-2 h-4 w-4" />
          Create a Custom Task
        </Button>
        
        {defaultTasks.length > 0 && (
          <>
            <h3 className="font-headline font-semibold text-white pt-4">
              YOUR DEFAULT TASKS:
            </h3>
             <div className="space-y-2">
              {defaultTasks.map((task) => {
                const Icon = iconMap[task.icon] || Pencil;
                return (
                  <button
                    key={task.id}
                    className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white/10"
                    onClick={() => handleDefaultTaskClick(task)}
                  >
                    <Icon />
                    <span className="flex-1 font-medium">{task.title.toUpperCase()}</span>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </button>
                )
              })}
            </div>
          </>
        )}


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
            const iconName = getIconName(Icon);
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
                        onDetailsClick({ title: name, icon: iconName, duration: name === 'Pomodoro' ? 25 : 10 });
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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

        {view === 'default' && <DefaultView onCustomClick={() => setView('custom')} onDetailsClick={handleDetailsClick} onMusicClick={handleMusicClick} onClose={handleClose} />}
        {view === 'custom' && <CustomTaskView onBack={handleBack} onClose={handleClose} />}
        {view === 'details' && selectedTask && <DetailsView task={selectedTask} onBack={handleBack} onClose={handleClose} />}
        {view === 'musicSelection' && selectedTask && <MusicSelectionView task={selectedTask} onBack={handleBack} onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
