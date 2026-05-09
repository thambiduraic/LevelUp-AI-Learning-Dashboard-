# GEMINI.md

# LevelUp AI Learning Dashboard — Complete AI Agent Build Instructions

You are an expert full-stack SaaS engineer and UI/UX designer.

Your task is to build a complete production-ready AI-powered learning dashboard called:

# LevelUp AI Learning Dashboard

The product must be fully functional, modern, scalable, responsive, visually polished, and optimized for real users.

This is NOT a prototype.

Build it like a real startup SaaS product.

---

# PROJECT GOAL

Build a gamified AI learning productivity dashboard that helps students and developers:

- Track learning progress
- Earn XP
- Level up
- Complete daily learning quests
- Build learning streaks
- Track skill progression
- Receive AI mentor feedback
- Stay motivated consistently

The platform should feel like:

- Duolingo for learning
- Linear-level polished UI
- A futuristic personal growth operating system

The product must prioritize:

- Clean UX
- Simplicity
- Motivation
- Daily engagement
- Fast performance
- Beautiful animations
- Scalable architecture

---

# REQUIRED TECH STACK

## Frontend

Use:

- Next.js (Latest App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Recharts

---

## Backend

Use:

- Node.js
- Express.js
- TypeScript

---

## Database

Use:

- PostgreSQL
- Prisma ORM

---

# AUTHENTICATION

Use:

- Supabase Authentication

Required auth methods:

- Email/password authentication
- Google authentication
- Secure session handling
- Persistent login
- Protected dashboard routes

---

## SUPABASE REQUIREMENTS

Implement:

- Supabase Auth
- Supabase session management
- Middleware route protection
- Auth state persistence
- Secure environment variable setup

Required pages:

- Login
- Signup
- Forgot Password
- Reset Password

---

## AI Integration

Use:

- OpenAI API

The AI should generate:

- Learning suggestions
- Personalized feedback
- Study recommendations
- Motivation feedback
- Weakness analysis

---

## Deployment Targets

Frontend:
- Vercel

Backend:
- Render

Database:
- Neon PostgreSQL

Authentication:
- Supabase

---

# UI/UX DESIGN REQUIREMENTS

---

# DESIGN STYLE

The UI must be:

- Modern
- Futuristic
- Minimal
- Dark themed
- Glassmorphism inspired
- Highly polished
- Smoothly animated
- Production quality

---

# DESIGN INSPIRATION

Use inspiration from:

- Duolingo
- Linear
- Notion

DO NOT clone designs directly.

Create an original polished experience.

---

# BRAND COLORS

Use the following design system globally.

## Primary

Electric Blue:
`#3B82F6`

## Secondary

Purple:
`#8B5CF6`

## Accent

Cyan:
`#06B6D4`

---

# BACKGROUND COLORS

Main Background:
`#0F172A`

Card Surface:
`#111827`

---

# TEXT COLORS

Primary Text:
`#F8FAFC`

Secondary Text:
`#94A3B8`

---

# TYPOGRAPHY

## Fonts

Headings:
- Inter Bold

Body:
- Inter Regular

Numbers/Stats:
- Space Grotesk

---

# UI COMPONENT STYLE

All components should include:

- Rounded corners
- Soft shadows
- Smooth hover effects
- Animated progress states
- Gradient accents
- Glass blur surfaces
- Interactive transitions

---

# RESPONSIVENESS

The entire dashboard must be:

- Fully responsive
- Mobile optimized
- Tablet optimized
- Desktop optimized

Use responsive layouts everywhere.

---

# APPLICATION STRUCTURE

---

# MAIN DASHBOARD LAYOUT

Build a professional SaaS dashboard layout.

## Left Sidebar Navigation

Create a collapsible animated sidebar.

Sidebar items:

- Dashboard
- Daily Quests
- Skill Trees
- Analytics
- AI Mentor
- Profile
- Settings

Requirements:

- Active route highlight
- Smooth animations
- Mobile drawer support
- Clean iconography
- Sticky positioning

---

## TOP HEADER

The top dashboard header must include:

- User avatar
- Current level
- XP progress
- Current streak
- Notifications
- Quick statistics

---

# AUTHENTICATION PAGES

---

# LOGIN PAGE

Build a premium login page.

Include:

- Email login
- Password login
- Google authentication
- Forgot password
- Validation messages
- Smooth animations

UI requirements:

- Centered auth card
- Glassmorphism effect
- Gradient CTA button
- Dark modern background

---

# SIGNUP PAGE

Include:

- Name
- Email
- Password
- Confirm password
- Google signup
- Terms checkbox

Add:

- Smooth onboarding experience
- Proper validation
- Success/error states

---

# FORGOT PASSWORD PAGE

Features:

- Email input
- Password reset flow
- Success states
- Error handling

---

# CORE FEATURES

---

# 1. XP & LEVEL SYSTEM

Build a complete gamification engine.

Features:

- XP gained after completing quests
- Dynamic XP progress updates
- Level unlocking
- XP history tracking
- Animated level-up effects
- XP reward notifications

---

## LEVEL SYSTEM LOGIC

Example scaling:

- Level 1 → 100 XP
- Level 2 → 250 XP
- Level 3 → 500 XP
- Level 4 → 900 XP

Use scalable formulas.

---

## XP UI

Display:

- Current level
- Current XP
- XP needed for next level
- Animated progress bar
- Level badge

Use smooth transitions and animations.

---

# 2. DAILY QUEST SYSTEM

Build a dynamic quest management system.

---

## QUEST FEATURES

Each quest must include:

- Title
- Description
- XP reward
- Difficulty
- Completion state
- Progress status

---

## QUEST ACTIONS

Users can:

- Complete quests
- Track progress
- View XP rewards
- See completion animations

---

## DAILY RESET SYSTEM

Implement:

- Daily quest reset logic
- New quests generation
- Progress persistence

---

## SAMPLE QUESTS

Examples:

- Practice React for 30 mins
- Solve 1 coding challenge
- Watch AI tutorial
- Read technical article
- Build mini project

---

# 3. SKILL TREE SYSTEM

Build an interactive futuristic skill tree interface.

---

## SKILL CATEGORIES

Create example categories:

- Frontend
- Backend
- AI/ML
- System Design
- Problem Solving

---

## SKILL NODE FEATURES

Each skill node should include:

- Skill name
- XP requirement
- Completion percentage
- Locked/unlocked state
- Connected progression path

---

## SKILL TREE UI

Requirements:

- Interactive nodes
- Animated connecting lines
- Futuristic visual style
- Hover interactions
- Unlock animations

---

# 4. STREAK TRACKING SYSTEM

Build a learning consistency tracker.

---

## STREAK FEATURES

Display:

- Current streak
- Longest streak
- Weekly consistency
- Monthly consistency

---

## VISUALIZATION

Include:

- Activity calendar
- Heatmap tracking
- Weekly streak graph
- Flame streak indicator

---

# 5. AI MENTOR SYSTEM

Build an AI mentor feedback panel using OpenAI API.

---

## AI FEATURES

Generate:

- Personalized study suggestions
- Weakness analysis
- Skill improvement tips
- Motivation feedback
- Productivity recommendations

---

## AI PANEL EXPERIENCE

The AI mentor should feel:

- Intelligent
- Motivational
- Human-like
- Helpful
- Personalized

---

## SAMPLE AI FEEDBACK

Examples:

- "Your frontend consistency improved this week."
- "You should focus more on backend fundamentals."
- "You are close to leveling up. Complete 2 more quests today."

---

# 6. ANALYTICS DASHBOARD

Build a complete analytics section.

Use Recharts.

---

## ANALYTICS FEATURES

Display:

- Weekly XP growth
- Daily productivity
- Learning consistency
- Skill progression
- Quest completion rate

---

## CHART REQUIREMENTS

Charts must be:

- Responsive
- Animated
- Interactive
- Dark-theme compatible
- Smoothly rendered

---

# DATABASE ARCHITECTURE

Use Prisma ORM with PostgreSQL.

Create proper relational models.

---

# REQUIRED DATABASE MODELS

## User

Fields:

- id
- name
- email
- image
- level
- totalXP
- streak
- createdAt
- updatedAt

---

## Quest

Fields:

- id
- title
- description
- xpReward
- difficulty
- completed
- userId
- createdAt

---

## Skill

Fields:

- id
- name
- category
- progress
- unlocked
- userId

---

## XPHistory

Fields:

- id
- amount
- source
- createdAt
- userId

---

## AIInsight

Fields:

- id
- feedback
- createdAt
- userId

---

# BACKEND REQUIREMENTS

Build secure scalable REST APIs.

---

# REQUIRED API FEATURES

Implement APIs for:

- User profile
- Quest CRUD
- XP updates
- Skill progression
- Analytics
- AI feedback generation

Use Supabase session validation for protected endpoints.

---

# BACKEND STANDARDS

Must include:

- Clean architecture
- Modular services
- Input validation
- Error handling
- Protected routes
- Secure auth validation
- Environment configuration

---

# FRONTEND REQUIREMENTS

Use reusable scalable architecture.

---

# REQUIRED FRONTEND FEATURES

Include:

- Loading skeletons
- Empty states
- Toast notifications
- Error boundaries
- Optimistic updates
- Smooth page transitions
- Reusable components

---

# REQUIRED REUSABLE COMPONENTS

Build reusable components for:

- Sidebar
- Header
- XP progress card
- Quest card
- Skill node
- Analytics card
- AI mentor card
- Activity heatmap
- Level badge
- Progress indicators

---

# ANIMATION REQUIREMENTS

Use Framer Motion extensively.

Required animations:

- Sidebar transitions
- Card hover animations
- Progress bar animations
- XP gain animations
- Level-up effects
- Modal transitions
- Page transitions

Animations should feel:

- Smooth
- Lightweight
- Premium
- Modern

Avoid excessive motion.

---

# PERFORMANCE REQUIREMENTS

Optimize for:

- Fast loading
- Smooth interactions
- Minimal re-renders
- Clean state management
- Good Lighthouse scores

---

# CODE QUALITY REQUIREMENTS

The generated project must include:

- Clean folder structure
- Scalable architecture
- Type safety
- Reusable utilities
- Proper comments
- Production-ready code

---

# RECOMMENDED FOLDER STRUCTURE

```txt
/app
/components
/features
/hooks
/lib
/services
/server
/prisma
/types
/utils
/styles
```

---

# USER EXPERIENCE GOALS

The product should make users feel:

- Motivated
- Productive
- Rewarded
- Organized
- Excited to learn daily

Every screen should reinforce progress and growth.

---

# IMPORTANT RULES

## DO

- Keep the UI minimal
- Focus on usability
- Make progress visually rewarding
- Build reusable architecture
- Prioritize responsiveness
- Use modern SaaS standards

---

## DO NOT

- Add unnecessary features
- Overcrowd screens
- Use bright white backgrounds
- Create complex navigation
- Build cluttered interfaces

---

# FINAL EXPECTATION

Deliver a fully functional production-ready SaaS dashboard that feels like a premium AI-powered learning productivity platform.

The final product should be visually stunning, smooth, scalable, responsive, and ready for real-world users.