
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Leaf, Flower, Sprout, Grape } from 'lucide-react';

interface PlantGrowthProps {
  progress: number;
}

const stages = [
  { progress: 0, Icon: Sprout, color: 'text-lime-400', size: 'h-8 w-8', position: 'bottom-4' },
  { progress: 0.25, Icon: Leaf, color: 'text-green-400', size: 'h-12 w-12', position: 'bottom-6' },
  { progress: 0.5, Icon: Leaf, color: 'text-emerald-400', size: 'h-20 w-20', position: 'bottom-8' },
  { progress: 0.75, Icon: Flower, color: 'text-pink-400', size: 'h-24 w-24', position: 'bottom-10' },
  { progress: 1, Icon: Grape, color: 'text-purple-400', size: 'h-28 w-28', position: 'bottom-12' },
];

export function PlantGrowth({ progress }: PlantGrowthProps) {
  // Find the current stage based on progress
  const currentStage = stages.slice().reverse().find(stage => progress >= stage.progress) || stages[0];

  return (
    <div className="relative my-6 flex h-40 w-full items-center justify-center">
      {/* Earth mound */}
      <div 
        className="absolute bottom-0 h-16 w-48 rounded-t-full"
        style={{
            background: 'linear-gradient(to top, #5a3825, #8c5a3c)'
        }}
      />
      
      {/* Plant stages */}
      {stages.map((stage) => {
        const isActive = stage.progress === currentStage.progress;
        return (
          <div
            key={stage.progress}
            className={cn(
              'absolute transition-all duration-700 ease-in-out flex justify-center items-end',
              stage.position,
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          >
            <stage.Icon className={cn(stage.size, stage.color, 'drop-shadow-lg')} />
          </div>
        );
      })}
    </div>
  );
}
