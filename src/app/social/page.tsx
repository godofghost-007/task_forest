import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function SocialPage() {
  return (
    <div className="h-full w-full bg-secondary p-4 sm:p-8">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-2xl">Social Hub</CardTitle>
            <CardDescription>
              This is where you'll connect with friends, share progress, and join community challenges. Stay tuned!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
