
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/context/task-context';
import type { Task } from '@/context/task-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Music, Timer, Pause, Play, RotateCcw, Rewind, FastForward, Coffee } from 'lucide-react';
import { PlantGrowth } from '@/components/session/plant-growth';
import { AppLayout } from '@/components/layout/app-layout';
import { useBackgrounds } from '@/context/background-context';
import { cn } from '@/lib/utils';
import { useMusic } from '@/context/music-context';
import { meditationMusic } from '@/components/dashboard/add-task-modal';


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

export default function TaskSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { tasks, completeTask } = useTasks();
  const { taskSessionBackground } = useBackgrounds();
  const { musicLibrary } = useMusic();
  const [task, setTask] = React.useState<Task | null>(null);

  // Pomodoro State
  const [sessionType, setSessionType] = React.useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [pomodoroCount, setPomodoroCount] = React.useState(0);

  const [isSessionCompleted, setIsSessionCompleted] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [musicUrl, setMusicUrl] = React.useState<string | null>(null);

  const taskId = params.taskId as string;
  
  const [background, setBackground] = React.useState<{ type: 'image' | 'video', url: string, hint?: string }>({ type: 'image', url: '', hint: ''});

  React.useEffect(() => {
    if (taskSessionBackground) {
      setBackground(taskSessionBackground);
    } else {
      setBackground(defaultBackgrounds[Math.floor(Math.random() * defaultBackgrounds.length)]);
    }
  }, [taskSessionBackground]);

  const durations = React.useMemo(() => {
    const workDuration = task?.duration || 25;
    return {
        work: workDuration * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    }
  }, [task?.duration]);


  React.useEffect(() => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask) {
      setTask(currentTask);
      const initialTime = (currentTask.duration || 25) * 60;
      setTimeLeft(initialTime);
      
      if (currentTask.completed) {
        setIsSessionCompleted(true);
        setIsActive(false);
      }
      
      if (currentTask.music) {
        if (currentTask.music.id) {
            const standardMusic = meditationMusic.find(m => m.id === currentTask.music?.id);
            if (standardMusic) {
                 setMusicUrl(`/music/${currentTask.music.id}.mp3`);
            } else {
                 const custom = musicLibrary.find(m => m.id === currentTask.music?.id);
                 if (custom) {
                    setMusicUrl(custom.url);
                 }
            }
        }
      }

    } else {
      router.push('/');
    }
  }, [taskId, tasks, router, musicLibrary]);

  React.useEffect(() => {
    if (task && !task.completed) {
      setIsActive(true);
    }
  }, [task]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (isActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (sessionType === 'work') {
        setIsSessionCompleted(true);
        setPomodoroCount(prev => prev + 1);
        // Logic for next session
        const nextSession: SessionType = pomodoroCount > 0 && pomodoroCount % 4 === 0 ? 'longBreak' : 'longBreak';
        setSessionType(nextSession);
        setTimeLeft(durations[nextSession]);

      } else { // Break finished
        setSessionType('work');
        setTimeLeft(durations.work);
      }
      // Optionally play a sound
    }

    return () => clearInterval(timerId);
  }, [isActive, timeLeft, sessionType, durations, pomodoroCount]);

  React.useEffect(() => {
    if (audioRef.current) {
        if (isActive && isAudioPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isActive, isAudioPlaying, musicUrl]);
  
  React.useEffect(() => {
    if (task?.music) {
        setIsAudioPlaying(isActive);
    }
  }, [isActive, task?.music]);


  const handleCompleteTask = () => {
    if (task && !task.completed) {
      completeTask(task.id);
    }
    router.push('/');
  };

  const handleToggleTimer = () => {
    if (!task?.completed) {
        setIsActive(!isActive);
    }
  };

  const handleResetTimer = () => {
    if (task?.completed) return;
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(durations.work);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
    }
  };

  const handleAudioPlayPause = () => {
    if (isActive) {
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleAudioSeek = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  if (!task) {
    return <AppLayout><div className="flex h-full w-full items-center justify-center bg-secondary"><p>Loading task...</p></div></AppLayout>;
  }
  
  const progress = durations[sessionType] > 0 ? (durations[sessionType] - timeLeft) / durations[sessionType] : 0;
  
  const getSessionTitle = () => {
    switch (sessionType) {
        case 'work': return task.title;
        case 'shortBreak': return 'Short Break';
        case 'longBreak': return 'Long Break';
    }
  }

  return (
    <AppLayout>
      <div className="relative h-dvh w-full">
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
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
          
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none -z-10">
             {!taskSessionBackground && <PlantGrowth progress={sessionType === 'work' ? progress : 0} />}
          </div>


          <Card className="flex items-center justify-center w-96 h-96 rounded-full bg-black/30 text-white border-white/20 self-center">
            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
              <h1 className="font-headline text-2xl font-bold uppercase tracking-wider">{getSessionTitle()}</h1>
              {sessionType === 'work' && <p className="text-white/80">{task.subtitle}</p>}
              
              <div className="my-4 flex items-center justify-center gap-2 text-6xl font-bold font-mono">
                  {sessionType === 'work' ? <Timer className="h-12 w-12" /> : <Coffee className="h-12 w-12" />}
                  <span>{formatTime(timeLeft)}</span>
              </div>
              
              {!isSessionCompleted && !task.completed && (
                  <div className="flex justify-center gap-4 mb-4">
                      <Button variant="ghost" size="icon" onClick={handleToggleTimer} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleResetTimer} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                          <RotateCcw className="h-7 w-7" />
                      </Button>
                  </div>
              )}


              {isSessionCompleted && !task.completed && (
                  <div className="space-y-4">
                      <p className="font-semibold text-lg text-green-300">Session Complete!</p>
                      <Button onClick={handleCompleteTask} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <Check className="mr-2 h-5 w-5" />
                          Mark as Done
                      </Button>
                  </div>
              )}

              {task.completed && (
                   <div className="space-y-4">
                      <p className="font-semibold text-lg text-green-300">Task Already Completed!</p>
                      <Button onClick={() => router.push('/')} size="lg" className="w-full">
                          Back to Dashboard
                      </Button>
                  </div>
              )}

              {task.music && musicUrl && sessionType === 'work' && (
                  <div className="mt-2 text-white/70">
                      <div className="flex items-center justify-center gap-2">
                          <Music className="h-4 w-4" />
                          <p className="truncate max-w-[200px]">Playing: {task.music.title}</p>
                      </div>
                      <div className="flex justify-center items-center gap-2 mt-1">
                          <Button variant="ghost" size="icon" onClick={() => handleAudioSeek(-10)}>
                             <Rewind className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleAudioPlayPause}>
                             {isAudioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleResetTimer}>
                             <RotateCcw className="h-5 w-5" />
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
                          onEnded={() => {
                            if (isActive && audioRef.current) {
                                audioRef.current.play();
                            } else {
                                setIsAudioPlaying(false);
                            }
                          }}
                          loop 
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
