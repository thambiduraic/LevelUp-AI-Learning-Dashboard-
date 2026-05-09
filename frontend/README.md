# LevelUp AI - Frontend

The frontend of the LevelUp AI Learning Dashboard is a modern, high-performance web application built with Next.js 14 and React.

## 🚀 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix UI)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth Client**: Supabase SSR
- **State Management**: React Hooks & Context

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Environment Variables
Create a `.env.local` file in this directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure
- `/src/app`: Next.js App Router (pages and layouts)
- `/src/components`: Reusable UI components
  - `/layout`: Sidebar, Header, etc.
  - `/dashboard`: Feature-specific cards and widgets
- `/src/lib`: Utilities, API client, and Supabase client
- `/src/types`: TypeScript definitions
- `/src/hooks`: Custom React hooks

## 🎨 Design System
The UI follows a futuristic "Learning OS" aesthetic:
- **Primary Color**: Electric Blue (#3B82F6)
- **Secondary Color**: Purple (#8B5CF6)
- **Accent Color**: Cyan (#06B6D4)
- **Background**: Slate Dark (#0F172A)
- **Surfaces**: Glassmorphic effects with 80% opacity and subtle blurs.
