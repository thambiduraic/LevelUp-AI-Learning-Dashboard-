'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Target, BookOpen, ExternalLink, Play, CheckCircle } from 'lucide-react';
import { cn, difficultyColor } from '@/lib/utils';
import type { Quest } from '@/types';

interface Resource {
  title: string;
  url: string;
}

interface QuestDetailModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
}

export function QuestDetailModal({ quest, isOpen, onClose, onStart, onComplete }: QuestDetailModalProps) {
  if (!quest) return null;

  const isInProgress = quest.status === 'IN_PROGRESS';
  const isCompleted = quest.status === 'COMPLETED';
  const resources = quest.resources as Resource[] | undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg z-[101] relative"
          >
            <div className="glass-card overflow-hidden shadow-2xl border-brand-blue/20 bg-surface-card">
              {/* Header Image/Pattern */}
              <div className="h-32 bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-6 left-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface-card border-2 border-brand-blue/30 flex items-center justify-center shadow-xl">
                    <Target className="w-8 h-8 text-brand-blue" />
                  </div>
                </div>
              </div>

              <div className="p-6 pt-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">{quest.title}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={cn('text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md', difficultyColor(quest.difficulty))}>
                        {quest.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        {quest.duration || 30} mins
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-blue font-bold">
                        <Zap className="w-3.5 h-3.5" />
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-text-secondary leading-relaxed mb-6">
                  {quest.description}
                </p>

                <div className="space-y-6">
                  {/* Instructions */}
                  {quest.instructions && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-purple" />
                        Instructions
                      </h4>
                      <p className="text-sm text-text-muted bg-surface-card/50 p-4 rounded-xl border border-surface-border leading-relaxed">
                        {quest.instructions}
                      </p>
                    </div>
                  )}

                  {/* Objective */}
                  {quest.objective && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        Learning Objective
                      </h4>
                      <p className="text-sm text-text-muted">
                        {quest.objective}
                      </p>
                    </div>
                  )}

                  {/* Resources */}
                  {resources && resources.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Play className="w-4 h-4 text-brand-blue" />
                        Learning Resources
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-surface-card hover:bg-brand-blue/5 border border-surface-border hover:border-brand-blue/30 transition-all group"
                          >
                            <span className="text-sm text-text-secondary group-hover:text-text-primary">{res.title}</span>
                            <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-brand-blue" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border border-surface-border text-sm font-bold text-text-secondary hover:bg-surface-card transition-colors"
                  >
                    Close
                  </button>
                  {isCompleted ? (
                    <div className="flex-[2] bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle className="w-5 h-5" />
                      Quest Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => isInProgress ? onComplete(quest.id) : onStart(quest.id)}
                      className={cn(
                        "flex-[2] px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg",
                        isInProgress
                          ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                          : "bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20"
                      )}
                    >
                      {isInProgress ? 'Complete Quest' : 'Start Learning'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
