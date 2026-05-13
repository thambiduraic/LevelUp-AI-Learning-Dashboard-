'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Zap, GitBranch } from 'lucide-react';
import { cn, categoryLabel } from '@/lib/utils';
import type { Skill } from '@/types';

import Link from 'next/link';

interface SkillNodeProps {
  skill: Skill;
  index: number;
}

export function SkillNode({ skill, index }: SkillNodeProps) {
  const isComplete = skill.progress >= 100;

  return (
    <Link href={`/dashboard/skills/${skill.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={skill.unlocked ? { scale: 1.02, y: -4, borderColor: 'var(--brand-purple)' } : {}}
        className={cn(
          'glass-card p-5 relative overflow-hidden transition-all duration-300 cursor-pointer group shadow-lg',
          !skill.unlocked && 'opacity-50 grayscale pointer-events-none',
          skill.unlocked && !isComplete && 'hover:shadow-brand-purple/20',
          isComplete && 'border-emerald-500/30'
        )}
      >
        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl pointer-events-none" />
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1.5">
              {!skill.unlocked ? (
                <Lock className="w-4 h-4 text-text-muted flex-shrink-0" />
              ) : isComplete ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-purple flex-shrink-0 animate-pulse" />
              )}
              <h4 className="font-bold text-text-primary text-base group-hover:text-brand-purple transition-colors truncate">
                {skill.name}
              </h4>
            </div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              {categoryLabel(skill.category)}
            </span>
          </div>

          {/* Progress ring */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="rgba(30,41,59,0.5)"
                strokeWidth="4"
              />
              <motion.circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke={isComplete ? '#34d399' : '#8B5CF6'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 15}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - skill.progress / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-mono font-black text-text-primary">{skill.progress}%</span>
            </div>
          </div>
        </div>

        {/* Stats / Locked Info */}
        {!skill.unlocked ? (
          <div className="mt-2 p-2 bg-black/20 rounded-lg border border-white/5">
            <div className="text-[10px] font-bold text-text-muted flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-brand-blue" />
              Requires {skill.xpRequired} XP
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-tighter">
              <span>Progress</span>
              <span>{isComplete ? 'Mastered' : 'Learning'}</span>
            </div>
            <div className="xp-bar h-1.5 bg-surface-card border border-white/5">
              <motion.div
                className={cn(
                  "xp-bar-fill h-full rounded-full",
                  isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-brand-blue to-brand-purple"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
              />
            </div>
            <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-brand-purple">
              <span>View Learning Path</span>
              <GitBranch className="w-3 h-3" />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
