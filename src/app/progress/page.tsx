'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const stages = [
  {
    day: 1,
    quote:
      'Even money trees grow from seeds of little movements. - Anonymous',
    image: 'https://placehold.co/600x400',
    hint: 'soil mound',
    button: 'Plant',
  },
  {
    day: 25,
    quote:
      'Just like a plant, the habit of saving requires cultivation. - Anonymous',
    image: 'https://placehold.co/600x400',
    hint: 'small sprout',
    button: 'Water',
  },
  {
    day: 100,
    quote: "Woohoo!!! Who said money doesn't grow on trees!",
    image: 'https://placehold.co/600x400',
    hint: 'mature tree',
    button: 'Celebrate',
  },
];

export default function ProgressPage() {
  const [progress, setProgress] = React.useState(25);

  const currentStageIndex = progress < 25 ? 0 : progress < 100 ? 1 : 2;
  const currentStage = stages[currentStageIndex];

  return (
    <div className="h-full w-full bg-gradient-to-br from-background to-secondary p-4 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Your Forest is Growing
          </h1>
          <p className="text-muted-foreground">
            Every task you complete helps your tree flourish.
          </p>
        </header>

        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <span className="font-bold text-foreground">Day {progress}</span>
              <Progress value={progress} className="h-3" />
              <span className="font-bold text-muted-foreground">100</span>
            </div>

            <div className="relative aspect-video w-full">
              <Image
                src={currentStage.image}
                alt={currentStage.hint}
                data-ai-hint={currentStage.hint}
                fill
                className="rounded-md object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-8">
          <p className="font-body text-lg italic text-muted-foreground">
            "{currentStage.quote}"
          </p>
          
          <div className="flex items-center justify-center gap-4">
            {progress === 100 ? (
                <>
                 <Button size="lg" className="gap-2">
                    <Download className="h-5 w-5" />
                    Save to Gallery
                </Button>
                 <Button size="lg" variant="outline" className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Share Your Win
                </Button>
                </>
            ) : (
                <Button size="lg" className="w-40">{currentStage.button}</Button>
            )}
          </div>
        </div>

        <div className="mt-16">
          <p className="mb-2 text-sm text-muted-foreground">Simulate Progress:</p>
          <Slider
            defaultValue={[25]}
            min={1}
            max={100}
            step={1}
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
          />
        </div>
      </div>
    </div>
  );
}
