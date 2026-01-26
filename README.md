# ☁️ SecureCloud MVP

A professional, secure personal cloud storage solution with a 100MB storage limit, built with a modern 2026 tech stack.
This project aims to teach me various important technologies and how to integrate them. 
Making sure I also learn the best security pratices and also alot of testing on the application on my knowledge of cybersecurity.
Modularixation is also another important aspect of it making sure I can expand the apllication easily without breaking and chaning alot of things- that is adding new functionalities easily or intergrating with other third party applications.

## 🚀 Tech Stack

### Frontend
- **React 19 + Vite** (Fast HMR and builds)
- **Tailwind CSS v4** (High-performance, zero-config styling)
- **Lucide React** (Consistent iconography)
- **Axios** (API communication with interceptors)

### Backend
- **Node.js & Express** (REST API)
- **Prisma 7** (Type-safe ORM with Postgres Adapter)
- **PostgreSQL** (Relational database)
- **JWT & Bcrypt** (Secure authentication & hashing)
- **Multer** (Multipart file handling)

## 🏗️ Architecture
The project follows a **Modular Three-Tier Architecture** to ensure separation of concerns:
- **Routes**: Handles URL mapping and validation.
- **Controllers**: Manages HTTP request/response logic.
- **Services**: Contains core business logic and database interactions.



## 🛡️ Core Features
- **Secure Auth**: JWT-based session management.
- **Storage Quota**: Hard 100MB limit per user enforced via database transactions.
- **File Management**: Full CRUD (Upload, List, Download, Delete).
- **Global Error Handling**: Centralized middleware for consistent API error responses.
- **Validation**: Strict schema validation using Zod.

## 🛠️ Installation & Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd secure-cloud
```
2. Backend Setup
```
cd server
npm install
Create a .env file:
DATABASE_URL="postgresql://user:password@localhost:5432/cloud_db"
JWT_SECRET="your_super_secret_key"
PORT=5000
Initialize Database:
npx prisma db push
Start Server:
npm run dev
```
3. Frontend Setup
```
cd ../client
npm install
npm run dev
```
📈 Future Roadmap
[ ] Folder-based organization

[ ] File renaming and moving

[ ] Profile picture updates

[ ] Transition to AWS S3 for cloud-scale storage
