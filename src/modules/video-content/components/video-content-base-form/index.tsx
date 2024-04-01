'use client';

import { newVideoContentSchema } from '@/modules/video-content/schemas/new-video-content-schema';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassValue } from 'clsx';
import { VideoOffIcon } from 'lucide-react';
import { useMemo } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { type z } from 'zod';
import { YouTubeEmbed } from '../youtube-embed';

const videoContentFormSchema = newVideoContentSchema;

type VideoContentBaseFormSchema = z.infer<typeof videoContentFormSchema>;

type VideoContentBaseFormProps = {
  defaultValues?: Partial<VideoContentBaseFormSchema>;
  onSubmit: SubmitHandler<VideoContentBaseFormSchema>;
  className?: ClassValue;
};

export function VideoContentBaseForm({ onSubmit, className, defaultValues }: VideoContentBaseFormProps) {
  const form = useForm<VideoContentBaseFormSchema>({
    resolver: zodResolver(videoContentFormSchema),
    defaultValues: defaultValues,
  });

  const url = form.watch('src');

  const youtubeId = useMemo(() => {
    try {
      const urlObject = new URL(url);
      if (urlObject.hostname === 'youtu.be') return urlObject.pathname.replace('/', '');
      return urlObject.searchParams.get('v');
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [url]);

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex h-full flex-col gap-4', className)}
      >
        <div className={cn('aspect-video h-80 overflow-hidden rounded-lg ', youtubeId ? 'bg-black' : 'bg-neutral-900')}>
          {youtubeId ? (
            <YouTubeEmbed id={youtubeId} title={form.watch('title')} />
          ) : (
            <div className="flex h-full items-center justify-center gap-4">
              <VideoOffIcon className="h-16 w-16 text-neutral-500" />
              <p className="text-lg text-neutral-500">Sem vídeo</p>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="src"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do vídeo no Youtube</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto alternativo</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Rick roll" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Gato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input type="text" placeholder="O vídeo fala sobre..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-auto w-full" type="submit">
          Salvar vídeo
        </Button>
      </form>
    </Form>
  );
}
