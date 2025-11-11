'use client';

import type { SelectCategory } from '@/modules/database/schema/category';
import { AsyncSelect } from '@/shared/components/ui/async-select';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { isFail } from '@/shared/lib/result';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import { createCategoryMutation } from '../actions/create-category-mutation';
import { searchTrailCategoriesQuery } from '../actions/search-trails-categories-query';

type CategoriesAsyncSelectProps = {
  selectedCategory: Pick<SelectCategory, 'id'> | undefined;
  setSelectedCategory: (category: Pick<SelectCategory, 'id'>) => void;
};

export function CategoriesAsyncSelect({
  selectedCategory,
  setSelectedCategory,
}: CategoriesAsyncSelectProps) {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const queryOptions = categorySearchQueryOptions({ search });
  const query = useQuery(queryOptions);
  const queryClient = useQueryClient();

  const handleSearch = async (search: string | undefined) => {
    setSearch(search);
    await queryClient.invalidateQueries(queryOptions);
    return query.data ?? [];
  };

  const handleChange = (name: string) => {
    const category = query.data?.find((item) => item.name === name);
    if (!category) return;
    setSelectedCategory(category);
  };

  return (
    <AsyncSelect<SelectCategory>
      className="w-full"
      triggerClassName="w-full"
      width={'100%'}
      fetcher={handleSearch}
      preload
      clearable
      filterFn={(category, query) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      }
      renderOption={(category) => (
        <div className="font-medium">{category.name}</div>
      )}
      notFound={(query) => (
        <CategoryNotFound
          query={query}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      getOptionValue={(category) => category.name}
      getDisplayValue={(category) => category.name}
      label="Categoria"
      placeholder="Categoria..."
      value={selectedCategory?.id.toString() ?? ''}
      onChange={handleChange}
    />
  );
}

function categorySearchQueryOptions(opts: { search: string | undefined }) {
  return queryOptions({
    queryKey: ['categories', opts.search],
    queryFn: async () => {
      const d = await searchTrailCategoriesQuery({
        search: opts.search,
        skip: 0,
        take: 10,
      });

      return isFail(d) ? [] : d.value;
    },
  });
}

function CategoryNotFound({
  query,
  setSelectedCategory,
}: {
  query: string;
  setSelectedCategory: (category: SelectCategory) => void;
}) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  if (query.trim().length <= 3) {
    return (
      <div className="p-3 pb-1">
        <p className="text-center text-sm text-gray-500">Pesquise algo!</p>
      </div>
    );
  }

  return (
    <div className="p-3 pb-1">
      <p className="mb-2 text-center text-sm text-gray-500">
        Nada encontrado para &quot;{query}&quot;
      </p>
      <Button
        className="w-full"
        variant="ghost"
        size="sm"
        isLoading={loading}
        onClick={() => {
          startTransition(async () => {
            const res = await createCategoryMutation({ name: query });
            if (isFail(res)) {
              toast({
                description: res.fail,
                variant: 'destructive',
              });
            } else {
              setSelectedCategory(res.value);
            }
          });
        }}
      >
        Clique para criar
      </Button>
    </div>
  );
}
