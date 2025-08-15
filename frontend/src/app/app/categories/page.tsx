'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const qc = useQueryClient();

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => api<Category[]>('/categories'),
  });

  const [newName, setNewName] = useState('');
  const create = useMutation({
    mutationFn: () =>
      api<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim() }),
      }),
    onSuccess: () => {
      setNewName('');
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to create category'),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const rename = useMutation({
    mutationFn: () =>
      api<Category>(`/categories/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editingName.trim() }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category renamed');
      cancelEdit();
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to rename category'),
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const del = useMutation({
    mutationFn: () =>
      api<null>(`/categories/${deleteId}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
      setDeleteId(null);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : 'Failed to delete category'),
  });

  return (
    <main className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newName.trim()) return;
              create.mutate();
            }}
          >
            <Input
              placeholder="e.g., Groceries"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              type="submit"
              disabled={create.isPending || !newName.trim()}
            >
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.isLoading && <p>Loading…</p>}
          {categories.isError && (
            <p className="text-destructive">Failed to load categories.</p>
          )}
          {categories.data?.length === 0 && (
            <p className="text-muted-foreground">No categories yet.</p>
          )}
          <ul className="space-y-2">
            {categories.data?.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                {editingId === c.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => rename.mutate()}
                      disabled={rename.isPending || !editingName.trim()}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{c.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(c)}
                    >
                      Rename
                    </Button>
                    <Dialog
                      open={deleteId === c.id}
                      onOpenChange={(open) => setDeleteId(open ? c.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete “{c.name}”?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">
                          This will detach it from any expenses and remove the
                          category.
                        </p>
                        <DialogFooter className="mt-4">
                          <Button
                            variant="ghost"
                            onClick={() => setDeleteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => del.mutate()}
                            disabled={del.isPending}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
