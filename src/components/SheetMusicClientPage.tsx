'use client';

import { useState, useMemo } from 'react';
import { SheetMusicFilters } from './SheetMusicFilters';
import { SheetMusicGrid } from './SheetMusicGrid';
import type { SheetMusic } from '@/lib/types';

interface SheetMusicClientPageProps {
  initialItems: SheetMusic[];
}

export function SheetMusicClientPage({ initialItems }: SheetMusicClientPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [composerFilter, setComposerFilter] = useState('');

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const instrumentMatch = instrumentFilter ? item.instrument === instrumentFilter : true;
      const composerMatch = composerFilter ? item.composer === composerFilter : true;
      return searchMatch && instrumentMatch && composerMatch;
    });
  }, [initialItems, searchQuery, instrumentFilter, composerFilter]);

  return (
    <div>
      <SheetMusicFilters
        onSearchChange={setSearchQuery}
        onInstrumentChange={setInstrumentFilter}
        onComposerChange={setComposerFilter}
      />
      <SheetMusicGrid items={filteredItems} />
    </div>
  );
}
