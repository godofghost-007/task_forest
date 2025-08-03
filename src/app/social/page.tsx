
'use client';

import { useAuth } from '@/context/auth-context';
import { AuthForm } from '@/components/social/auth-form';
import { Chat } from '@/components/social/chat';

export default function SocialPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="h-full w-full bg-secondary flex items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="h-full w-full bg-secondary">
      {user ? <Chat /> : <AuthForm />}
    </div>
  );
}
