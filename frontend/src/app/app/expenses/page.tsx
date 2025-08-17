'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Category, Expense } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Filters from '@/components/expenses/Filter';

export default function ExpensesPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({
    from: undefined,
    to: undefined,
  });

  const ALL_CATEGORIES = 'All';
  const qc = useQueryClient();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => api<Category[]>('/categories'),
    placeholderData: (prev) => prev,
  });

  const [categoryKey, setCategoryKey] = useState<string>(ALL_CATEGORIES);

  function buildExpensesUrl() {
    const qs = new URLSearchParams();
    if (range.from) qs.set('from', range.from);
    if (range.to) qs.set('to', range.to);
    qs.set('categoryId', categoryKey);
    const q = qs.toString();
    return `/expenses${q ? `?${q}` : ''}`;
  }

  const list = useQuery({
    queryKey: [
      'expenses',
      { category: categoryKey, from: range.from ?? null, to: range.to ?? null },
    ],
    queryFn: () => api<Expense[]>(buildExpensesUrl()),
    placeholderData: (prev) => prev,
  });

  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
  });

  const create = useMutation({
    mutationFn: () =>
      api<Expense>('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          description: form.description,
          amount: Number(form.amount),
          date: form.date,
          categoryId: form.categoryId || null,
        }),
      }),
    onSuccess: () => {
      setForm((f) => ({ ...f, description: '', amount: '' }));
      qc.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to add epxense'),
  });

  return (
    <main className="space-y-6">
      <Filters
        categoryKey={categoryKey}
        from={range.from}
        to={range.to}
        onCategoryChange={setCategoryKey}
        onDateChange={(next) => setRange((r) => ({ ...r, ...next }))}
        onClear={() => {
          setRange({});
        }}
        categories={categories.data}
      />
      <Card>
        <CardHeader>
          <CardTitle>Add expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3 sm:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.categoryId || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.data?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-4">
              <Button type="submit" disabled={create.isPending}>
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {list.isLoading ? (
            <p>Loading…</p>
          ) : list.isError ? (
            <p className="text-destructive">Failed to load.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data!.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>
                      {new Date(e.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{e.category?.name ?? '-'}</TableCell>
                    <TableCell className="text-right">
                      € {Number(e.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {list.data!.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No expenses yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
