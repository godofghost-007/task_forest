import { TaskItem, type Task } from './task-item';

const tasks: Task[] = [
  {
    icon: 'Scissors',
    title: 'WRITE JOURNAL',
    streak: 2,
    subtitle: 'Daily',
  },
  {
    icon: 'PenTool',
    title: 'MOBILISE',
    streak: 4,
    subtitle: '10:00',
  },
  {
    icon: 'Leaf',
    title: 'MEDITATE',
    streak: 0,
    subtitle: '9:00',
    showPlay: true,
  },
  {
    icon: 'BookOpen',
    title: 'WRITE NOVEL',
    streak: 3,
    subtitle: 'Daily*',
  },
  {
    icon: 'RunIcon',
    title: 'RUN 10 MILES',
    streak: 6,
    subtitle: 'Weekly*',
  },
  {
    icon: 'Pill',
    title: 'TAKE VITAMINS',
    streak: 4,
    subtitle: 'Daily*',
  },
];

export function TaskGrid() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      {tasks.map((task) => (
        <TaskItem key={task.title} {...task} />
      ))}
    </div>
  );
}
