'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { UploadButton } from '../generic-upload-component-pack';

export function UploadMarkdownButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Subir Markdown</Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <UploadButton endpoint="markdown" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
