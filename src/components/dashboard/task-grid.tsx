'use client';
import { useTasks } from '@/context/task-context';
import { TaskItem } from './task-item';

export function TaskGrid() {
  const { tasks, completeTask } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-12 text-center text-white">
        <h3 className="font-headline text-lg font-semibold">No tasks yet!</h3>
        <p className="text-sm text-white/70">
          Click "New Task" to add your first goal.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          {...task}
          onComplete={() => completeTask(task.id)}
        />
      ))}
    </div>
  );
}
