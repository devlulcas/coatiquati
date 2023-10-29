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
import { useForm, type SubmitHandler } from 'react-hook-form';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { z } from 'zod';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex h-full flex-col gap-4', className)}>
        <div className={cn('aspect-video h-80 rounded-lg overflow-hidden ', youtubeId ? 'bg-black' : 'bg-neutral-900')}>
          {youtubeId ? (
            <LiteYouTubeEmbed id={youtubeId} title={form.watch('title')} />
          ) : (
            <div className="flex items-center justify-center gap-4 h-full">
              <VideoOffIcon className="w-16 h-16 text-neutral-500" />
              <p className="text-neutral-500 text-lg">Sem vídeo</p>
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

        <Button className="w-full mt-auto" type="submit">
          Salvar vídeo
        </Button>
      </form>
    </Form>
  );
}
