
import * as React from 'react';
import { TreePine, Trees, Bird, Home, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForestGridProps {
  completedTasksCount: number;
}

const GRID_SIZE = 100; // 10x10 grid

const forestElements = [
  { icon: Trees, color: 'text-green-600 dark:text-green-400' },
  { icon: TreePine, color: 'text-emerald-700 dark:text-emerald-500' },
  { icon: Trees, color: 'text-lime-700 dark:text-lime-500' },
  { icon: TreePine, color: 'text-green-700 dark:text-green-500' },
];

const specialElements = [
  { icon: Home, color: 'text-yellow-600 dark:text-yellow-400' }, // Represents a significant milestone
  { icon: Bird, color: 'text-sky-500 dark:text-sky-400' }, // Represents consistency
  { icon: Award, color: 'text-amber-500 dark:text-amber-400' }, // Represents high achievement
];

// Simple pseudo-random but deterministic generator
const a = 1664525;
const c = 1013904223;
const m = 2**32;
let seed = 1;
const pseudoRandom = () => {
    seed = (a * seed + c) % m;
    return seed / m;
}

const gridItems = Array.from({ length: GRID_SIZE }).map((_, index) => {
    const position = {
        top: `${Math.floor(pseudoRandom() * 90) + 5}%`,
        left: `${Math.floor(pseudoRandom() * 90) + 5}%`,
    };
    const size = Math.floor(pseudoRandom() * 24) + 24; // size between 24 and 48
    const delay = pseudoRandom() * 1.5; // animation delay
    return { position, size, delay };
});


export function ForestGrid({ completedTasksCount }: ForestGridProps) {
  return (
    <div className="relative aspect-[16/9] w-full rounded-md bg-gradient-to-br from-lime-100 to-green-200 dark:from-lime-900/50 dark:to-green-900/70 overflow-hidden">
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a0d990\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      {completedTasksCount === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <Trees className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="font-headline font-semibold text-lg text-foreground">Your forest is waiting to grow.</h3>
            <p className="max-w-xs">Complete tasks on the dashboard to plant your first tree and start building your legacy.</p>
        </div>
      ) : (
        gridItems.slice(0, completedTasksCount).map((item, index) => {
          let Element;
          if ((index + 1) % 15 === 0) { // Every 15th task is a major milestone
            Element = specialElements[2];
          } else if ((index + 1) % 5 === 0) { // Every 5th task is a special element
            Element = specialElements[index/5 % 2];
          } else {
            Element = forestElements[index % forestElements.length];
          }

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-in fade-in zoom-in-50"
              style={{ 
                  top: item.position.top, 
                  left: item.position.left, 
                  animationDelay: `${item.delay}s`,
                  zIndex: Math.floor(parseFloat(item.position.top)),
                }}
            >
              <Element.icon
                className={cn('drop-shadow-lg', Element.color)}
                style={{ width: item.size, height: item.size }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
