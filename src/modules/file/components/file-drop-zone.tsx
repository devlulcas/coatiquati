'use client';

import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import { type Ref, createContext, forwardRef, useContext, useEffect, useState } from 'react';
import { type DropzoneState } from 'react-dropzone';

type FileDropZoneContext = { dropzoneState: DropzoneState };
const FileDropZoneContext = createContext<FileDropZoneContext | null>(null);

type FileDropZoneProps = { dropzoneState: DropzoneState; children: React.ReactNode };
function FileDropZone({ dropzoneState, children }: FileDropZoneProps) {
  return <FileDropZoneContext.Provider value={{ dropzoneState }}>{children}</FileDropZoneContext.Provider>;
}

const useFileDropZone = () => {
  const context = useContext(FileDropZoneContext);

  if (!context) {
    throw new Error('useFileDropZone deve ser usado dentro de um FileDropZone');
  }

  return context;
};

type FileDropZoneContainerProps = { children: React.ReactNode; className?: ClassValue };
function FileDropZoneContainer({ children, className }: FileDropZoneContainerProps) {
  const { dropzoneState } = useFileDropZone();

  return (
    <div
      {...dropzoneState.getRootProps()}
      className={cn(
        'flex h-fit flex-1 cursor-pointer flex-col items-center justify-center rounded border border-dashed p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

type FileDropZonePreviewProps = { className?: ClassValue };
function FileDropZonePreview({ className }: FileDropZonePreviewProps) {
  const { dropzoneState } = useFileDropZone();

  return dropzoneState.acceptedFiles.map((file, index) => (
    <FileDropZonePreviewAcceptedUnit key={index} file={file} className={className} />
  ));
}

function useImageFileData(file: File) {
  const [image, setImage] = useState({ width: 0, height: 0, src: '' });

  const fromBytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const image = new Image();

      const createImagePreviewURL = (file: File) => URL.createObjectURL(file);

      image.onload = () => {
        setImage({
          width: image.width,
          height: image.height,
          src: createImagePreviewURL(file),
        });
      };

      image.src = createImagePreviewURL(file);
    }
  }, [file]);

  return {
    width: image.width,
    height: image.height,
    src: image.src,
    size: fromBytesToKB(file.size),
  };
}

type FileDropZonePreviewAcceptedUnitProps = {
  file: File;
  className?: ClassValue;
};
function FileDropZonePreviewAcceptedUnit({ file, className }: FileDropZonePreviewAcceptedUnitProps) {
  const image = useImageFileData(file);

  if (!image) {
    return null;
  }

  return (
    <div className={cn('flex h-fit w-full flex-col gap-1', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={file.name}
        className="h-auto max-h-[30dvh] min-h-[250px] w-full rounded bg-muted object-cover py-4"
      />

      <div className="flex justify-start divide-x">
        <p className="w-full min-w-fit rounded-l bg-muted px-2 py-1 text-center text-sm text-muted-foreground">
          {image.height}px por {image.width}px
        </p>
        <p className="w-full min-w-fit rounded-r bg-muted px-2 py-1 text-center text-sm text-muted-foreground">
          {image.size}
        </p>
      </div>
      <p className="w-full min-w-fit bg-muted px-2 py-1 text-center text-sm text-muted-foreground">{file.type}</p>
      <p className="truncate rounded bg-muted px-2 py-1 text-sm text-muted-foreground">{file.name}</p>
    </div>
  );
}

type FileDropZoneButtonProps = { className?: ClassValue };
function FileDropZoneButton({ className }: FileDropZoneButtonProps) {
  const { dropzoneState } = useFileDropZone();

  if (dropzoneState.acceptedFiles.length > 0) {
    return null;
  }

  return (
    <button type="button" className={cn('h-full min-h-28 w-full text-sm text-muted-foreground', className)}>
      {dropzoneState.isDragActive ? (
        <p>Solte o arquivo aqui ...</p>
      ) : (
        <p>Arraste e solte o arquivo aqui, ou clique para selecionar</p>
      )}
    </button>
  );
}

type FileDropZoneInputProps = { className?: ClassValue };
function InnerFileDropZoneInput({ className }: FileDropZoneInputProps, ref: Ref<HTMLInputElement>) {
  const { dropzoneState } = useFileDropZone();

  return (
    <input ref={ref} {...dropzoneState.getInputProps()} className={cn('block h-full w-full lg:hidden', className)} />
  );
}
const FileDropZoneInput = forwardRef(InnerFileDropZoneInput);
FileDropZoneInput.displayName = 'FileDropZoneInput';

FileDropZone.Input = FileDropZoneInput;
FileDropZone.Container = FileDropZoneContainer;
FileDropZone.Preview = FileDropZonePreview;
FileDropZone.Button = FileDropZoneButton;

export { FileDropZone };
