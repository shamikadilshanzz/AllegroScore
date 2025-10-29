
'use client';

import { SheetMusicGrid } from '@/components/SheetMusicGrid';
import { getPurchasedMusic } from '@/app/actions';
import { BookMarked } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import type { SheetMusic } from '@/lib/types';

export default function LibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchasedMusic, setPurchasedMusic] = useState<SheetMusic[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/login');
    }
    if (user) {
      startTransition(async () => {
        const music = await getPurchasedMusic(user.purchaseHistory);
        setPurchasedMusic(music);
      });
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
       <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <BookMarked className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">My Library</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        All your purchased sheet music in one place.
      </p>

      {isPending ? (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
           <p>Loading your library...</p>
         </div>
      ) : purchasedMusic.length > 0 ? (
        <SheetMusicGrid items={purchasedMusic} />
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Your library is empty</h2>
          <p className="text-muted-foreground mt-2">
            Start browsing to find your next piece!
          </p>
        </div>
      )}
    </div>
  );
}
