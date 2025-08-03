
'use client';
import { useTasks } from '@/context/task-context';
import { TaskItem } from './task-item';
import Link from 'next/link';

export function TaskGrid() {
  const { tasks, selectedDate } = useTasks();

  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-12 text-center text-white">
        <h3 className="font-headline text-lg font-semibold">No tasks for this day!</h3>
        <p className="text-sm text-white/70">
          Select another day or add a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      {filteredTasks.map((task) => (
        <Link key={task.id} href={`/session/${task.id}`} className="no-underline">
          <TaskItem
            {...task}
          />
        </Link>
      ))}
    </div>
  );
}
