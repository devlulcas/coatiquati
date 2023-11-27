'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ClassValue } from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTrailCategorySearchQuery } from '../../hooks/use-trail-category-search-query';
import { newTrailCategoryAction } from './new-trail-category-action';

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Um nome para a categoria é obrigatório',
      invalid_type_error: 'O nome da categoria deve ser um texto',
    })
    .min(3, 'O nome da categoria deve ter no mínimo 3 caracteres')
    .max(42, 'O nome da categoria deve ter no máximo 42 caracteres'),
});

export type TrailCategoryFormValues = z.infer<typeof formSchema>;

type TrailCategoryFormProps = {
  className?: ClassValue;
};

export function TrailCategoryForm({ className }: TrailCategoryFormProps) {
  const form = useForm<TrailCategoryFormValues>({
    resolver: zodResolver(formSchema),
  });

  const trailCategorySearchQuery = useTrailCategorySearchQuery({
    search: form.watch('name'),
    skip: 0,
    take: 10,
  });

  const { toast } = useToast();

  const onSubmit = async (data: TrailCategoryFormValues) => {
    try {
      await newTrailCategoryAction(data);
      toast({ title: 'Categoria criada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar categoria',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col gap-3', className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Tópico tal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {trailCategorySearchQuery.isSuccess && trailCategorySearchQuery.data.length > 0 && (
          <div className="border rounded-md p-3 flex flex-col gap-2 bg-muted">
            <p className="text-sm text-muted-foreground">
              Antes de confirmar, verifique se as categorias abaixo são parecidas com a que está criando, caso seja,
              você deve desistir de criar uma nova e usar uma das que já existem.
            </p>
            <ul className="flex gap-2 flex-wrap">
              {trailCategorySearchQuery.data.map(category => (
                <li key={category.name}>
                  <Badge>{category.name}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className="w-full"
          type="submit"
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting || trailCategorySearchQuery.isFetching}
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
