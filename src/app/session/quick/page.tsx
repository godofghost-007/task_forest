
'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Pause, Play, RotateCcw, Rewind, FastForward, Music, Settings, X, ChevronDown, Check } from 'lucide-react';
import { PlantGrowth } from '@/components/session/plant-growth';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { meditationMusic } from '@/components/dashboard/add-task-modal';
import { cn } from '@/lib/utils';
import type { Task } from '@/context/task-context';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function QuickSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Session State from URL
  const [title, setTitle] = React.useState(searchParams.get('title') || 'Quick Session');
  const [subtitle, setSubtitle] = React.useState(searchParams.get('subtitle') || 'Focus time');
  const initialDuration = parseInt(searchParams.get('duration') || '10', 10) * 60;
  
  // Timer State
  const [duration, setDuration] = React.useState(initialDuration);
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isActive, setIsActive] = React.useState(true);

  // Music State
  const [musicId, setMusicId] = React.useState(searchParams.get('musicId'));
  const [musicDataUrl, setMusicDataUrl] = React.useState(searchParams.get('musicDataUrl'));
  const [musicTitle, setMusicTitle] = React.useState(searchParams.get('musicTitle'));
  const [musicUrl, setMusicUrl] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(true);

  const [tempDuration, setTempDuration] = React.useState(duration / 60);
  const [tempMusic, setTempMusic] = React.useState<Task['music'] | null>(null);

  React.useEffect(() => {
    if (musicDataUrl) {
      setMusicUrl(musicDataUrl);
    } else if (musicId) {
      setMusicUrl(`/music/${musicId}.mp3`);
    } else {
        setMusicUrl(null);
    }
  }, [musicId, musicDataUrl]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (isActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      // Optionally play a sound
    }
    return () => clearInterval(timerId);
  }, [isActive, timeLeft]);

  React.useEffect(() => {
    if (audioRef.current) {
        if (isAudioPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isAudioPlaying, musicUrl]);

  const handleToggleTimer = () => setIsActive(!isActive);

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  };
  
  const handleSettingsSave = () => {
    const newDurationInSeconds = tempDuration * 60;
    setDuration(newDurationInSeconds);
    setTimeLeft(newDurationInSeconds);

    if (tempMusic) {
      if (tempMusic.fileDataUrl) {
        setMusicUrl(tempMusic.fileDataUrl);
        setMusicDataUrl(tempMusic.fileDataUrl);
        setMusicId(null);
      } else if (tempMusic.id) {
        setMusicUrl(`/music/${tempMusic.id}.mp3`);
        setMusicId(tempMusic.id);
        setMusicDataUrl(null);
      }
      setMusicTitle(tempMusic.title);
      setSubtitle(tempMusic.title);
    }
  };

  const handleAudioPlayPause = () => setIsAudioPlaying(!isAudioPlaying);

  const handleAudioSeek = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };
  
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  
  return (
    <div className="relative h-dvh w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080/a2d2ff/a2d2ff.png')", filter: 'blur(8px)' }}
        data-ai-hint="calm mountain scenery"
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
        
        <div className="absolute top-4 right-4 flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-black/30 text-white hover:bg-black/50">
                        <Settings className="h-6 w-6"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/80 backdrop-blur-md border-white/20 text-foreground">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Session Settings</h4>
                            <p className="text-sm text-muted-foreground">
                                Adjust your session on the fly.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="duration">Duration (min)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    defaultValue={tempDuration}
                                    onChange={(e) => setTempDuration(parseInt(e.target.value, 10))}
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Music</Label>
                                <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
                                {meditationMusic.map((music) => (
                                    <button
                                        key={music.id}
                                        onClick={() => setTempMusic(music)}
                                        className={cn("w-full text-left p-2 rounded-md text-sm", tempMusic?.id === music.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50')}
                                    >
                                        {music.title}
                                    </button>
                                ))}
                                </div>
                            </div>
                        </div>
                         <PopoverClose asChild>
                            <Button onClick={handleSettingsSave}>Apply Changes</Button>
                        </PopoverClose>
                    </div>
                </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="bg-black/30 text-white hover:bg-black/50">
                <X className="h-6 w-6"/>
            </Button>
        </div>
        
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
           <PlantGrowth progress={progress} />
        </div>


        <Card className="flex items-center justify-center w-96 h-96 rounded-full bg-black/30 text-white backdrop-blur-sm border-white/20 self-center">
          <CardContent className="p-6 text-center flex flex-col items-center justify-center">
            <h1 className="font-headline text-2xl font-bold uppercase tracking-wider">{title}</h1>
            <p className="text-white/80">{subtitle}</p>
            
            <div className="my-4 flex items-center justify-center gap-2 text-6xl font-bold font-mono">
                <Timer className="h-12 w-12" />
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
                        <p className="truncate max-w-[200px]">Playing: {musicTitle}</p>
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
                    />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    