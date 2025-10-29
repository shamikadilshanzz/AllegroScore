'use client';
import { recommendNewSheetMusic } from '@/ai/flows/recommend-new-sheet-music';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPurchasedMusic } from '@/app/actions';
import { Wand2 } from 'lucide-react';
import React, { useState, useTransition, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { SheetMusic } from '@/lib/types';

export function RecommendationTool() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [purchasedMusic, setPurchasedMusic] = useState<SheetMusic[]>([]);

  useEffect(() => {
    if (user && user.purchaseHistory.length > 0) {
      startTransition(async () => {
        const music = await getPurchasedMusic(user.purchaseHistory);
        setPurchasedMusic(music);
      });
    } else {
      setPurchasedMusic([]);
    }
  }, [user]);


  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      
      if (!user) {
        setError("You need to be logged in to get recommendations.");
        return;
      }

      const purchasedTitles = purchasedMusic
        .map(item => item.title)
        .join(', ');

      if (!purchasedTitles) {
        setError("You haven't purchased any music yet to get recommendations.");
        return;
      }
      
      try {
        const result = await recommendNewSheetMusic({ purchaseHistory: purchasedTitles });
        setRecommendations(result.recommendations);
      } catch (e) {
        console.error(e);
        setError('Could not fetch recommendations at this time.');
      }
    });
  };

  if (!user) {
    return null; // Don't show the tool if the user is not logged in.
  }

  return (
    <Card className="bg-card/50 border-primary/20 mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wand2 className="text-accent" />
          Discover Your Next Piece
        </CardTitle>
        <CardDescription>
          Based on your purchased music, here are some new pieces you might enjoy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!recommendations && (
          <Button onClick={handleGetRecommendations} disabled={isPending}>
            {isPending ? 'Generating...' : 'Get Recommendations'}
          </Button>
        )}
        {error && <p className="text-destructive mt-4">{error}</p>}
        {recommendations && (
          <div>
            <h3 className="font-semibold mb-2">We recommend:</h3>
            <p className="text-muted-foreground">{recommendations}</p>
             <Button variant="outline" size="sm" onClick={() => setRecommendations(null)} className="mt-4">
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
