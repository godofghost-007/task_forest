
'use client';
import { useTasks } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ForestGrid } from '@/components/forest/forest-grid';
import { AppLayout } from '@/components/layout/app-layout';

export default function ForestPage() {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(task => task.completed);
  const longestStreak = Math.max(0, ...tasks.map(t => t.streak));

  return (
    <AppLayout>
      <div className="h-full w-full bg-secondary p-4 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Your Forest Village
            </h1>
            <p className="text-muted-foreground">
              A visualization of your hard work and dedication. Watch it grow!
            </p>
          </header>

          <Card className="overflow-hidden shadow-lg bg-green-100/50 dark:bg-green-900/20">
            <CardContent className="p-2 sm:p-4">
              <ForestGrid completedTasksCount={completedTasks.length} />
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{completedTasks.length} Total Trees</CardTitle>
                <CardDescription>From completed tasks</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{longestStreak} Day Streak</CardTitle>
                <CardDescription>Longest current streak</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle className="font-headline">{tasks.filter(t => !t.completed).length} Tasks Left</CardTitle>
                <CardDescription>For today</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
