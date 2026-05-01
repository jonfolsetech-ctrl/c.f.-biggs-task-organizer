# C.F. Biggs Task Organizer

A simple task organizing web app built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and cookie-based authentication.

## Features

- Email/password registration and login
- Add tasks with title, description, due date, time, priority, and status
- Dashboard for today, upcoming, overdue, and completed work
- Task list with status filters
- Calendar-style schedule grouped by date
- Quick status updates: To Do, In Progress, Completed
- Completion timestamp tracking
- Progress summary cards
- Responsive business-style UI

## Local setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open:

```txt
http://localhost:3000/register
```

## Production deployment

Set these environment variables in your host:

```txt
DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_APP_NAME
```

Then run:

```bash
npm run build
npx prisma migrate deploy
npm run start
```

## Future expansion ideas

- Reminders and notifications
- Drag-and-drop calendar scheduling
- Recurring tasks
- Team assignments
- AI scheduling suggestions
- Task audit history
