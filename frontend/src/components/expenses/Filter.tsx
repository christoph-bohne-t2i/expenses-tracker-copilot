'use client';

import type { Category } from '@/lib/types';
import { formatDateLabel, toISODate } from '@/lib/date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Props = {
  categoryKey: string;
  from?: string;
  to?: string;
  onCategoryChange: (key: string) => void;
  onDateChange: (next: { from?: string; to?: string }) => void;
  onClear: () => void;
  categories?: Category[];
};

export default function Filters({
  categoryKey,
  from,
  to,
  onCategoryChange,
  onDateChange,
  onClear,
  categories,
}: Props) {
  const ALL_CATEGORIES = 'All';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryKey} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>{ALL_CATEGORIES}</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From date */}
          <div className="space-y-1">
            <Label htmlFor="from">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="from"
                  variant="outline"
                  className="w-40 justify-start font-normal"
                >
                  {from ? formatDateLabel(from) : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={from ? new Date(from) : undefined}
                  onSelect={(d) =>
                    onDateChange({ from: d ? toISODate(d) : undefined, to })
                  }
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To date */}
          <div className="space-y-1">
            <Label htmlFor="to">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="to"
                  variant="outline"
                  className="w-40 justify-start font-normal"
                >
                  {to ? formatDateLabel(to) : 'Pick date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={to ? new Date(to) : undefined}
                  onSelect={(d) =>
                    onDateChange({ from, to: d ? toISODate(d) : undefined })
                  }
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear */}
          <div className="self-end">
            <Button
              variant="ghost"
              className="font-normal"
              onClick={onClear}
              disabled={!from && !to && categoryKey === ALL_CATEGORIES}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
