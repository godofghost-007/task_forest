
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationSettings {
    reminders: boolean;
    autoComplete: boolean;
}

interface NotificationsDialogProps {
  children: React.ReactNode;
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export function NotificationsDialog({ children, settings, onSettingsChange }: NotificationsDialogProps) {
  
  const handleRemindersChange = (checked: boolean) => {
    onSettingsChange({ ...settings, reminders: checked });
  };
  
  const handleAutoCompleteChange = (checked: boolean) => {
    onSettingsChange({ ...settings, autoComplete: checked });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Manage how you receive notifications from Task Forest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <Label htmlFor="reminders" className="font-semibold">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get a reminder 5 minutes before a task is scheduled.
              </p>
            </div>
            <Switch 
                id="reminders" 
                checked={settings.reminders}
                onCheckedChange={handleRemindersChange}
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
                <Label htmlFor="autoComplete" className="font-semibold">Auto-Completion Alerts</Label>
                <p className="text-sm text-muted-foreground">
                    Receive a notification when a task is completed automatically.
                </p>
            </div>
            <Switch 
                id="autoComplete" 
                checked={settings.autoComplete}
                onCheckedChange={handleAutoCompleteChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
