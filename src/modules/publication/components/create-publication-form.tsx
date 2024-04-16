'use client';

import { UploadButton } from '@/modules/media/components/generic-upload-component-pack';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { getEmbedIDFromYoutubeUrl } from '@/modules/video-content/lib/youtube';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { VideoOffIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { publishContentMutation } from '../actions/publish-content-mutation';
import { createPublicationSchema, type CreatePublicationSchema } from '../schemas/create-publication';
import type { PublicationMedia } from '../types/publication';
import { PublicationImageEmbed, PublicationVideoEmbed } from './publication-media-grid';

export function CreatePublicationForm() {
  const { toast } = useToast();

  const form = useForm<CreatePublicationSchema>({
    resolver: zodResolver(createPublicationSchema),
  });

  const mediaFieldArray = useFieldArray({
    control: form.control,
    name: 'medias',
  });

  const mutation = useServerActionMutation({
    serverAction: publishContentMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar publicação',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: 'Publicação criada',
        description: 'Sua publicação foi criada com sucesso!',
        variant: 'success',
      });
    },
    shouldRefresh: true,
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(mutation.mutate)}
        className="flex h-fit w-full flex-col gap-4 rounded-md border bg-card/75 p-4 shadow-md"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publique algo sobre seus estudos</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>O conteúdo deve ter no máximo 1000 caracteres</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap items-center gap-1">
          {mediaFieldArray.fields.map((field, index) => (
            <div key={field.url} className="relative flex h-32 w-32 flex-col overflow-hidden rounded bg-secondary">
              <Button
                size="icon"
                variant="destructive"
                className="absolute right-0 top-0 z-10 scale-75"
                onClick={() => mediaFieldArray.remove(index)}
              >
                <XIcon />
              </Button>

              <div className="relative my-auto">
                {field.type === 'image' ? <PublicationImageEmbed {...field} /> : <PublicationVideoEmbed {...field} />}
              </div>
            </div>
          ))}

          {mediaFieldArray.fields.length <= 3 && (
            <AddMediaDialog
              index={mediaFieldArray.fields.length}
              onSubmit={data => {
                if (mediaFieldArray.fields.some(field => field.url === data.url)) {
                  toast({
                    title: 'Mídia duplicada',
                    description: 'Você já adicionou essa mídia',
                    variant: 'destructive',
                  });

                  return;
                }

                mediaFieldArray.append(data);
              }}
            />
          )}
        </div>

        <Button className="mt-4 w-full" type="submit" isLoading={form.formState.isSubmitting}>
          Enviar
        </Button>
      </form>
    </Form>
  );
}

function AddMediaDialog({
  onSubmit,
  defaultValues,
  index,
}: {
  onSubmit: (data: PublicationMedia) => void | Promise<void>;
  defaultValues?: Partial<PublicationMedia>;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<PublicationMedia['type']>(defaultValues?.type ?? 'image');
  const [url, setUrl] = useState(defaultValues?.url ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');

  const { toast } = useToast();

  const youtubeId = useMemo(() => {
    return getEmbedIDFromYoutubeUrl(url);
  }, [url]);

  const save = () => {
    if (URL.canParse(url) === false) {
      toast({
        title: 'URL inválida',
        description: 'A URL da mídia é inválida',
        variant: 'destructive',
      });

      return;
    }

    if (type === 'video' && !youtubeId) {
      toast({
        title: 'URL inválida',
        description: 'A URL do vídeo é inválida',
        variant: 'destructive',
      });

      return;
    }

    if (description.trim().length === 0) {
      toast({
        title: 'Descrição vazia',
        description: 'A descrição da mídia não pode ser vazia',
        variant: 'destructive',
      });

      return;
    }

    onSubmit({ type, url, description, id: index });

    setUrl('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-32 w-32 items-center justify-center rounded-md border bg-background/50 text-foreground shadow-md transition-colors hover:bg-background/75"
        >
          Adicionar mídia
        </button>
      </DialogTrigger>

      <DialogContent>
        <Tabs defaultValue="image" onValueChange={value => setType(value as PublicationMedia['type'])}>
          <TabsList>
            <TabsTrigger value="image">Imagem</TabsTrigger>
            <TabsTrigger value="video">Vídeo</TabsTrigger>
          </TabsList>

          <TabsContent
            className="flex h-72 flex-col items-center justify-center gap-2 data-[state=inactive]:hidden data-[state=inactive]:h-0"
            value="image"
          >
            <div className="flex w-full items-center justify-center">
              {URL.canParse(url) && (
                <Image
                  src={url}
                  alt={description || 'Imagem'}
                  className="aspect-video w-fit overflow-hidden rounded"
                  width={300}
                  height={300}
                />
              )}
            </div>

            <UploadButton
              endpoint="textEditorImage"
              onClientUploadComplete={res => {
                if (typeof res === 'undefined' || res.length === 0) {
                  return toast({
                    title: 'Erro ao realizar upload',
                    variant: 'destructive',
                  });
                }

                const file = res.at(0);

                if (!file) {
                  return toast({
                    title: 'Erro ao realizar upload',
                    variant: 'destructive',
                  });
                }

                setUrl(file.url);
              }}
            />
          </TabsContent>

          <TabsContent
            className="flex h-72 flex-col items-center justify-center gap-2 data-[state=inactive]:hidden data-[state=inactive]:h-0"
            value="video"
          >
            <div
              className={cn(
                'aspect-video w-full overflow-hidden rounded-lg ',
                youtubeId ? 'bg-black' : 'bg-neutral-900',
              )}
            >
              {youtubeId ? (
                <YouTubeEmbed id={youtubeId} title={description} />
              ) : (
                <div className="flex h-full items-center justify-center gap-4">
                  <VideoOffIcon className="h-16 w-16 text-neutral-500" />
                  <p className="text-lg text-neutral-500">Sem vídeo</p>
                </div>
              )}
            </div>

            <Input
              type="url"
              placeholder="URL da mídia"
              required
              minLength={8}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        <Input type="text" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />

        <Button className="mt-4 w-full" onClick={save}>
          Adicionar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
