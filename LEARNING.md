# 📚 Learning Journey: SecureCloud MVP

## 🚀 **Technologies Learned**
- **React 19 + Vite**: How to set up a modern frontend with fast builds and HMR.
- **Tailwind CSS v4**: Utility-first styling and responsive design.
- **Node.js + Express**: Building a RESTful API and handling middleware.
- **Prisma 7**: Type-safe database interactions with PostgreSQL.
- **JWT & Bcrypt**: Implementing secure authentication and password hashing.
- **Multer**: Handling file uploads and multipart forms.

## 🔍 **Key Challenges & Solutions**
- **Challenge**: Implementing JWT authentication securely.
  **Solution**: Used `jsonwebtoken` and `bcrypt` for token generation and password hashing. Learned about token expiration and refresh tokens.
- **Challenge**: Enforcing a 100MB storage quota per user.
  **Solution**: Added a database transaction to check and update storage usage before file uploads.
- **Challenge**: Modularizing the backend for scalability.
  **Solution**: Adopted a three-tier architecture (routes, controllers, services) for separation of concerns.

## 💡 **Best Practices Discovered**
- **Security**: Always validate user input, sanitize database queries, and use HTTPS.
- **Testing**: Write unit and integration tests for critical features (e.g., authentication, file uploads).
- **Modularity**: Keep components small and reusable. Use dependency injection for services.

## 📈 **Future Improvements**
- Explore **AWS S3** for scalable cloud storage.
- Implement **folder-based organization** and file renaming.
- Add **end-to-end testing** with tools like Cypress or Playwright.






Issues 
📔 Engineering Log: Resolving the TypeScript TS6059 Build Error
The Problem: The TypeScript compiler (tsc) failed with error TS6059, stating that a file (in this case, prisma.ts) was not under the defined rootDir.

Possible Causes Investigated:

Missing Type Definitions: Thought TS2688 was the root (missing Node types), which we fixed by forcing @types/node and using --include=dev.

Environment Mismatch: Thought Render was using an old Node version (fixed via NODE_VERSION variable).

Folder Structure Violation: The compiler's rootDir was set to src, but the project was importing files from a lib folder located outside of src.

The Solution That Worked: Moving the lib folder inside the src directory. By restructuring the project to src/lib/prisma.ts, all source code became contained within the designated rootDir. This allowed the compiler to successfully map the entire project into the dist folder without "out-of-bounds" errors.