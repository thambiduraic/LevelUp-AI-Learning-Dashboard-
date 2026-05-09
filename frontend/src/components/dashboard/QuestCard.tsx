'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Zap, Clock, Trophy } from 'lucide-react';
import { cn, difficultyColor } from '@/lib/utils';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => Promise<void>;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(quest.completed);

  const handleComplete = async () => {
    if (completed || completing) return;
    setCompleting(true);
    try {
      await onComplete(quest.id);
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card p-5 transition-all duration-300 relative overflow-hidden',
        completed && 'opacity-60'
      )}
    >
      {/* Completion glow effect */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-emerald-500/3 rounded-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        {/* Completion toggle */}
        <button
          id={`complete-quest-${quest.id}`}
          onClick={handleComplete}
          disabled={completed || completing}
          className="mt-0.5 flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:cursor-default"
          aria-label={completed ? 'Quest completed' : 'Mark quest as complete'}
        >
          {completing ? (
            <span className="w-5 h-5 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin block" />
          ) : completed ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-text-muted hover:text-brand-blue transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className={cn(
              'font-semibold text-text-primary leading-snug',
              completed && 'line-through text-text-muted'
            )}>
              {quest.title}
            </h3>
            {/* XP Reward */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex-shrink-0">
              <Zap className="w-3 h-3 text-brand-blue" />
              <span className="text-brand-blue font-mono font-semibold text-xs">+{quest.xpReward}</span>
            </div>
          </div>

          <p className="text-text-secondary text-sm mb-3 leading-relaxed">{quest.description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty */}
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-lg', difficultyColor(quest.difficulty))}>
              {quest.difficulty}
            </span>
            {/* Status */}
            {completed ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20">
                <Trophy className="w-3 h-3" />
                Completed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
