
'use client';

import * as React from 'react';
import { useTasks } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/app-layout';

// Helper to get the last 7 days
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d,
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
};

export default function ProgressPage() {
  const { tasks } = useTasks();
  
  const completedTasks = tasks.filter((task) => task.completed);
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const chartData = React.useMemo(() => {
    const last7Days = getLast7Days();
    const dailyCompletedTasks = tasks.filter((task) => task.completed);

    // This is a placeholder for real completion data over time.
    // In a real app, you'd store completion dates for each task.
    return last7Days.map((day, index) => {
      // Simple mock data logic
      let completedCount = 0;
      if (index === 6) { // Today
        // For today, we use the actual completed tasks from context
        completedCount = dailyCompletedTasks.length;
      } else if (index === 5) {
        // Mock data for yesterday
        completedCount = Math.floor(Math.random() * (tasks.filter(t => !t.completed).length / 2 + 1));
      } else {
        // Mock data for other past days
        completedCount = Math.floor(Math.random() * 3);
      }
      return {
        name: day.name,
        total: completedCount,
      };
    });
  }, [tasks]);


  return (
    <AppLayout>
      <div className="h-full w-full bg-secondary p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-bold text-foreground">
              Your Progress
            </h1>
            <p className="text-muted-foreground">
              A look at your accomplishments and consistency.
            </p>
          </header>

          <div className="grid gap-8">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline">Overall Completion</CardTitle>
                      <CardDescription>
                          You've completed {completedTasks.length} out of {totalTasks} tasks.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Progress value={completionPercentage} className="h-3" />
                      <p className="mt-2 text-right text-sm font-medium text-primary">
                          {Math.round(completionPercentage)}% Complete
                      </p>
                  </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Weekly Activity</CardTitle>
                <CardDescription>
                  Tasks completed over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Work Description</CardTitle>
                <CardDescription>A log of your completed tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                {completedTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {completedTasks.map((task) => (
                      <li key={task.id} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.subtitle}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No tasks completed yet. Keep going!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
