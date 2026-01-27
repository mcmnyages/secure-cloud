🚀 Secure Cloud Deployment Guide
================================

This document outlines the deployment process for the Secure Cloud application, including the solutions to critical TypeScript and Database connectivity issues encountered during the 2026 deployment.

🏗️ Architecture Overview
-------------------------

* Frontend: React (Vite) → Vercel
* Backend: Node.js (Express + Prisma) → Render
* Database: PostgreSQL → Neon

🛠️ Phase 1: Backend Deployment (Render)
-------------------------------------

### 1. Repository Structure Fix

* Problem: error TS6059: File 'prisma.ts' is not under 'rootDir'.
* Cause: The lib/ folder was outside the src/ directory while tsconfig.json was strictly looking at ./src.
* Solution: Moved the lib folder inside src (src/lib/prisma.ts) to satisfy the TypeScript compiler's root directory constraints.

### 2. Build Configuration

To handle missing type definitions in the production environment, the following settings were applied on Render:

* Build Command: `npm install --include=dev && npx prisma generate && npm run build`
* Start Command: `node dist/index.js`
* Environment Variables:
  * NODE_VERSION: 22.0.0 (Matches local development).
  * DATABASE_URL: [See Database Section]

💾 Phase 2: Database Setup (Neon)
--------------------------------

### 1. Schema Synchronization (The "db push")

* Problem: Invalid prisma.user.findUnique() invocation.
* Cause: The backend was live, but the Neon database was empty (no tables).
* Solution: Ran the following command locally while temporarily connected to the Neon URL:
```
npx prisma db push
```
This synchronized the schema.prisma structure with the cloud database.
2. Connection String Optimization
To prevent "Serverless Sleep" timeouts and SSL warnings, the connection string was formatted as:
```
postgresql://[user]:[pass]@[host]/neondb?sslmode=verify-full&connect_timeout=30
```
💻 Phase 3: Frontend Deployment (Vercel)
1. Project Configuration
Framework Preset: Vite
Root Directory: client
Environment Variables:
VITE_API_URL: https://your-backend-name.onrender.com/api
2. Client-Side Routing Fix
To prevent 404 errors on page refreshes, a vercel.json was created in the client folder:
```
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
### 🧠 Lessons Learned

* **TypeScript RootDir Constraint**: TypeScript requires all imported source files to live within the defined `rootDir`. Moving `lib` into `src` is the cleanest fix.
* **DevDependencies in Production**: When compiling TS on a server (Render/Vercel), ensure `@types/node` and `typescript` are installed, even if the environment claims to be "Production".
* **Neon Serverless Connection**: Include `connect_timeout` in your DB string for serverless databases to avoid initial connection failures.
* **Schema Synchronization**: A "Live" backend is useless if the database hasn't been "pushed" to. `npx prisma db push` is your best friend for initial cloud setups.

### 🏁 Final Deployment Checklist

- ✅ Backend folder structure fixed (lib inside src)
- ✅ `DATABASE_URL` updated with `connect_timeout`
- ✅ Prisma tables pushed to Neon cloud
- ✅ CORS updated on Render to allow Vercel domain
- ✅ Vercel rewrites configured for React Router