# Stage 1: Build
FROM node:22-slim AS builder
# Install OpenSSL (Required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install

COPY server/ .

# Generate Prisma Client (This creates the 'node_modules/.prisma' folder)
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-slim
# Install OpenSSL in the production image too!
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy production essentials
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Crucial: Copy the prisma folder so you can run 'db push' later
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/index.js"]