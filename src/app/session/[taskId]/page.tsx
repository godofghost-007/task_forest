
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/context/task-context';
import type { Task } from '@/context/task-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Music, Timer, Pause, Play, RotateCcw } from 'lucide-react';
import Image from 'next/image';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function TaskSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { tasks, completeTask } = useTasks();
  const [task, setTask] = React.useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const taskId = params.taskId as string;
  
  const initialDuration = React.useMemo(() => {
    const currentTask = tasks.find((t) => t.id === taskId);
    return (currentTask?.duration || 0) * 60;
  }, [taskId, tasks]);


  React.useEffect(() => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask) {
      setTask(currentTask);
      setTimeLeft((currentTask.duration || 0) * 60);
      if (currentTask.completed) {
        setIsCompleted(true);
      }
    } else {
      // Handle task not found, maybe redirect
      router.push('/');
    }
  }, [taskId, tasks, router]);

  React.useEffect(() => {
    if (!task || isCompleted || timeLeft <= 0 || isPaused) {
        if (timeLeft <= 0 && task && !task.completed) {
            setIsCompleted(true);
        }
        return;
    };

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [task, timeLeft, isCompleted, isPaused]);

  React.useEffect(() => {
    if (audioRef.current) {
        if (!isCompleted && task?.music && !isPaused) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isCompleted, isPaused, task?.music])


  const handleCompleteTask = () => {
    if (task && !task.completed) {
      completeTask(task.id);
    }
    router.push('/');
  };

  const handleResetTimer = () => {
    setTimeLeft(initialDuration);
    setIsPaused(false);
  };
  

  if (!task) {
    return <div className="flex h-full w-full items-center justify-center bg-secondary"><p>Loading task...</p></div>;
  }
  
  const musicUrl = task.music?.id ? `/music/${task.music.id}.mp3` : null;

  return (
    <div className="relative h-dvh w-full">
      <Image
        src="https://placehold.co/1920x1080"
        alt="Calm mountain scenery"
        data-ai-hint="calm mountain scenery"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-black/30 text-white backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <h1 className="font-headline text-2xl font-bold uppercase tracking-wider">{task.title}</h1>
            <p className="text-white/80">{task.subtitle}</p>
            
            <div className="my-8 flex items-center justify-center gap-2 text-6xl font-bold font-mono">
                <Timer className="h-12 w-12" />
                <span>{formatTime(timeLeft)}</span>
            </div>
            
            {!isCompleted && !task.completed && (
                <div className="flex justify-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                        {isPaused ? <Play className="h-8 w-8" /> : <Pause className="h-8 w-8" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleResetTimer} className="h-14 w-14 rounded-full bg-white/20 text-white hover:bg-white/30">
                        <RotateCcw className="h-7 w-7" />
                    </Button>
                </div>
            )}


            {isCompleted && !task.completed && (
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

            {task.music && musicUrl && (
                <div className="mt-6 flex items-center justify-center gap-2 text-white/70">
                    <Music className="h-4 w-4" />
                    <p>Playing: {task.music.title}</p>
                    <audio ref={audioRef} src={musicUrl} loop />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
