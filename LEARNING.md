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
