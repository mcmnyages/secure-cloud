import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import 'dotenv/config';

const adapter = new PrismaPg(
  new pkg.Pool({ connectionString: process.env.DATABASE_URL })
);


// @ts-ignore: This is a known workaround for BigInt JSON serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const prisma = new PrismaClient({ adapter });