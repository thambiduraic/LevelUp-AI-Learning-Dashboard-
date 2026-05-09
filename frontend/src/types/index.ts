export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Category = 'FRONTEND' | 'BACKEND' | 'AI_ML' | 'SYSTEM_DESIGN' | 'PROBLEM_SOLVING';

export interface User {
  id: string;
  supabaseId: string;
  name: string;
  email: string;
  image?: string;
  level: number;
  totalXP: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
  settings?: any;
  xpProgress: {

    current: number;
    needed: number;
    nextLevel: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: Difficulty;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  userId: string;
}

export interface Skill {
  id: string;
  name: string;
  category: Category;
  progress: number;
  unlocked: boolean;
  xpRequired: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface XPHistory {
  id: string;
  amount: number;
  source: string;
  createdAt: string;
  userId: string;
}

export interface AIInsight {
  id: string;
  feedback: string;
  createdAt: string;
  userId: string;
}

export interface AnalyticsOverview {
  user: User;
  questCompletionRate: number;
  totalQuestsCompleted: number;
  totalQuests: number;
  weeklyXP: Array<{ date: string; xp: number }>;
  recentXPHistory: XPHistory[];
}
