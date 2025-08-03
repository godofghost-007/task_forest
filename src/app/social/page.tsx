
'use client';

import { Chat } from '@/components/social/chat';
import { AppLayout } from '@/components/layout/app-layout';

export default function SocialPage() {
  return (
    <AppLayout>
        <div className="h-full w-full bg-secondary">
            <Chat />
        </div>
    </AppLayout>
  );
}
