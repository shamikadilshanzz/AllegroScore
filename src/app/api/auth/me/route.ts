import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { getDb } from '@/lib/mongodb';
import type { DbUser } from '@/models/User';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ user: null });
  const payload = verifyJwt<{ sub: string }>(token);
  if (!payload?.sub) return NextResponse.json({ user: null });

  const db = await getDb();
  const users = db.collection<DbUser>('users');
  const user = await users.findOne({ _id: new (await import('mongodb')).ObjectId(payload.sub) });
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: user._id?.toString(),
      email: user.email,
      role: user.email === 'sanirud.perera@gmail.com' ? 'admin' : (user.role ?? 'customer'),
      purchaseHistory: user.purchaseHistory ?? [],
    },
  });
}


