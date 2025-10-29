
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SheetMusic } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SheetMusicCardProps {
  item: SheetMusic;
}

export function SheetMusicCard({ item }: SheetMusicCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === item.imageId);
  const price = typeof item.price === 'number' ? item.price : 0;

  return (
    <Link href={`/sheet-music/${item.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={
                placeholder?.imageUrl ??
                'https://picsum.photos/seed/placeholder/600/800'
              }
              alt={item.title}
              width={600}
              height={800}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={placeholder?.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline leading-tight">
            {item.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{item.composer}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="secondary">{item.instrument}</Badge>
          <p className="font-semibold text-lg text-primary">${price.toFixed(2)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
