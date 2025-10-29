
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { composers, instruments } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Shield, Upload, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addSheetMusic } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const placeholder = PlaceHolderImages.find((p) => p.id === 'admin-upload');
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(Date.now()); // State to reset form

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const isAdmin = user?.role === 'admin';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a PDF file to upload.',
      });
      return;
    }

    startTransition(async () => {
      const result = await addSheetMusic(formData);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        // Reset form by changing the key
        setFormKey(Date.now());
        setFile(null);
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: result.message || 'Could not add the sheet music. Please try again.',
        });
      }
    });
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
        <Card className="max-w-md p-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-destructive" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view this page.</p>
            <Button asChild className="mt-6">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <Image
          src={
            placeholder?.imageUrl ??
            'https://picsum.photos/seed/placeholder/1200/400'
          }
          alt="Admin dashboard"
          fill
          priority
          className="object-cover"
          data-ai-hint={placeholder?.imageHint}
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Admin Panel</h1>
            <p className="text-xl text-white/80">
              Manage Sheet Music Uploads
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload New Sheet Music</CardTitle>
            <CardDescription>
              Fill out the form to add a new piece to the collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form key={formKey} className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="title">Piece Title</Label>
                <Input id="title" name="title" placeholder="e.g., Sonata No. 14" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="composer">Composer</Label>
                  <Select name="composer" required>
                    <SelectTrigger id="composer">
                      <SelectValue placeholder="Select composer" />
                    </SelectTrigger>
                    <SelectContent>
                      {composers.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Select name="instrument" required>
                    <SelectTrigger id="instrument">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" placeholder="e.g., 5.99" required step="0.01" />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="imageId">Cover Image</Label>
                  <Select name="imageId" defaultValue="1" required>
                    <SelectTrigger id="imageId">
                      <SelectValue placeholder="Select image" />
                    </SelectTrigger>
                    <SelectContent>
                      {PlaceHolderImages.slice(0, 9).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Sheet Music File (PDF)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  className="cursor-pointer"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                <Upload className="mr-2 h-4 w-4" /> {isPending ? 'Adding...' : 'Add to Collection'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
