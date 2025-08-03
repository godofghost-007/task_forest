
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function SocialPage() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">Social Hub</CardTitle>
                        <CardDescription>This feature is currently under construction.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                             <MessageSquare className="h-20 w-20 mb-4 text-primary" />
                        </div>
                        <p>We're working on something great here. Please check back later!</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
