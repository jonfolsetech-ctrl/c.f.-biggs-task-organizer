# CF Biggs Task Organizer

A production-ready MVP office task organizer for CF Biggs staff.

## Features

- User login and registration
- Dashboard stats
- Create, edit, delete, assign, and complete tasks
- Due dates, priority levels, status, and reminder times
- In-app notifications
- Optional SMTP email reminders
- Search and filter tasks
- Manager/admin view for all tasks
- User view for assigned/created tasks
- PostgreSQL database
- Docker Compose for local database
- GitHub-ready repo structure

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Auth: JWT
- Validation: Zod
- Reminders: node-cron
- Email: Nodemailer

## Quick Start

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd cf-biggs-task-organizer
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run dev
```

Backend runs on:

```txt
http://localhost:4000
```

### 4. Frontend setup

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## First Manager Account

Register a user through the app, then promote the user:

```bash
cd backend
npm run db:promote -- manager@example.com
```

Or run SQL manually:

```sql
UPDATE users SET role = 'MANAGER' WHERE email = 'manager@example.com';
```

## Environment Variables

### Backend

See `backend/.env.example`.

### Frontend

See `frontend/.env.example`.

## GitHub Deployment Notes

This repo is ready to push to GitHub.

Recommended deployment:

- Backend: Render, Railway, Fly.io, or AWS
- Database: Managed PostgreSQL
- Frontend: Vercel, Netlify, Render static site, or AWS Amplify

For production:

1. Set `NODE_ENV=production`.
2. Use a strong `JWT_SECRET`.
3. Use HTTPS.
4. Restrict registration or replace it with invite-only onboarding.
5. Use a managed PostgreSQL instance.
6. Set `FRONTEND_URL` to the deployed frontend domain.
7. Set `VITE_API_URL` to the deployed backend API URL.
8. Configure SMTP if email reminders are needed.

## Security Notes

- Passwords are hashed with bcrypt.
- JWTs expire after 8 hours.
- API inputs are validated with Zod.
- Helmet is enabled.
- CORS is restricted by `FRONTEND_URL`.
- Managers/admins can view all tasks; regular users only see assigned/created tasks.
- Production upgrade recommended: use HTTP-only secure cookies instead of localStorage JWTs.

## Project Structure

```txt
backend/
frontend/
docker-compose.yml
README.md
```
