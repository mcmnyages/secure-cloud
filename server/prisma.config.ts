
import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // Fix 1: Error said 'schema' expects a string, not an object
  schema: 'prisma/schema.prisma', 
  
  datasource: {
    // Fix 2: Use the "!" (non-null assertion) to tell TS: 
    // "Trust me, I have this in my .env"
    url: process.env.DATABASE_URL!, 
  },
});