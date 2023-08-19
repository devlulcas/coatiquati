'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ClassValue } from 'clsx';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  newTopicSchema,
  type NewTopicSchema,
} from '../../schemas/new-topic-schema';

type TopicBaseFormProps = {
  defaultValues?: Partial<NewTopicSchema>;
  onSubmit: SubmitHandler<NewTopicSchema>;
  className?: ClassValue;
};

export function TopicBaseForm(props: TopicBaseFormProps) {
  const { defaultValues, onSubmit, className } = props;

  const form = useForm<NewTopicSchema>({
    resolver: zodResolver(newTopicSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-8', className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Trilha tal" {...field} />
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
                <Input placeholder="Alguma descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          isLoading={form.formState.isSubmitting}
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}