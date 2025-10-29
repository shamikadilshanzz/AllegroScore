
import type { SheetMusic, User } from '@/lib/types';

export const instruments = ['Piano', 'Violin', 'Guitar', 'Flute', 'Cello', 'Organ', 'String Quartet'];
export const composers = [
  'Johann Sebastian Bach',
  'Ludwig van Beethoven',
  'Wolfgang Amadeus Mozart',
  'Frédéric Chopin',
  'Antonio Vivaldi',
  'Franz Liszt',
  'Johann Pachelbel',
  'Claude Debussy',
  'Isaac Albéniz',
  'Johannes Brahms'
];

// The sheet music itself is stored in Firestore.
// This data is for reference and could be used for seeding a database.
export const sheetMusic: SheetMusic[] = [
    {
    id: '1',
    title: 'Sonata No. 14 "Moonlight"',
    composer: 'Ludwig van Beethoven',
    instrument: 'Piano',
    price: 7.99,
    imageId: '1',
  },
  {
    id: '2',
    title: 'The Four Seasons',
    composer: 'Antonio Vivaldi',
    instrument: 'Violin',
    price: 12.50,
    imageId: '2',
  },
  {
    id: '3',
    title: 'Nocturne in E-flat Major, Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    instrument: 'Piano',
    price: 5.99,
    imageId: '3',
  },
  {
    id: '4',
    title: 'Toccata and Fugue in D Minor',
    composer: 'Johann Sebastian Bach',
    instrument: 'Organ',
    price: 8.99,
    imageId: '4',
  },
   {
    id: '5',
    title: 'Eine kleine Nachtmusik',
    composer: 'Wolfgang Amadeus Mozart',
    instrument: 'String Quartet',
    price: 10.00,
    imageId: '5',
  },
  {
    id: '6',
    title: 'Liebesträume No. 3',
    composer: 'Franz Liszt',
    instrument: 'Piano',
    price: 6.50,
    imageId: '6',
  },
  {
    id: '7',
    title: 'Cello Suite No. 1 in G Major',
    composer: 'Johann Sebastian Bach',
    instrument: 'Cello',
    price: 9.99,
    imageId: '7',
  },
  {
    id: '8',
    title: 'Syrinx',
    composer: 'Claude Debussy',
    instrument: 'Flute',
    price: 4.99,
    imageId: '8'
  },
   {
    id: '9',
    title: 'Asturias (Leyenda)',
    composer: 'Isaac Albéniz',
    instrument: 'Guitar',
    price: 6.99,
    imageId: '9'
  },
];
