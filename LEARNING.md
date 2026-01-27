
# 📚 Learning Journey: SecureCloud MVP

## 🚀 **Technologies Learned**

- **React 19 + Vite**: Modern frontend setup with fast builds and Hot Module Replacement (HMR).
- **Tailwind CSS v4**: Utility-first styling with responsive design capabilities.
- **Node.js + Express**: Building RESTful APIs and handling middleware for robust backend functionality.
- **Prisma 7**: Type-safe database interactions using PostgreSQL.
- **JWT & Bcrypt**: Secure authentication implementation and password hashing.
- **Multer**: Efficient handling of file uploads and multipart forms.

## 🔍 **Key Challenges & Solutions**

- **Challenge**: Securely implementing JWT authentication.
  **Solution**: Utilized `jsonwebtoken` and `bcrypt` for token generation and password hashing. Learned about token expiration and refresh tokens to enhance security.

- **Challenge**: Enforcing a 100MB storage quota per user.
  **Solution**: Implemented a database transaction to check and update storage usage before allowing file uploads.

- **Challenge**: Modularizing the backend for scalability.
  **Solution**: Adopted a three-tier architecture (routes, controllers, services) to ensure separation of concerns and modular design.

## 💡 **Best Practices Discovered**

- **Security**: Always validate user input, sanitize database queries, and enforce HTTPS.
- **Testing**: Write comprehensive unit and integration tests for critical features such as authentication and file uploads.
- **Modularity**: Keep components small and reusable. Utilize dependency injection for services to enhance maintainability.

## 📈 **Future Improvements**

- Explore **AWS S3** for scalable and cost-effective cloud storage.
- Implement **folder-based organization** and file renaming to improve user experience.
- Add **end-to-end testing** using tools like Cypress or Playwright to ensure system-wide functionality.

## 📔 **Engineering Logs**

### Resolving the TypeScript TS6059 Build Error

**The Problem**: The TypeScript compiler (tsc) encountered error TS6059, indicating that a file (e.g., prisma.ts) was outside the defined rootDir.

**Solution**: Moved the lib folder containing prisma.ts inside the src directory to ensure all source code is within the rootDir.

### Resolving Full-Stack Deployment Failures

**The "Vanishing Types" Problem (TS2688)**

*The Issue*: Render failed during build with "Cannot find type definition file for 'node'".

*Solution*:
- Moved `@types/node` from devDependencies to dependencies.
- Updated the Render build command to `npm install --include=dev` to ensure type definitions are included.

**The "Homeless File" Problem (TS6059)**

*The Issue*: Error related to files not being under the `rootDir`.

*Solution*: Restructured the project by moving the lib folder inside src (e.g., `src/lib/prisma.ts`).

**The "Ghost Database" Problem (Invalid invocation)**

*The Issue*: Server crashes on login with Prisma errors.

*Solution*:
- Ran `npx prisma db push` locally to synchronize the schema with the Neon database.
- Added `&connect_timeout=30` to the `DATABASE_URL` in Render to allow time for the database to start up.

💡 **Why `npx prisma db push` worked**: Unlike `prisma migrate`, which maintains a history of changes, `db push` immediately applies the schema changes to the database, making it ideal for initial cloud database setup.
