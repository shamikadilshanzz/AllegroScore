
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password?: string) => Promise<{ success: boolean; error?: string | null }>;
  addPurchase: (sheetMusicId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchMe(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await fetchMe();
      setUser(me);
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) return false;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser({
        id: data.id,
        email: data.email,
        name: data.email.split('@')[0],
        purchaseHistory: data.purchaseHistory ?? [],
        role: data.role,
      });
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };

  const signup = async (email: string, password?: string) => {
    if (!password) return { success: false, error: 'Password is required.' };
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 201) return { success: true };
      const data = await res.json();
      return { success: false, error: data?.error ?? 'unknown' };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: 'unknown' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addPurchase = async (sheetMusicId: string) => {
    if (!user) return;
    try {
      await fetch('/api/users/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetMusicId }),
      });
      setUser((currentUser) => {
        if (!currentUser) return null;
        const newPurchaseHistory = [...currentUser.purchaseHistory, sheetMusicId];
        return { ...currentUser, purchaseHistory: newPurchaseHistory };
      });
    } catch (e) {
      console.error('Error updating purchase history', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, addPurchase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
