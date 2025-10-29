
'use server';

import type { GridFSBucket, ObjectId as ObjectIdType } from 'mongodb';
import { getDb, getGridFsBucket } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import type { SheetMusic } from '@/lib/types';

export async function processPurchase(userId: string, sheetMusicId: string, title: string) {
  console.log(`Processing purchase for ${sheetMusicId} by user ${userId}`);
  // In a real app, this would handle payment gateway integration.
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is handled client-side in AuthContext for this demo.
  
  console.log(`Purchase successful for ${title}`);
  return { success: true, message: `Successfully purchased "${title}"!` };
}

export async function addSheetMusic(formData: FormData): Promise<{ success: boolean; message: string; }> {
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const composer = formData.get('composer') as string;
  const instrument = formData.get('instrument') as string;
  const price = formData.get('price') as string;
  const imageId = formData.get('imageId') as string;

  if (!file || !title || !composer || !instrument || !price || !imageId) {
    return { success: false, message: 'Missing required form fields.' };
  }

  try {
    // 1. Store file in MongoDB GridFS
    const bucket: GridFSBucket = await getGridFsBucket('sheetMusic');
    const filename = `${Date.now()}_${file.name}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type || 'application/pdf',
    });
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await new Promise<void>((resolve, reject) => {
      Readable.from(fileBuffer).pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve());
    });
    const fileId = uploadStream.id?.toString();
    const downloadUrl = `/api/files/${fileId}`;

    // 2. Prepare sheet music data to store in MongoDB
    const newMusic: Omit<SheetMusic, 'id'> = {
      title,
      composer,
      instrument,
      price: parseFloat(price) || 0,
      imageId,
      downloadUrl: downloadUrl,
    };
    
    // 3. Insert metadata into MongoDB collection
    const db = await getDb();
    const result = await db.collection('sheetMusic').insertOne(newMusic);
    return { success: true, message: `"${newMusic.title}" has been added with ID: ${result.insertedId.toString()}` };

  } catch (e: any) {
    console.error('Error adding sheet music:', e);
    return { success: false, message: e.message || 'Failed to add sheet music.' };
  }
}

export async function getSheetMusic(): Promise<SheetMusic[]> {
  try {
    const db = await getDb();
    const list = await db.collection('sheetMusic').find({}).sort({ _id: -1 }).toArray();
    return list.map((doc: any) => ({ id: doc._id.toString(), title: doc.title, composer: doc.composer, instrument: doc.instrument, price: doc.price, imageId: doc.imageId, downloadUrl: doc.downloadUrl }));
  } catch (error) {
    console.error("Error fetching sheet music: ", error);
    return [];
  }
}

export async function getSheetMusicById(id: string): Promise<SheetMusic | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('sheetMusic').findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return { id: doc._id.toString(), title: doc.title, composer: doc.composer, instrument: doc.instrument, price: doc.price, imageId: doc.imageId, downloadUrl: doc.downloadUrl } as SheetMusic;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

export async function getPurchasedMusic(purchaseHistory: string[]): Promise<SheetMusic[]> {
    if (purchaseHistory.length === 0) return [];
    
    try {
        const musicPromises = purchaseHistory.map(id => getSheetMusicById(id));
        const results = await Promise.all(musicPromises);
        return results.filter((item): item is SheetMusic => item !== null);
    } catch (error) {
        console.error("Error fetching purchased music:", error);
        return [];
    }
}
