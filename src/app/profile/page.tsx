
'use client';

import { useState } from 'react';
import { useTasks } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, Leaf, Zap, User, Settings, Bell, Palette } from 'lucide-react';
import { NotificationsDialog } from '@/components/profile/notifications-dialog';
import { ThemeDialog } from '@/components/profile/theme-dialog';
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  hobbies: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const { tasks } = useTasks();
  const [notificationSettings, setNotificationSettings] = useState({
    reminders: true,
    autoComplete: false,
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    mobile: '123-456-7890',
    hobbies: 'Reading, hiking, coding',
    avatarUrl: 'https://placehold.co/100x100.png',
  });

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  const longestStreak = Math.max(0, ...tasks.map(t => t.streak));
  const recentlyCompleted = completedTasks.slice(-3).reverse();

  return (
    <div className="h-full w-full bg-secondary p-4 sm:p-8 overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile.avatarUrl} alt="User Avatar" data-ai-hint="person avatar" />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="font-headline text-3xl font-bold">{userProfile.name}</h1>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <EditProfileDialog userProfile={userProfile} onSave={setUserProfile}>
                <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
              </EditProfileDialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <Leaf className="h-5 w-5 text-green-500" />
                Forest Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedTasks.length}</p>
              <p className="text-sm text-muted-foreground">trees planted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <Zap className="h-5 w-5 text-yellow-500" />
                Longest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{longestStreak}</p>
              <p className="text-sm text-muted-foreground">day streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Tasks Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedTasks.length}</p>
              <p className="text-sm text-muted-foreground">out of {totalTasks}</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <Award className="h-5 w-5 text-orange-500" />
                Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-bold">{Math.round(completionPercentage)}</p>
                 <span className="text-xl text-muted-foreground">%</span>
               </div>
               <Progress value={completionPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>Your last few completed tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                {recentlyCompleted.length > 0 ? (
                  <ul className="space-y-4">
                    {recentlyCompleted.map((task) => (
                      <li key={task.id} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.subtitle}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground">No recent activity.</p>
                )}
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Settings</CardTitle>
                <CardDescription>Manage your account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Push Notifications</span>
                    </div>
                     <NotificationsDialog 
                        settings={notificationSettings} 
                        onSettingsChange={setNotificationSettings}
                      >
                       <Button variant="outline" size="sm">Manage</Button>
                     </NotificationsDialog>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Theme</span>
                    </div>
                    <ThemeDialog>
                      <Button variant="outline" size="sm">Change</Button>
                    </ThemeDialog>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Account Settings</span>
                    </div>
                    <EditProfileDialog userProfile={userProfile} onSave={setUserProfile}>
                      <Button variant="outline" size="sm">Go</Button>
                    </EditProfileDialog>
                 </div>
              </CardContent>
            </Card>
        </div>
        
      </div>
    </div>
  );
}
