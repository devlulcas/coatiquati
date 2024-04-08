'use client';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { reportUserMutation } from '../actions/report-user-mutation';
import { REPORT_REASONS, REPORT_REASON_LABELS } from '../constants/report';
import { createReportSchema } from '../schemas/create-report';

type ReportFormDialogTriggerProps = {
  children: React.ReactNode;
  origin: {
    type: 'trail' | 'topic' | 'content' | 'publication';
    id: number;
  };
  user: string;
};

export function ReportFormDialogTrigger({ children, origin, user }: ReportFormDialogTriggerProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: reportUserMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao reportar usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
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
          onSubmit={data => {
            mutation.mutate({
              description: data.description,
              type: data.type,
              reportedEntityId: origin.id,
              reportedEntityType: origin.type,
              userId: user,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const formSchema = createReportSchema.pick({ description: true, type: true });
type FormSchema = z.infer<typeof formSchema>;
function ReportForm({ onSubmit }: { onSubmit: (data: FormSchema) => void }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porque está reportando este usuário?</FormLabel>
              <FormControl>
                <Input placeholder="A postagem contém dados falsos" {...field} />
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
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {REPORT_REASONS.map(reason => (
                    <FormItem key={reason} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={reason} />
                      </FormControl>
                      <FormLabel className="font-normal">{REPORT_REASON_LABELS[reason]}</FormLabel>
                    </FormItem>
                  ))}
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
