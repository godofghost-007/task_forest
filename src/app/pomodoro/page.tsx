
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Timer, Pause, Play, RotateCcw, Rewind, FastForward, Music, Settings, X, Coffee, BrainCircuit, Check, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { PlantGrowth } from '@/components/session/plant-growth';
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { meditationMusic } from '@/components/dashboard/add-task-modal';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/app-layout';
import { useTasks } from '@/context/task-context';
import { format } from 'date-fns';
import { useBackgrounds } from '@/context/background-context';
import { useMusic } from '@/context/music-context';
import { ScrollArea } from '@/components/ui/scroll-area';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type SessionType = 'work' | 'shortBreak' | 'longBreak';

const defaultBackgrounds = [
    { type: 'image', url: 'https://placehold.co/1920x1080/2c3e50/ffffff.png', hint: 'rainy night city' },
    { type: 'image', url: 'https://placehold.co/1920x1080/34495e/ffffff.png', hint: 'cozy coffee shop' },
    { type: 'image', url: 'https://placehold.co/1920x1080/8e44ad/ffffff.png', hint: 'lofi study room' },
    { type: 'image', url: 'https://placehold.co/1920x1080/2980b9/ffffff.png', hint: 'peaceful ocean' },
    { type: 'image', url: 'https://placehold.co/1920x1080/16a085/ffffff.png', hint: 'serene forest' },
    { type: 'image', url: 'https://placehold.co/1920x1080/a2d2ff/a2d2ff.png', hint: 'calm mountain scenery' }
];

