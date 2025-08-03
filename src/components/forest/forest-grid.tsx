
import * as React from 'react';
import { TreePine, Trees, Bird, Home, Award, Star, Gem, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/context/task-context';

interface ForestGridProps {
  completedTasks: Task[];
}

const GRID_SIZE = 150; // Increased grid size for more items

// --- Elements Definition ---
const baseTrees = [
  { icon: Trees, color: 'text-green-600 dark:text-green-400' },
  { icon: TreePine, color: 'text-emerald-700 dark:text-emerald-500' },
  { icon: Trees, color: 'text-lime-700 dark:text-lime-500' },
  { icon: TreePine, color: 'text-green-700 dark:text-green-500' },
];

const milestoneElements = [
  { streak: 7, icon: Star, color: 'text-yellow-500 dark:text-yellow-400', size: 36 }, // 1 week
  { streak: 15, icon: Bird, color: 'text-sky-500 dark:text-sky-400', size: 40 },
  { streak: 30, icon: Home, color: 'text-orange-600 dark:text-orange-400', size: 44 }, // 1 month
  { streak: 90, icon: Award, color: 'text-amber-500 dark:text-amber-400', size: 48 }, // 3 months
  { streak: 120, icon: Gem, color: 'text-violet-500 dark:text-violet-400', size: 52 },
  { streak: 240, icon: Mountain, color: 'text-gray-600 dark:text-gray-400', size: 56 },
  { streak: 365, icon: Gem, color: 'text-rose-500 dark:text-rose-400', size: 60 }, // 1 year
];

// Simple pseudo-random but deterministic generator for positioning
const a = 1664525;
const c = 1013904223;
const m = 2**32;

const createPseudoRandom = (seed: number) => {
    let currentSeed = seed;
    return () => {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m;
    }
}

// Create a unique random generator for each potential axis to avoid identical values
const randX = createPseudoRandom(1);
const randY = createPseudoRandom(3);
const randSize = createPseudoRandom(5);
const randDelay = createPseudoRandom(7);

const gridItemLayouts = Array.from({ length: GRID_SIZE }).map(() => {
    return {
        top: `${Math.floor(randY() * 90) + 5}%`,
        left: `${Math.floor(randX() * 90) + 5}%`,
        size: Math.floor(randSize() * 16) + 32, // size between 32 and 48
        delay: randDelay() * 1.5, // animation delay
    };
});

// Main Component
export function ForestGrid({ completedTasks }: ForestGridProps) {
    
    const forestItems = React.useMemo(() => {
        return completedTasks.map((task, index) => {
            const layout = gridItemLayouts[index % GRID_SIZE];
            
            // Check for the highest applicable milestone
            const milestone = milestoneElements
                .slice() // Create a copy to not mutate the original
                .reverse() // Check from highest streak to lowest
                .find(m => (task.streak || 0) >= m.streak);

            if (milestone) {
                return {
                    ...layout,
                    key: task.id,
                    size: milestone.size,
                    Element: milestone.icon,
                    color: milestone.color,
                };
            }
            
            // Default to a base tree
            const baseElement = baseTrees[index % baseTrees.length];
            return {
                ...layout,
                key: task.id,
                Element: baseElement.icon,
                color: baseElement.color,
            };
        });
    }, [completedTasks]);

    if (completedTasks.length === 0) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <Trees className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="font-headline font-semibold text-lg text-foreground">Your forest is waiting to grow.</h3>
                <p className="max-w-xs">Complete tasks on the dashboard to plant your first tree and start building your legacy.</p>
            </div>
        );
    }
  
    return (
        <div className="relative aspect-[16/9] w-full rounded-md bg-gradient-to-br from-lime-100 to-green-200 dark:from-lime-900/50 dark:to-green-900/70 overflow-hidden">
            <div
                className="absolute inset-0 bg-repeat"
                style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a0d990\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
            />
            {forestItems.map(item => (
                <div
                    key={item.key}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-in fade-in zoom-in-50"
                    style={{ 
                        top: item.top, 
                        left: item.left, 
                        animationDelay: `${item.delay}s`,
                        zIndex: Math.floor(parseFloat(item.top)),
                    }}
                >
                    <item.Element
                        className={cn('drop-shadow-lg', item.color)}
                        style={{ width: item.size, height: item.size }}
                    />
                </div>
            ))}
        </div>
    );
}
