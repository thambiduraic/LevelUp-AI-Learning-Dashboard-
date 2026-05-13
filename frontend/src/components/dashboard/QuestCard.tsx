'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Zap, Clock, Trophy, RefreshCw } from 'lucide-react';
import { cn, difficultyColor } from '@/lib/utils';
import type { Quest } from '@/types';

interface QuestCardProps {
  quest: Quest;
  onStart: (questId: string) => Promise<void>;
  onComplete: (questId: string) => Promise<void>;
  onDetails: (quest: Quest) => void;
}

export function QuestCard({ quest, onStart, onComplete, onDetails }: QuestCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    
    setLoading(true);
    try {
      if (quest.status === 'AVAILABLE') {
        await onStart(quest.id);
      } else if (quest.status === 'IN_PROGRESS') {
        await onComplete(quest.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = quest.status === 'COMPLETED';
  const isInProgress = quest.status === 'IN_PROGRESS';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onDetails(quest)}
      className={cn(
        'glass-card p-5 transition-all duration-300 relative overflow-hidden cursor-pointer group',
        isCompleted && 'opacity-60 grayscale-[0.5]',
        isInProgress && 'border-brand-blue/30 bg-brand-blue/5'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className={cn(
              'font-semibold text-text-primary leading-snug group-hover:text-brand-blue transition-colors',
              isCompleted && 'line-through text-text-muted'
            )}>
              {quest.title}
            </h3>
            {/* XP Reward */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex-shrink-0">
              <Zap className="w-3 h-3 text-brand-blue" />
              <span className="text-brand-blue font-mono font-semibold text-xs">+{quest.xpReward} XP</span>
            </div>
          </div>

          <p className="text-text-secondary text-sm mb-4 line-clamp-2">{quest.description}</p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md', difficultyColor(quest.difficulty))}>
                {quest.difficulty}
              </span>
              {quest.duration && (
                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Clock className="w-3 h-3" />
                  {quest.duration}m
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCompleted ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Done
                </span>
              ) : (
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                    isInProgress 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" 
                      : "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : isInProgress ? (
                    <>Complete <Trophy className="w-3 h-3" /></>
                  ) : (
                    <>Start Quest <Zap className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Indicator */}
      {isInProgress && (
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}
