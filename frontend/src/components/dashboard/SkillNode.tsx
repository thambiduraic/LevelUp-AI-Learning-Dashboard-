'use client';

import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import { cn, categoryLabel } from '@/lib/utils';
import type { Skill } from '@/types';

interface SkillNodeProps {
  skill: Skill;
  index: number;
}

export function SkillNode({ skill, index }: SkillNodeProps) {
  const isComplete = skill.progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={skill.unlocked ? { scale: 1.02, y: -2 } : {}}
      className={cn(
        'glass-card p-4 relative overflow-hidden transition-all duration-300',
        !skill.unlocked && 'opacity-50',
        skill.unlocked && !isComplete && 'hover:border-brand-blue/30',
        isComplete && 'border-emerald-500/30'
      )}
    >
      {/* Completion overlay */}
      {isComplete && (
        <div className="absolute inset-0 bg-emerald-500/3 rounded-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            {!skill.unlocked ? (
              <Lock className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            ) : isComplete ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-brand-blue flex-shrink-0 animate-pulse-slow" />
            )}
            <h4 className="font-semibold text-text-primary text-sm truncate">{skill.name}</h4>
          </div>
          <span className="text-xs text-text-muted">{categoryLabel(skill.category)}</span>
        </div>

        {/* Progress ring / percentage */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="rgba(30,41,59,0.8)"
              strokeWidth="3"
            />
            <motion.circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke={isComplete ? '#34d399' : '#3B82F6'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - skill.progress / 100) }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.05 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-text-primary">{skill.progress}%</span>
          </div>
        </div>
      </div>

      {/* XP required */}
      {!skill.unlocked && (
        <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
          <Lock className="w-3 h-3" />
          Requires {skill.xpRequired} XP to unlock
        </div>
      )}

      {/* Progress bar */}
      {skill.unlocked && !isComplete && (
        <div className="mt-2">
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${skill.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.05 + 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
