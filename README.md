# Activity5: Blog Platform (NestJS + React)

## Backend
- NestJS + TypeORM (SQLite)
- JWT Auth, Users, Posts, Comments
- Swagger at `/api`

Run:
```bash
cd backend
npm run start:dev
```

## Frontend
- React + Vite + TypeScript

Run:
```bash
cd frontend
npm run dev
```

## Env
- backend: `.env` contains `PORT` and `JWT_SECRET`
- frontend: `.env.local` contains `VITE_API_URL`

## API
- Users: CRUD `/users`
- Auth: POST `/auth/login`
- Posts: `/posts`
- Comments: `/posts/:postId/comments`

