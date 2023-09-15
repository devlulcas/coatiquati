'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { VideoIcon } from 'lucide-react';
import { VideoContentForm } from '../video-content-form';

export function NewVideoContentDialogTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center justify-center">
          <VideoIcon /> Contribuir com um vídeo
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <VideoContentForm onSubmit={(data) => console.log(data)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
