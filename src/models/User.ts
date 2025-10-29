export interface DbUser {
  _id?: string;
  email: string;
  passwordHash: string;
  name?: string;
  role?: 'admin' | 'customer';
  purchaseHistory?: string[];
}


