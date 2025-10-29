
import { getSheetMusic } from '@/app/actions';
import { SheetMusicClientPage } from '@/components/SheetMusicClientPage';
import { RecommendationTool } from '@/components/RecommendationTool';
import { Music } from 'lucide-react';

export default async function Home() {
  const sheetMusic = await getSheetMusic();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center my-8 md:my-16 flex flex-col items-center">
        <Music className="w-16 h-16 text-primary" />
        <h1 className="text-5xl font-bold tracking-tight font-headline mt-4">
          Allegro
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Discover, purchase, and play from our vast collection of digital sheet
          music.
        </p>
      </section>

      <RecommendationTool />
      
      <SheetMusicClientPage initialItems={sheetMusic} />
    </div>
  );
}
