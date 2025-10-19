# Activity5 Blog Platform

Hey! So I built this blog platform for Activity 5. It's a full-stack app with a React frontend and NestJS backend. Pretty cool stuff!

## What I Made

This is basically a simple blog where you can:
- Sign up and log in (with JWT tokens)
- Create posts with titles and content
- View all your posts in a nice sidebar
- Add comments to posts
- Everything's connected to a SQLite database

## Backend (NestJS)

I used NestJS with TypeORM for the backend. It handles:
- User authentication with JWT
- CRUD operations for users, posts, and comments
- SQLite database (super easy to set up)
- Swagger docs at `http://localhost:3000/api` (check it out!)

To run the backend:
```bash
cd backend
npm install
npm run start:dev
```

## Frontend (React)

The frontend is built with React + Vite + TypeScript. I made it look pretty with a dark theme and a two-column layout - posts creation on the left, recent posts on the right.

To run the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Environment Setup

You'll need to create these files:

**Backend** (create `.env` in backend folder):
```
PORT=3000
JWT_SECRET=supersecret
```

**Frontend** (create `.env.local` in frontend folder):
```
VITE_API_URL=http://localhost:3000
```

## API Endpoints

Here are the main endpoints I implemented:
- `POST /users` - Register new user
- `POST /auth/login` - Login user
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `GET /posts/:id` - Get specific post
- `POST /posts/:postId/comments` - Add comment
- `GET /posts/:postId/comments` - Get comments for a post

## How to Test

1. Start both backend and frontend servers
2. Go to `http://localhost:5173`
3. Register a new account
4. Login and start creating posts!
5. Check out the API docs at `http://localhost:3000/api`

That's it! Thank you! :)

