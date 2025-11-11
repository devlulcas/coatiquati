'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { useToast } from '@/shared/components/ui/use-toast';
import { unwrap } from '@/shared/lib/result';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';
import { reportUserMutation } from '../actions/report-user-mutation';
import { REPORT_REASON_LABELS } from '../constants/report';
import {
  createReportSchema,
  type CreateReportSchema,
} from '../schemas/create-report';

type ReportFormDialogTriggerProps = {
  children: React.ReactNode;
  params: Pick<
    CreateReportSchema,
    | 'trailId'
    | 'topicId'
    | 'contentId'
    | 'publicationId'
    | 'commentId'
    | 'userId'
  >;
};

export function ReportFormDialogTrigger({
  children,
  params,
}: ReportFormDialogTriggerProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (formData: ReportFormSchema) => {
      const result = await reportUserMutation({
        description: formData.description,
        type: formData.type,

        trailId: params.trailId,
        topicId: params.topicId,
        contentId: params.contentId,
        publicationId: params.publicationId,
        commentId: params.commentId,
        userId: params.userId,
      });

      return unwrap(result);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao reportar usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Usuário reportado com sucesso',
        variant: 'success',
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportando um usuário</DialogTitle>
        </DialogHeader>
        <ReportForm
          onSubmit={(data) => {
            return mutation.mutateAsync(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const reportFormSchema = createReportSchema.pick({
  description: true,
  type: true,
});

type ReportFormSchema = z.infer<typeof reportFormSchema>;

type ReportFormProps = {
  onSubmit: SubmitHandler<ReportFormSchema>;
};

function ReportForm({ onSubmit }: ReportFormProps) {
  const form = useForm<ReportFormSchema>({
    resolver: zodResolver(reportFormSchema),
  });

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porque está reportando este usuário?</FormLabel>
              <FormControl>
                <Input
                  placeholder="A postagem contém dados falsos"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Motivo do reporte</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  className="flex flex-col space-y-1"
                >
                  {Object.entries(REPORT_REASON_LABELS).map(
                    ([reason, label]) => (
                      <FormItem
                        key={reason}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={reason} />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-3 w-full"
          type="submit"
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Reportar
        </Button>
      </form>
    </Form>
  );
}
