import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with commas */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

/** Get relative time label */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

/** Calculate XP progress percentage to next level */
export function xpProgressPercent(current: number, needed: number): number {
  if (needed === 0) return 100;
  return Math.min(100, Math.round((current / needed) * 100));
}

/** Get difficulty color class */
export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'EASY': return 'text-emerald-400 bg-emerald-400/10';
    case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10';
    case 'HARD': return 'text-red-400 bg-red-400/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
}

/** Get category icon label */
export function categoryLabel(category: string): string {
  switch (category) {
    case 'FRONTEND': return '⚡ Frontend';
    case 'BACKEND': return '🔧 Backend';
    case 'AI_ML': return '🤖 AI/ML';
    case 'SYSTEM_DESIGN': return '🏗️ System Design';
    case 'PROBLEM_SOLVING': return '🧩 Problem Solving';
    default: return category;
  }
}
