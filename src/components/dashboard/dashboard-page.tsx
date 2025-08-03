import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddTaskModal } from '@/components/dashboard/add-task-modal';
import { CalendarView } from '@/components/dashboard/calendar';
import { TaskGrid } from '@/components/dashboard/task-grid';

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-gradient-orange-start/80 to-gradient-orange-end/80 text-white">
      <header className="flex items-center justify-between p-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-white">
            Task Forest
          </h1>
          <p className="text-white/80">Let's make today productive!</p>
        </div>
        <AddTaskModal>
          <Button variant="secondary" size="lg" className="gap-2 bg-white/20 text-white hover:bg-white/30">
            <Plus className="h-5 w-5" />
            New Task
          </Button>
        </AddTaskModal>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-8">
          <CalendarView />
          <TaskGrid />
        </div>
      </main>
    </div>
  );
}
