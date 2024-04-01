import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { useTrailCategorySearchQuery } from '../../hooks/use-trail-category-search-query';

type TrailCategorySearchInputProps = {
  className?: ClassValue;
  value?: string;
  setValue?: (value: string) => void;
};

function useDebounceState<T>(value: T, delay: number) {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return [state, setState] as const;
}

export function TrailCategorySearchInput({ className, setValue, value }: TrailCategorySearchInputProps) {
  const [search, setSearch] = useDebounceState(value ?? '', 500);

  const trailCategorySearchQuery = useTrailCategorySearchQuery({
    search: search,
    skip: 0,
    take: 10,
  });

  return (
    <div className={cn('relative', className)}>
      <Input
        type="text"
        className="mb-2 w-full rounded-md border"
        placeholder="Pesquisar categoria"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {trailCategorySearchQuery.isLoading && (
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      )}

      {trailCategorySearchQuery.isSuccess && trailCategorySearchQuery.data.length > 0 && (
        <div className="flex flex-col gap-2 rounded-md border bg-muted p-3">
          <p className="text-sm text-muted-foreground">Categorias encontradas</p>

          {trailCategorySearchQuery.data.map(trailCategory => (
            <button
              key={trailCategory.name}
              type="button"
              className={cn(
                'flex items-center gap-2 text-sm text-muted-foreground',
                trailCategory.name === value && 'text-primary',
              )}
              onClick={() => {
                setValue?.(trailCategory.name);
                setSearch(trailCategory.name);
              }}
            >
              <span>{trailCategory.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
