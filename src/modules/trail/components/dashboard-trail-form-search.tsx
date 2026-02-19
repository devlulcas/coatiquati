'use client';

import { CategoriesAsyncSelect } from '@/modules/category/components/categories-async-select';
import { ContentStatus } from '@/modules/database/lib/content-enum';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SearchIcon } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import type { TrailSearchSchema } from '../actions/get-trails-query';

export function DashboardTrailForm() {
  const [form, setForm] = useQueryStates({
    search: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    authorId: parseAsString.withDefault(''),
    status: parseAsString.withDefault(ContentStatus.PUBLISHED.toString()),
    skip: parseAsString.withDefault('0'),
    take: parseAsString.withDefault('30'),
  } satisfies Record<keyof TrailSearchSchema, unknown>);

  const statusOptions = [
    { value: ContentStatus.DRAFT, label: 'Rascunho' },
    { value: ContentStatus.PUBLISHED, label: 'Publicado' },
    { value: ContentStatus.ARCHIVED, label: 'Arquivado' },
  ];

  return (
    <form
      method="get"
      className="mb-8 flex flex-col space-y-4"
      onSubmit={e => {
        e.preventDefault();
        setForm({ ...form, skip: '0', take: '30' });
      }}
    >
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <CategoriesAsyncSelect
          selectedCategory={{ id: Number(form.category) }}
          setSelectedCategory={category => setForm({ ...form, category: category.id.toString() })}
        />
        <Input type="text" name="search" placeholder="Buscar trilha" />
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <Select value={form.status.toString()} onValueChange={value => setForm({ ...form, status: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" className="w-full items-center gap-2 md:w-fit">
          Buscar
          <SearchIcon className="rotate-90" size={20} />
        </Button>
      </div>
    </form>
  );
}
