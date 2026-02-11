import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
// Configure postgres to handle Date objects correctly
export const client = postgres(connectionString, { 
  prepare: false,
  transform: {
    undefined: null,
  },
  types: {
    date: {
      to: 1184, // timestamp OID
      from: [1082, 1083, 1114, 1184], // date, time, timestamp, timestamptz
      serialize: (x: Date) => x.toISOString(),
      parse: (x: string) => new Date(x),
    },
  },
});

export const db = drizzle(client, { schema });
