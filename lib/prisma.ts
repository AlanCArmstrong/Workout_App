import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
// This prevents build failures when no database is configured yet
export const prisma = 
  process.env.DATABASE_URL 
    ? (globalForPrisma.prisma ?? new PrismaClient())
    : null as any as PrismaClient

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma
}
