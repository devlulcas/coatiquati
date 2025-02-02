'use client';

import { createCategoryMutation } from "@/modules/category/actions/create-category-mutation";
import { searchTrailCategoriesQuery } from "@/modules/category/actions/search-trails-categories-query";
import type { TrailCategory } from "@/modules/category/types/trail-category";
import { AsyncSelect } from "@/shared/components/ui/async-select";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { isFail } from "@/shared/lib/result";
import { useTransition } from "react";

export function CategoriesAsyncSelect({ selectedCategory, setSelectedCategory }: { selectedCategory: TrailCategory, setSelectedCategory: (category: TrailCategory) => void }) {
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <AsyncSelect<TrailCategory>
      className="w-full"
      triggerClassName="w-full"
      width={'100%'}
      fetcher={async (query) => {
        const d = await searchTrailCategoriesQuery({ search: query })
        return isFail(d) ? [] : d.value
      }}
      preload
      clearable
      filterFn={(category, query) => category.name.toLowerCase().includes(query.toLowerCase())}
      renderOption={(category) => (
        <div className="font-medium">{category.name}</div>
      )}
      notFound={(query) => query.trim().length > 3 ? (
        <div className="p-3 pb-1">
          <p className="text-gray-500 text-sm text-center mb-2">Nada encontrado para &quot;{query}&quot;</p>
          <Button className="w-full" variant='ghost' size='sm'
            isLoading={loading}

            onClick={() => {
              startTransition(async () => {
                const res = await createCategoryMutation(query)
                if (isFail(res)) {
                  toast({ title: 'Erro', description: res.fail, variant: 'destructive' })
                } else {
                  setSelectedCategory({ name: res.value })
                }
              })
            }}>Clique para criar</Button>
        </div>
      ) : (
        <div className="p-3 pb-1">
          <p className="text-gray-500 text-sm text-center">Pesquise algo!</p>
        </div>
      )}
      getOptionValue={(category) => category.name}
      getDisplayValue={(category) => category.name}
      label="Categoria"
      placeholder="Categoria..."
      value={selectedCategory.name}
      onChange={(category) => setSelectedCategory({ name: category })}
    />
  )
}
