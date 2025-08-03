
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function SocialPage() {
  return (
    <AppLayout>
        <div className="h-full w-full bg-secondary p-8 flex items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="font-headline">Social Hub</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Chat functionality is temporarily disabled. We will bring it back soon!
                    </p>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
  );
}
