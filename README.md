# Content Broadcasting System

Backend for a subject-based content distribution platform. Teachers can upload content, and Principals manage the approval workflow before content is broadcasted to students.

## Features
- JWT Authentication with RBAC (Principal/Teacher)
- Cloudinary Integration for cloud storage
- Local disk backup for all uploads
- Subject-based rotation and scheduling
- Public API with rate limiting
- Usage analytics tracking

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in a `.env` file:
   ```env
   PORT=5000
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db
   DB_PORT=your_port
   JWT_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=name
   CLOUDINARY_API_KEY=key
   CLOUDINARY_API_SECRET=secret
   ```
3. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Content Management
- `POST /api/content/upload` (Teacher)
- `GET /api/content/my` (Teacher)
- `GET /api/content/all` (Principal - supports pagination/filters)
- `PUT /api/content/:id/status` (Principal)

### Broadcasting
- `GET /content/live/:teacherId` (Public - Rate limited)

## Note on Database
The system uses Sequelize and will automatically sync the database schema when the server starts in development mode.
