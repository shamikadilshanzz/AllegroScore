'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { composers, instruments } from '@/lib/data';

interface SheetMusicFiltersProps {
  onSearchChange: (value: string) => void;
  onInstrumentChange: (value: string) => void;
  onComposerChange: (value: string) => void;
}

export function SheetMusicFilters({
  onSearchChange,
  onInstrumentChange,
  onComposerChange,
}: SheetMusicFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by piece name..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={(value) => onInstrumentChange(value === 'all' ? '' : value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by instrument" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Instruments</SelectItem>
          {instruments.map((instrument) => (
            <SelectItem key={instrument} value={instrument}>
              {instrument}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => onComposerChange(value === 'all' ? '' : value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by composer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Composers</SelectItem>
          {composers.map((composer) => (
            <SelectItem key={composer} value={composer}>
              {composer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
