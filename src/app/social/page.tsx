
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function SocialPage() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">Community Hub</CardTitle>
                        <CardDescription>This feature is coming soon!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                             <Users className="h-20 w-20 mb-4 text-primary" />
                        </div>
                        <p>We're building a space for you to connect with friends, share progress, and grow together. Stay tuned!</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
