import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { unwrap, type Result } from '../lib/result';

type ServerActionFn<I, O> = (data: I) => Promise<Result<O>>;

type ServerActionOnSuccessfulAction<O> = (data: O) => void;

type ServerActionOnFailedAction = (error: Error) => void;

type ServerActionMutationState<O> =
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
      serverActionResult: O;
    }
  | {
      state: 'error';
      isPending: false;
      error: Error;
      serverActionResult: null;
    };

export type ServerActionMutationOptions<I, O> = {
  serverAction: ServerActionFn<I, O>;
  onSuccessfulAction?: ServerActionOnSuccessfulAction<O>;
  onFailedAction?: ServerActionOnFailedAction;
  shouldRefresh?: boolean;
};

export type ServerActionMutationReturn<O> = ServerActionMutationState<O> & {
  mutate: (data: any) => Promise<void>;
  isTransitionStarted: boolean;
};

export function useServerActionMutation<I, O>({
  serverAction,
  onSuccessfulAction,
  onFailedAction,
  shouldRefresh,
}: ServerActionMutationOptions<I, O>): ServerActionMutationReturn<O> {
  const [state, setState] = useState<ServerActionMutationState<O>>({
    state: 'idle',
    isPending: false,
    error: null,
    serverActionResult: null,
  });

  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();

  const mutate = useCallback(
    async (data: I) => {
      try {
        setState({ state: 'pending', isPending: true, error: null, serverActionResult: null });

        const serverActionResult = await serverAction(data);

        const value = unwrap(serverActionResult);

        setState({ state: 'success', isPending: false, error: null, serverActionResult: value });

        onSuccessfulAction?.(value);

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
