import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedState<T>(value: T, delay: number): [T, (value: T) => void] {
  const [state, setState] = useState(value);
  const debouncedState = useDebounce(state, delay);
  return [debouncedState, setState];
}
