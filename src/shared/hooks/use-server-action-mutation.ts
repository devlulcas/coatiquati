import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

export type ServerActionMutationState<ServerActionOutput> =
  | {
      state: 'idle';
      isPending: false;
      error: null;
      serverActionResult: null;
    }
  | {
      state: 'pending';
      isPending: true;
      error: null;
      serverActionResult: null;
    }
  | {
      state: 'success';
      isPending: false;
      error: null;
      serverActionResult: ServerActionOutput;
    }
  | {
      state: 'error';
      isPending: false;
      error: Error;
      serverActionResult: null;
    };

export type ServerActionMutationProps<ServerActionInput, ServerActionOutput> = {
  serverAction: (data: ServerActionInput) => Promise<ServerActionOutput>;
  onSuccessfulAction?: (data: ServerActionOutput) => void;
  onFailedAction?: (error: Error) => void;
  shouldRefresh?: boolean;
};

export function useServerActionMutation<ServerActionInput, ServerActionOutput>({
  serverAction,
  onSuccessfulAction,
  onFailedAction,
  shouldRefresh = true,
}: ServerActionMutationProps<ServerActionInput, ServerActionOutput>) {
  const [state, setState] = useState<ServerActionMutationState<ServerActionOutput>>({
    state: 'idle',
    isPending: false,
    error: null,
    serverActionResult: null,
  });

  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();

  const mutate = useCallback(
    async (data: ServerActionInput) => {
      try {
        setState({ state: 'pending', isPending: true, error: null, serverActionResult: null });

        const serverActionResult = await serverAction(data);

        setState({ state: 'success', isPending: false, error: null, serverActionResult });

        onSuccessfulAction?.(serverActionResult);

        if (shouldRefresh) {
          startTransition(() => router.refresh());
        }
      } catch (error) {
        const treatedError = error instanceof Error ? error : new Error(String(error));

        setState({ state: 'error', isPending: false, error: treatedError, serverActionResult: null });

        onFailedAction?.(treatedError);
      } finally {
        setState({ state: 'idle', isPending: false, error: null, serverActionResult: null });
      }
    },
    [serverAction, onSuccessfulAction, onFailedAction, shouldRefresh, startTransition, router],
  );

  return { ...state, mutate, isTransitionStarted };
}
