import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import 'dotenv/config';

const adapter = new PrismaPg(
  new pkg.Pool({ connectionString: process.env.DATABASE_URL })
);

export const prisma = new PrismaClient({ adapter });