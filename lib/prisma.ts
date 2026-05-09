import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Strip sslmode from URL — we configure SSL via Pool options to avoid TLS cert errors with AWS RDS
  const needsSsl = rawUrl.includes("sslmode=");
  const connectionString = rawUrl.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");

  const pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
