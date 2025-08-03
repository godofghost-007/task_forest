
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

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type SessionType = 'work' | 'shortBreak' | 'longBreak';

const backgrounds = [
    { url: 'https://placehold.co/1920x1080/2c3e50/ffffff.png', hint: 'rainy night city' },
    { url: 'https://placehold.co/1920x1080/34495e/ffffff.png', hint: 'cozy coffee shop' },
    { url: 'https://placehold.co/1920x1080/8e44ad/ffffff.png', hint: 'lofi study room' },
    { url: 'https://placehold.co/1920x1080/2980b9/ffffff.png', hint: 'peaceful ocean' },
    { url: 'https://placehold.co/1920x1080/16a085/ffffff.png', hint: 'serene forest' },
    { url: 'https://placehold.co/1920x1080/a2d2ff/a2d2ff.png', hint: 'calm mountain scenery' }
];

export default function TaskSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { tasks, completeTask } = useTasks();
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
  
  const [background, setBackground] = React.useState({ url: '', hint: ''});

  React.useEffect(() => {
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  }, []);

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
        if (currentTask.music.fileDataUrl) {
           setMusicUrl(currentTask.music.fileDataUrl);
        } else if (currentTask.music.id) {
           setMusicUrl(`/music/${currentTask.music.id}.mp3`);
        }
      }

    } else {
      router.push('/');
    }
  }, [taskId, tasks, router]);

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
        setIsSessionCompleted(true);
        setPomodoroCount(prev => prev + 1);
        // Logic for next session
        const nextSession: SessionType = pomodoroCount > 0 && pomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak';
        setSessionType(nextSession);
        setTimeLeft(durations[nextSession]);

      } else { // Break finished
        setSessionType('work');
        setTimeLeft(durations.work);
      }
      // Optionally play a sound
    }

    return () => clearInterval(timerId);
  }, [isActive, timeLeft, sessionType, pomodoroCount, durations]);

  React.useEffect(() => {
    if (audioRef.current) {
        if (isAudioPlaying && !isSessionCompleted) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isAudioPlaying, isSessionCompleted]);


  const handleCompleteTask = () => {
    if (task && !task.completed) {
      completeTask(task.id);
    }
    router.push('/');
  };

  const handleToggleTimer = () => {
    if (!task?.completed) {
        setIsActive(!isActive);
        if (task?.music) {
            setIsAudioPlaying(!isActive);
        }
    }
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(durations.work);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
    }
  };

  const handleAudioPlayPause = () => {
    setIsAudioPlaying(!isAudioPlaying);
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
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${background.url}')`, filter: 'blur(4px)' }}
          data-ai-hint={background.hint}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
             <PlantGrowth progress={sessionType === 'work' ? progress : 0} />
          </div>


          <Card className="flex items-center justify-center w-96 h-96 rounded-full bg-black/30 text-white backdrop-blur-sm border-white/20 self-center">
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
                          onEnded={() => setIsAudioPlaying(false)}
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

    