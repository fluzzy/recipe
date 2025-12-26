import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '~/generated/prisma';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL 환경 변수가 설정되지 않았습니다.');
}

const neonAdapter = new PrismaNeon({
  connectionString,
});

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter: neonAdapter });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter: neonAdapter });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
