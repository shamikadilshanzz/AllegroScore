import { MongoClient, GridFSBucket } from 'mongodb';

const uriEnv = process.env.MONGODB_URI;

if (!uriEnv) {
  throw new Error('MONGODB_URI is not set. Add it to .env.local and restart.');
}

const connectionString: string = uriEnv;

const globalForMongo = global as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function getMongoClient(): Promise<MongoClient> {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(connectionString);
    globalForMongo.mongoClientPromise = client.connect();
  }
  return globalForMongo.mongoClientPromise;
}

export async function getDb(dbName = process.env.MONGODB_DB || 'allegroscore') {
  const client = await getMongoClient();
  return client.db(dbName);
}

export async function getGridFsBucket(bucketName = 'files') {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName });
}


