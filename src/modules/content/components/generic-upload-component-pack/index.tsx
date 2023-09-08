import { generateComponents } from '@uploadthing/react';
import type React from 'react';
import type { GlobalFileRouter } from '../../lib/global-file-router';

const {
  UploadButton: UploadButtonRaw,
  UploadDropzone,
  Uploader,
} = generateComponents<GlobalFileRouter>();

export const UploadButton = (
  props: React.ComponentPropsWithoutRef<typeof UploadButtonRaw>
) => {
  return (
    <UploadButtonRaw
      appearance={{
        button:
          'px-4 transition-colors ut-ready:bg-brand-600 ut-ready:text-brand-50 ut-uploading:cursor-not-allowed rounded bg-primary text-primary-foreground bg-none',
        container: 'w-full',
        allowedContent: 'text-white mt-2 text-sm',
      }}
      {...props}
    />
  );
};

export { UploadDropzone, Uploader };
