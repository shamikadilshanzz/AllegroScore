import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';
import type { DbUser } from '@/models/User';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const db = await getDb();
  const users = db.collection<DbUser>('users');
  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'invalid-credentials' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'invalid-credentials' }, { status: 401 });
  }

  const role = user.email === 'sanirud.perera@gmail.com' ? 'admin' : (user.role ?? 'customer');

  const token = signJwt({
    sub: user._id?.toString(),
    email: user.email,
    role,
  });

  const res = NextResponse.json({
    id: user._id?.toString(),
    email: user.email,
    role,
    purchaseHistory: user.purchaseHistory ?? [],
  });
  res.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}


