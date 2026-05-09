# LevelUp AI Learning Dashboard - Implementation Plan

## Goal Description
Build a complete, production-ready, AI-powered learning dashboard. The application will be a gamified productivity platform (similar to Duolingo/Linear) featuring XP, level up logic, daily quests, skill trees, streak tracking, and an AI mentor. 

The tech stack is:
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Supabase Authentication
- **AI**: OpenAI API

## User Review Required
> [!IMPORTANT]
> **API Keys & External Services:** 
> You will need to provision external services for this application. Once we begin execution, I will guide you to set up `.env` files with:
> 1. **Supabase**: URL and Anon Key (for Auth)
> 2. **Neon PostgreSQL**: Database Connection URL (for Prisma)
> 3. **OpenAI**: API Key (for AI Mentor)

> [!WARNING]
> **Architecture Decision:**
> The `GEMINI.md` specifies Next.js for Frontend and Express.js for Backend, but also recommends a single folder structure like `/app`, `/components`, `/server`, `/prisma`. 
> 
> **My proposal**: I will set up a monorepo-style structure within `e:\LevelUp-Ai-OS` using a unified package.json or separate `/frontend` and `/backend` directories for clean separation of concerns, which makes deploying to Vercel (frontend) and Render (backend) straightforward. Let me know if you prefer a single Next.js app that handles both (via Next.js API routes), which is easier to manage but deviates slightly from the "Express.js" requirement.

## Open Questions
1. **Architecture Preference**: Should I create separate `/frontend` and `/backend` folders, or combine them into a single Next.js repository using Next.js API Routes instead of Express.js? (Separate folders align best with the Vercel/Render deployment instructions).
2. **Supabase Auth Strategy**: Should we handle Supabase Auth purely on the frontend (saving tokens in cookies) and validating those tokens in the Express backend middleware?

## Proposed Changes

### Phase 1: Foundation & Scaffold
- Initialize `/backend` with Node.js, Express, TypeScript, and Prisma.
- Initialize `/frontend` with Next.js (App Router), Tailwind, Shadcn UI.
- Set up global styles (Dark theme, Primary/Secondary/Accent colors, fonts).

### Phase 2: Database & Backend Models
- Define Prisma schema (`User`, `Quest`, `Skill`, `XPHistory`, `AIInsight`).
- Create Express routes for User Profile, Quests, XP updates, Skills, Analytics, and AI generation.
- Implement Supabase Auth middleware to protect backend routes.

### Phase 3: Frontend Auth & Core Layout
- Integrate Supabase Auth in Next.js (Login, Signup, Forgot Password pages).
- Build the core dashboard layout (Animated Sidebar, Top Header).
- Implement reusable UI components (Glassmorphism cards, buttons).

### Phase 4: Feature Implementation
- **Gamification Engine**: XP progress card, level calculation logic, streak tracker, animated level badges.
- **Quest System**: Daily quest cards, completion actions, reset logic.
- **Skill Tree**: Interactive nodes, connecting paths, unlock mechanism.
- **Analytics**: Integration with Recharts for XP growth, consistency heatmap.
- **AI Mentor**: OpenAI integration for personalized feedback.

### Phase 5: Polish & Polish
- Apply Framer Motion animations (page transitions, hover states, level up effects).
- Responsive design tuning (mobile/tablet/desktop).

## Verification Plan
### Automated & Manual Verification
- **Auth**: Test signup, login, session persistence, and protected routes.
- **Backend API**: Verify Prisma CRUD operations, JWT validation from Supabase, and error handling.
- **UI/UX**: Check visual fidelity against the dark-themed, glassmorphic design system requirements.
- **AI Integration**: Validate the OpenAI prompt responses and ensure they return structured actionable feedback.
- **Animations & Interactivity**: Ensure smooth Framer Motion transitions and responsive charts.
