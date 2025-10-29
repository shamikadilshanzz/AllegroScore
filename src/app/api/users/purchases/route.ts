import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const payload = token ? verifyJwt<{ sub: string }>(token) : null;
  if (!payload?.sub) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { sheetMusicId } = await req.json();
  if (!sheetMusicId) return NextResponse.json({ error: 'missing-id' }, { status: 400 });

  const db = await getDb();
  await db.collection('users').updateOne(
    { _id: new ObjectId(payload.sub) },
    { $addToSet: { purchaseHistory: sheetMusicId } }
  );

  return NextResponse.json({ ok: true });
}


