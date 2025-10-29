import { SheetMusicCard } from './SheetMusicCard';
import type { SheetMusic } from '@/lib/types';

interface SheetMusicGridProps {
  items: SheetMusic[];
}

export function SheetMusicGrid({ items }: SheetMusicGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-lg">No sheet music found.</p>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <SheetMusicCard key={item.id} item={item} />
      ))}
    </div>
  );
}
