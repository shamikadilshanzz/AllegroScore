import { NextRequest } from 'next/server';
import { getGridFsBucket } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Handle Next.js 15 params (could be Promise)
    const resolvedParams = await Promise.resolve(params);
    const fileId = resolvedParams.id;

    if (!fileId) {
      return new Response('File ID is required', { status: 400 });
    }

    // Use the same bucket name as in the upload ('sheetMusic')
    const bucket = await getGridFsBucket('sheetMusic');
    
    let id: ObjectId;
    try {
      id = new ObjectId(fileId);
    } catch (error) {
      return new Response('Invalid file ID', { status: 400 });
    }

    // Check if file exists
    const files = await bucket.find({ _id: id }).toArray();
    if (files.length === 0) {
      return new Response('File not found', { status: 404 });
    }
    
    const file = files[0] as any;
    const stream = bucket.openDownloadStream(id);

    // Read the entire stream into a buffer for Next.js Response
    const chunks: Buffer[] = [];
    
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        resolve();
      });
      stream.on('error', (err: Error) => {
        reject(err);
      });
    });
    
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        'Content-Type': file.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${file.filename || 'file.pdf'}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return new Response('Internal server error', { status: 500 });
  }
}


