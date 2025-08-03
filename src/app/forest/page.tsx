import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ForestPage() {
  return (
    <div className="h-full w-full bg-secondary p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Your Forest Village
          </h1>
          <p className="text-muted-foreground">
            A visualization of your hard work and dedication. Tap to explore.
          </p>
        </header>

        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-2 sm:p-4">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="https://placehold.co/1200x750"
                alt="Isometric forest village"
                data-ai-hint="isometric forest village"
                fill
                className="rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="font-headline text-2xl font-bold drop-shadow-md">The Grove of Growth</h2>
                <p className="max-w-md text-sm text-white/90 drop-shadow-sm">
                  Each tree represents a completed goal, and each house a mastered habit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">3 New Trees</CardTitle>
              <CardDescription>Grown this week</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">1 New House</CardTitle>
              <CardDescription>Habit streak unlocked</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">7 Rare Flowers</CardTitle>
              <CardDescription>Special achievements</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
