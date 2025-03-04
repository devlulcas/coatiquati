'use client';

import { CategoriesAsyncSelect } from '@/modules/category/components/categories-async-select';
import type { TrailCategory } from '@/modules/category/types/trail-category';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { contentStatus } from '@/shared/constants/content-status';
import { SearchIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';

export function DashboardTrailForm() {
  const [selectedCategory, setSelectedCategory] = useQueryState('category', parseAsString.withDefault(''));

  return (
    <form method="get" className="mb-8 flex flex-col space-y-4">
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <CategoriesAsyncSelect
          selectedCategory={{ name: selectedCategory ?? '' }}
          setSelectedCategory={(category: TrailCategory) => setSelectedCategory(category.name)}
        />
        <Input type="text" name="search" placeholder="Buscar trilha" />
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <RadioGroup className="flex gap-4" defaultValue="all" name="status">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={contentStatus.DRAFT} id={contentStatus.DRAFT} />
            <Label htmlFor={contentStatus.DRAFT}>Rascunho</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={contentStatus.PUBLISHED} id={contentStatus.PUBLISHED} />
            <Label htmlFor={contentStatus.PUBLISHED}>Publicado</Label>
          </div>
        </RadioGroup>

        <Button type="submit" className="w-full items-center gap-2 md:w-fit">
          Buscar
          <SearchIcon className="rotate-90" size={20} />
        </Button>
      </div>
    </form>
  );
}
