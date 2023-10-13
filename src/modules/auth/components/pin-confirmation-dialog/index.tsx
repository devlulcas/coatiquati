'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const pinFormSchema = z.object({
  pin: z
    .string({
      required_error: 'O código é obrigatório',
    })
    .min(6, {
      message: 'O código deve ter 6 dígitos',
    })
    .max(6, {
      message: 'O código deve ter 6 dígitos',
    }),
});

type PinConfirmationDialogProps = {
  onConfirm: (data: z.infer<typeof pinFormSchema>) => void;
  isOpen: boolean;
  onCancel: () => void;
};

export function PinConfirmationDialog(props: PinConfirmationDialogProps) {
  const { onConfirm, isOpen, onCancel } = props;

  const pinForm = useForm<z.infer<typeof pinFormSchema>>({
    resolver: zodResolver(pinFormSchema),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Insira o código enviado no seu e-email</DialogTitle>
          <DialogDescription>
            <Form {...pinForm}>
              <form onSubmit={pinForm.handleSubmit(onConfirm)} className="space-y-8">
                <FormField
                  control={pinForm.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin</FormLabel>
                      <FormControl>
                        <Input placeholder="000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button className="w-full" variant="secondary" onClick={onCancel}>
                    Cancelar
                  </Button>

                  <Button className="w-full" type="submit">
                    Confirmar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
