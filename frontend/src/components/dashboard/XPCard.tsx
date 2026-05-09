'use client';

import { motion } from 'framer-motion';
import { Zap, Star, TrendingUp } from 'lucide-react';
import { formatNumber, xpProgressPercent } from '@/lib/utils';
import type { User } from '@/types';

interface XPCardProps {
  user: User;
}

export function XPCard({ user }: XPCardProps) {
  const percent = xpProgressPercent(user.xpProgress.current, user.xpProgress.needed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl" />

      <div className="relative">
        {/* Level badge + header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-text-muted text-sm font-medium mb-1">Current Level</p>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-xl"
              >
                {user.level}
              </motion.div>
              <div>
                <div className="font-bold text-lg text-text-primary">Level {user.level}</div>
                <div className="text-xs text-text-muted">→ Level {user.xpProgress.nextLevel}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-400 font-mono font-semibold text-sm">{formatNumber(user.totalXP)}</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-muted">XP Progress</span>
            <span className="text-sm font-mono font-medium text-text-secondary">{percent}%</span>
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-text-muted font-mono">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-brand-blue" />
            {formatNumber(user.xpProgress.current)} XP earned
          </span>
          <span>{formatNumber(user.xpProgress.needed)} XP to next level</span>
        </div>

        {/* Milestone indicator */}
        {percent >= 80 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            So close! {100 - percent}% more to level up!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
