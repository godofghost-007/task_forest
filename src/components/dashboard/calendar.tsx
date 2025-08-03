'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const getMonthName = (month: number) => new Date(0, month).toLocaleString('en-US', { month: 'long' });

export function CalendarView() {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };
  
  const numDays = daysInMonth(month, year);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Mock data for completed tasks
  const completedDays = [3, 4, 8, 12, 15, 16, 17, 22];

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-xl font-semibold">
          {getMonthName(month)} {year}
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
        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: numDays }).map((_, day) => (
            <div key={day} className="relative flex items-center justify-center p-2 text-sm">
              <span>{day + 1}</span>
              {completedDays.includes(day + 1) && (
                <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
