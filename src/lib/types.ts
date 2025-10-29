export type SheetMusic = {
  id: string;
  title: string;
  composer: string;
  instrument: string;
  price: number;
  imageId: string;
  downloadUrl?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  purchaseHistory: string[];
  role: 'admin' | 'customer';
};