export default function PomodoroPage() {
  const router = useRouter();
  const { addTask } = useTasks();
  const { pomodoroBackground, setPomodoroBackground, backgroundLibrary, addBackgroundToLibrary, isUploading: isBgUploading } = useBackgrounds();
  const { musicLibrary } = useMusic();
  const bgFileInputRef = React.useRef<HTMLInputElement>(null);

  // Pomodoro State
  const [durations, setDurations] = React.useState({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });
  const [sessionType, setSessionType] = React.useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = React.useState(durations.work);
  const [isActive, setIsActive] = React.useState(false);
  const [pomodoroCount, setPomodoroCount] = React.useState(0);
  const [longBreakInterval, setLongBreakInterval] = React.useState(4);
  
  // Temp state for settings popover
  const [tempDurations, setTempDurations] = React.useState({
      work: 25,
      shortBreak: 5,
      longBreak: 15,
  });
  const [tempLongBreakInterval, setTempLongBreakInterval] = React.useState(4);

  // Background state
  const [background, setBackground] = React.useState<{ type: 'image' | 'video', url: string, hint?: string }>({ type: 'image', url: '', hint: ''});

  React.useEffect(() => {
    if (pomodoroBackground) {
        setBackground(pomodoroBackground);
    } else {
        setBackground(defaultBackgrounds[Math.floor(Math.random() * defaultBackgrounds.length)]);
    }
  }, [pomodoroBackground]);

  // Music State
  const [music, setMusic] = React.useState<any | null>(null);
  const [musicUrl, setMusicUrl] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [selectedMusicId, setSelectedMusicId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedMusicId) {
        const standardMusic = meditationMusic.find(m => m.id === selectedMusicId);
        if (standardMusic) {
            setMusicUrl(`/music/${standardMusic.id}.mp3`);
            setMusic(standardMusic);
            return;
        }
        const custom = musicLibrary.find(m => m.id === selectedMusicId);
        if (custom) {
            setMusicUrl(custom.url);
            setMusic(custom);
            return;
        }
    }
    setMusicUrl(null);
    setMusic(null);
  }, [selectedMusicId, musicLibrary]);

  React.useEffect(() => {
    setTimeLeft(durations[sessionType]);
    setIsActive(false);
  }, [sessionType, durations]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (isActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      if (sessionType === 'work') {
        const newPomodoroCount = pomodoroCount + 1;
        setPomodoroCount(newPomodoroCount);
        
        // Add a completed Pomodoro task to the context to grow the forest
        addTask({
            id: `pomodoro-${Date.now()}`,
            title: 'Pomodoro Session',
            subtitle: `${durations.work / 60} min focus`,
            icon: 'Timer',
            completed: true,
            streak: 1, // Each Pomodoro contributes a "streak" of 1
            date: format(new Date(), 'yyyy-MM-dd'),
        });

        const nextSession: SessionType = newPomodoroCount % longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
        setSessionType(nextSession);
      } else { // Break finished
        setSessionType('work');
      }
    }
    return () => clearInterval(timerId);
  }, [isActive, timeLeft]);

  React.useEffect(() => {
    if (audioRef.current) {
        if (isActive && isAudioPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isActive, isAudioPlaying, musicUrl]);

  const handleToggleTimer = () => setIsActive(!isActive);

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[sessionType]);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  };
  
  const handleSettingsSave = () => {
    const newDurations = {
        work: tempDurations.work * 60,
        shortBreak: tempDurations.shortBreak * 60,
        longBreak: tempDurations.longBreak * 60,
    };
    setDurations(newDurations);
    setLongBreakInterval(tempLongBreakInterval);
    if (!isActive) {
        setTimeLeft(newDurations[sessionType]);
    }
  };

  const handleAudioPlayPause = () => setIsAudioPlaying(!isAudioPlaying);

  const handleAudioSeek = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const handleBgFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        await addBackgroundToLibrary({
            type: file.type.startsWith('video') ? 'video' : 'image',
            title: file.name,
            file: file,
        }, true);
    }
  };
  
  const progress = durations[sessionType] > 0 ? (durations[sessionType] - timeLeft) / durations[sessionType] : 0;
  
  const recentBackgrounds = [...backgroundLibrary].reverse().slice(0, 3);

  const getSessionTitle = () => {
    switch(sessionType) {
        case 'work': return 'Focus Session';
        case 'shortBreak': return 'Short Break';
        case 'longBreak': return 'Long Break';
    }
  }

  const getSessionIcon = () => {
    switch(sessionType) {
        case 'work': return <BrainCircuit className="h-12 w-12" />;
        case 'shortBreak': return <Coffee className="h-12 w-12" />;
        case 'longBreak': return <Timer className="h-12 w-12" />;
    }
  }

  return (
    <AppLayout>
    <div className="relative h-full w-full">
      {background.type === 'image' ? (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
              backgroundImage: `url('${background.url}')`,
          }}
          data-ai-hint={background.hint || 'background'}
        />
      ) : (
        <video
            src={background.url}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
        />
      )}
      <div className={cn(
          "absolute inset-0 transition-colors duration-1000",
          sessionType === 'work' && 'bg-black/50',
          sessionType === 'shortBreak' && 'bg-blue-900/50',
          sessionType === 'longBreak' && 'bg-indigo-900/50',
      )} />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
        
        <div className="absolute top-4 right-4 flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50">
                        <ImageIcon className="h-6 w-6"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/80 backdrop-blur-md border-white/20 text-foreground">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Change Background</h4>
                        <p className="text-sm text-muted-foreground">Select a background from your library.</p>
                    </div>
                     <input
                        type="file"
                        ref={bgFileInputRef}
                        className="hidden"
                        accept="image/png,image/jpeg,video/mp4,video/webm"
                        onChange={handleBgFileChange}
                        disabled={isBgUploading}
                    />
                    <Button size="sm" onClick={() => bgFileInputRef.current?.click()} disabled={isBgUploading} className="w-full mt-4">
                        {isBgUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4" />}
                        <span className="ml-2">Upload from Device</span>
                    </Button>
                    <ScrollArea className="h-60 mt-4">
                        <div className="grid grid-cols-2 gap-2 pr-2">
                            <button onClick={() => setPomodoroBackground(null)} className="aspect-video w-full rounded-md border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary">
                                Use Default
                            </button>
                            {recentBackgrounds.map(bg => (
                                <button key={bg.id} onClick={() => setPomodoroBackground(bg)} className="relative aspect-video w-full rounded-md overflow-hidden group">
                                    {bg.type === 'image' ? (
                                        <img src={bg.url} alt="background" className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={bg.url} muted loop className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                        <Check className="h-8 w-8 text-white"/>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50">
                        <Settings className="h-6 w-6"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/80 backdrop-blur-md border-white/20 text-foreground">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Pomodoro Settings</h4>
                            <p className="text-sm text-muted-foreground">
                                Adjust your session durations (in minutes).
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="work-duration">Work</Label>
                                <Input
                                    id="work-duration"
                                    type="number"
                                    defaultValue={tempDurations.work}
                                    onChange={(e) => setTempDurations(d => ({...d, work: parseInt(e.target.value, 10)}))}
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="short-break-duration">Short Break</Label>
                                <Input
                                    id="short-break-duration"
                                    type="number"
                                    defaultValue={tempDurations.shortBreak}
                                    onChange={(e) => setTempDurations(d => ({...d, shortBreak: parseInt(e.target.value, 10)}))}
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="long-break-duration">Long Break</Label>
                                <Input
                                    id="long-break-duration"
                                    type="number"
                                    defaultValue={tempDurations.longBreak}
                                    onChange={(e) => setTempDurations(d => ({...d, longBreak: parseInt(e.target.value, 10)}))}
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="long-break-interval">Long Break Interval</Label>
                                <Input
                                    id="long-break-interval"
                                    type="number"
                                    defaultValue={tempLongBreakInterval}
                                    onChange={(e) => setTempLongBreakInterval(parseInt(e.target.value, 10))}
                                    className="col-span-2 h-8"
                                    min={1}
                                />
                            </div>
                        </div>
                         <PopoverClose asChild>
                            <Button onClick={handleSettingsSave}>Apply Changes</Button>
                        </PopoverClose>
                    </div>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50">
                        <Music className="h-6 w-6"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/80 backdrop-blur-md border-white/20 text-foreground">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Select Music</h4>
                            <p className="text-sm text-muted-foreground">
                                Choose some background audio.
                            </p>
                        </div>
                        <ScrollArea className="max-h-60 overflow-y-auto space-y-1 pr-2">
                            <button
                                onClick={() => setSelectedMusicId(null)}
                                className={cn("w-full text-left p-2 rounded-md text-sm", !selectedMusicId ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50')}
                            >
                                None
                            </button>
                            {meditationMusic.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMusicId(m.id)}
                                    className={cn("w-full text-left p-2 rounded-md text-sm", selectedMusicId === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50')}
                                >
                                    {m.title}
                                </button>
                            ))}
                            {musicLibrary.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMusicId(m.id)}
                                    className={cn("w-full text-left p-2 rounded-md text-sm", selectedMusicId === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50')}
                                >
                                    {m.title}
                                </button>
                            ))}
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none -z-10">
           {!pomodoroBackground && <PlantGrowth progress={sessionType === 'work' ? progress : 0} />}
        </div>


        <Card className="flex items-center justify-center w-96 h-96 rounded-full bg-black/30 text-white border-white/20 self-center">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            
            <Tabs value={sessionType} onValueChange={(value) => setSessionType(value as SessionType)} className="w-[300px] mb-2">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                    <TabsTrigger value="longBreak">Long Break</TabsTrigger>
                </TabsList>
            </Tabs>

            <h1 className="font-headline text-2xl font-bold uppercase tracking-wider">{getSessionTitle()}</h1>
            
            <div className="my-4 flex items-center justify-center gap-2 text-6xl font-bold font-mono">
                {getSessionIcon()}
                <span>{formatTime(timeLeft)}</span>
            </div>
            
            <div className="flex justify-center gap-4 mb-4">
                <Button variant="ghost" size="icon" onClick={handleToggleTimer} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                    {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleResetTimer} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                    <RotateCcw className="h-7 w-7" />
                </Button>
            </div>

            {musicUrl && (
                <div className="mt-2 text-white/70">
                    <div className="flex items-center justify-center gap-2">
                        <Music className="h-4 w-4" />
                        <p className="truncate max-w-[200px]">Playing: {music?.title}</p>
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-1">
                        <Button variant="ghost" size="icon" onClick={() => handleAudioSeek(-10)}>
                           <Rewind className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleAudioPlayPause}>
                           {isAudioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAudioSeek(10)}>
                           <FastForward className="h-5 w-5" />
                        </Button>
                    </div>
                    <audio 
                        ref={audioRef} 
                        src={musicUrl}
                        onPlay={() => setIsAudioPlaying(true)}
                        onPause={() => setIsAudioPlaying(false)}
                        onEnded={() => setIsAudioPlaying(false)}
                        loop
                        controls
                        className='hidden'
                    />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}

    