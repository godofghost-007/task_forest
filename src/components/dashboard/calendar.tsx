
'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/context/task-context';
import { format, parse, startOfMonth, addMonths, subMonths, getDaysInMonth, getDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const { tasks, selectedDate, setSelectedDate } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = format(currentDate, 'MMMM');

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    setCurrentDate(newDate);
  }
  
  const numDays = getDaysInMonth(currentDate);
  const firstDayOfWeek = getDay(startOfMonth(currentDate));

  const daysWithTasks = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach(task => {
        dates.add(task.date);
    });
    return dates;
  }, [tasks]);

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-xl font-semibold">
          {monthName} {year}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-white hover:bg-white/20 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-white hover:bg-white/20 hover:text-white">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-white/70">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: numDays }).map((_, day) => {
            const dayNumber = day + 1;
            const dateString = format(new Date(year, month, dayNumber), 'yyyy-MM-dd');
            const hasTasks = daysWithTasks.has(dateString);
            const isSelected = selectedDate === dateString;

            return (
              <button 
                key={dayNumber} 
                onClick={() => handleDateSelect(dayNumber)}
                className={cn(
                  "relative flex items-center justify-center p-2 text-sm rounded-full aspect-square transition-colors",
                  "hover:bg-white/20",
                   isSelected && "bg-primary text-primary-foreground font-bold"
                )}
              >
                <span>{dayNumber}</span>
                {hasTasks && !isSelected && (
                  <div className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
