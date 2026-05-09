# LevelUp AI - Backend

The backend of the LevelUp AI Learning Dashboard is a scalable, secure REST API built with Node.js, Express, and TypeScript.

## 🚀 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Supabase Auth (JWT Validation)
- **AI Engine**: OpenAI API (GPT-4o-mini)
- **Security**: Helmet, CORS, Rate Limiting

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Neon recommended)

### 2. Environment Variables
Create a `.env` file in this directory with the following:
```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
OPENAI_API_KEY="your_openai_api_key"
FRONTEND_URL="http://localhost:3000"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```
The API will be available at [http://localhost:5000](http://localhost:5000).

## 📡 API Endpoints

### Users
- `GET /api/users/profile`: Get current user's profile and progress.
- `POST /api/users/profile`: Create/Update user profile.
- `PATCH /api/users/streak`: Increment current streak.

### Quests
- `GET /api/quests`: Fetch all quests for the user.
- `POST /api/quests`: Create a custom quest.
- `PATCH /api/quests/:id/complete`: Mark a quest as complete and award XP.
- `POST /api/quests/seed`: Seed daily quests.

### Skills
- `GET /api/skills`: Fetch skill tree nodes.
- `POST /api/skills/seed`: Initialize skill tree for new users.
- `PATCH /api/skills/:id`: Update skill progress.

### Analytics
- `GET /api/analytics/overview`: Get weekly XP history and completion rates.

### AI Mentor
- `POST /api/ai/mentor`: Generate personalized AI feedback.
- `GET /api/ai/insights`: Fetch history of AI feedback sessions.

## 📁 Project Structure
- `/src/routes`: API route definitions
- `/src/middleware`: Auth and validation middleware
- `/src/services`: Business logic (XP, AI Mentor)
- `/src/lib`: Prisma and Supabase client singletons
- `/prisma`: Database schema and migrations
