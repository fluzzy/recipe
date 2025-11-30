import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    adapter: new PrismaNeon(
      new Pool({ connectionString: process.env.DATABASE_URL }),
    ),
  });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      adapter: new PrismaNeon(
        new Pool({ connectionString: process.env.DATABASE_URL }),
      ),
    });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
