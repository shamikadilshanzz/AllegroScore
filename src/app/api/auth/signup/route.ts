import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { DbUser } from '@/models/User';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const db = await getDb();
  const users = db.collection<DbUser>('users');

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'email-already-in-use' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user: DbUser = {
    email,
    passwordHash,
    role: email === 'sanirud.perera@gmail.com' ? 'admin' : 'customer',
    purchaseHistory: [],
  };
  const result = await users.insertOne(user);

  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
}


