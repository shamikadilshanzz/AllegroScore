
'use client';

import { useState, useTransition, useEffect } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Lock, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPurchase, getSheetMusicById } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { SheetMusic } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

function SheetMusicDetailContent({ item }: { item: SheetMusic }) {
  const [isPurchasePending, startPurchaseTransition] = useTransition();
  const { toast } = useToast();
  const { user, addPurchase } = useAuth();
  const router = useRouter();

  const [isPurchased, setIsPurchased] = useState(false);
  
  useEffect(() => {
    if (user) {
      setIsPurchased(user.purchaseHistory.includes(item.id));
    } else {
      setIsPurchased(false);
    }
  }, [user, item.id]);

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to make a purchase.',
      });
      return;
    }

    startPurchaseTransition(async () => {
      // In a real app, you'd also pass payment details from a gateway
      const result = await processPurchase(user.id, item.id, item.title);
      if (result.success) {
        addPurchase(item.id);
        toast({
          title: 'Purchase Complete!',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Purchase Failed',
          description: result.message,
        });
      }
    });
  };

  const placeholder = PlaceHolderImages.find((p) => p.id === item.imageId);
  const price = typeof item.price === 'number' ? item.price : 0;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';
  const canPreview = isPurchased || isAdmin; // Admins can preview without purchase

  useEffect(() => {
    if (item.downloadUrl) {
      if (item.downloadUrl.startsWith('http')) {
        setPdfUrl(item.downloadUrl);
      } else {
        // For relative URLs, use the current origin
        setPdfUrl(typeof window !== 'undefined' ? `${window.location.origin}${item.downloadUrl}` : item.downloadUrl);
      }
    }
  }, [item.downloadUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={
                  placeholder?.imageUrl ??
                  'https://picsum.photos/seed/placeholder/600/800'
                }
                alt={item.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  !canPreview ? 'blur-lg scale-110' : ''
                }`}
                data-ai-hint={placeholder?.imageHint}
              />
            </div>
            {!canPreview && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                <Lock className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-white font-headline">
                  Preview Only
                </h2>
                <p className="text-white/80">
                  Purchase to unlock and view the full sheet music.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col">
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl font-bold font-headline">{item.title}</h1>
            <p className="text-2xl text-muted-foreground">{item.composer}</p>
            <div className="flex gap-2 pt-2">
              <Badge variant="secondary">{item.instrument}</Badge>
            </div>
          </div>

          <div className="mt-auto">
            {canPreview ? (
               <Button size="lg" className="w-full" asChild disabled={!item.downloadUrl}>
                <Link href={pdfUrl || '#'} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  {item.downloadUrl ? 'Download PDF' : 'Download Not Available'}
                </Link>
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="w-full" disabled={isPurchasePending}>
                    {isPurchasePending ? (
                      'Processing...'
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Buy Now - ${price.toFixed(2)}
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to purchase "{item.title}" for ${price.toFixed(2)}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePurchase}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <p className="text-sm text-muted-foreground mt-4 text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> Secure
              Transaction
            </p>
          </div>
        </div>
      </div>

      {/* PDF Preview Section */}
      {pdfUrl && (
        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold font-headline">Sheet Music Preview</h2>
            </div>
            <div className="relative w-full" style={{ minHeight: '600px' }}>
              {canPreview ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  style={{ minHeight: '600px' }}
                  title="PDF Preview"
                />
              ) : (
                <div className="relative w-full bg-muted" style={{ minHeight: '600px' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <Lock className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-2xl font-bold font-headline mb-2">
                      Purchase to View PDF
                    </h3>
                    <p className="text-muted-foreground">
                      Unlock this sheet music by purchasing it above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function SheetMusicDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<SheetMusic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        setLoading(true);
        const fetchedItem = await getSheetMusicById(id);
        if (!fetchedItem) {
          notFound();
        } else {
          setItem(fetchedItem);
        }
        setLoading(false);
      };
      fetchItem();
    }
  }, [id]);

  if (loading || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <div className="mt-auto pt-8">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <SheetMusicDetailContent item={item} />;
}
