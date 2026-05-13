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

export type QuestStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: Difficulty;
  status: QuestStatus;
  category?: string;
  duration?: number;
  instructions?: string;
  objective?: string;
  resources?: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  userId: string;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  xpReward: number;
  lessons: Lesson[];
}

export interface Skill {
  id: string;
  name: string;
  category: Category;
  progress: number;
  unlocked: boolean;
  xpRequired: number;
  totalStudyTime: number;
  lastActivity?: string;
  prerequisiteId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  modules?: Module[];
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
  activityHeatmap: Array<{ date: string; xp: number; count: number }>;
  recentXPHistory: XPHistory[];
}
