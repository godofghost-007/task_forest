
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera } from 'lucide-react';
import type { UserProfile } from '@/app/profile/page';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  hobbies: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

interface EditProfileDialogProps {
  children: React.ReactNode;
  userProfile: UserProfile;
  onSave: (data: UserProfile) => void;
}

export function EditProfileDialog({ children, userProfile, onSave }: EditProfileDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: userProfile,
  });

  React.useEffect(() => {
    if (open) {
      setValue('name', userProfile.name);
      setValue('email', userProfile.email);
      setValue('mobile', userProfile.mobile);
      setValue('hobbies', userProfile.hobbies);
      setValue('avatarUrl', userProfile.avatarUrl);
      setAvatarPreview(userProfile.avatarUrl);
    }
  }, [userProfile, open, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setAvatarPreview(dataUrl);
        setValue('avatarUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: UserProfile) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || undefined} alt="User Avatar" />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" {...register('mobile')} />
            {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <Label htmlFor="hobbies">Hobbies</Label>
            <Textarea
              id="hobbies"
              placeholder="Tell us about your hobbies"
              {...register('hobbies')}
            />
            {errors.hobbies && <p className="text-xs text-destructive mt-1">{errors.hobbies.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
