# ☁️ **SecureCloud MVP: My Learning Journey**

*A modern, secure personal cloud storage solution built for learning, creativity, and scalability.*

---

## 🌟 **Project Vision**
SecureCloud MVP is **my learning-driven project** to explore modern web development, cybersecurity, and modular architecture. It’s a **100MB personal cloud storage** solution designed with a focus on **security, scalability, and maintainability**. This project is my playground to experiment, learn, and grow as a developer.

---

## 🚀 **Tech Stack**

### **Frontend**
- **React 19 + Vite**: Blazing-fast builds and Hot Module Replacement (HMR).
- **Tailwind CSS v4**: Utility-first styling for rapid, responsive UI development.
- **Lucide React**: Sleek, consistent iconography.
- **Axios**: Robust API communication with interceptors for request/response handling.

### **Backend**
- **Node.js & Express**: RESTful API for seamless client-server communication.
- **Prisma 7**: Type-safe ORM with PostgreSQL for efficient database management.
- **PostgreSQL**: Reliable relational database for structured data storage.
- **JWT & Bcrypt**: Secure authentication and password hashing.
- **Multer**: Efficient multipart file handling for uploads.

---

## 🏗️ **Architecture**
The project follows a **Modular Three-Tier Architecture** for clean separation of concerns:
- **Routes**: URL mapping and validation.
- **Controllers**: HTTP request/response logic.
- **Services**: Core business logic and database interactions.

---

## 🛡️ **Core Features**

- ✅ **Secure Authentication**: JWT-based session management
- ✅ **Storage Quota**: Enforced 100MB limit per user via database transactions
- ✅ **File Management**: Full CRUD operations (Upload, List, Download, Delete)
- ✅ **Global Error Handling**: Centralized middleware for consistent API responses
- ✅ **Validation**: Strict schema validation using **Zod**

---

## 🛠️ **Installation & Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/mcmnyages/secure-cloud.git
cd secure-cloud
```
2. Backend Setup
cd server
npm install
```
Create a .env file:
DATABASE_URL="postgresql://user\:password@localhost:5432/cloud_db"
JWT_SECRET="your_super_secret_key"
PORT=5000
```
Initialize the database and start the server:
```
npx prisma db push
npm run dev
```

3. Frontend Setup
```
cd ../client
npm install
npm run dev
```
📈 Future Roadmap

Folder-based organization for intuitive file management.
File renaming and moving functionality.
Profile picture updates for user personalization.
Transition to AWS S3 for scalable cloud storage.

💡 Why This Project?
This project is my learning journey to master:

Modern web development (React 19, Vite, Tailwind CSS).
Backend architecture (Node.js, Express, Prisma).
Cybersecurity best practices (JWT, Bcrypt, validation).
Modular design for easy scalability and third-party integrations.

🤝 Contribute
Contributions are welcome! Open an issue or submit a PR to help improve SecureCloud MVP.

🌐 Live Demo (Coming Soon!)
📂 GitHub Repository

Created with ❤️ by McMnyages
