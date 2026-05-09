'use client';

import { Bell, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatNumber, xpProgressPercent } from '@/lib/utils';
import type { User } from '@/types';

import { useUser } from '@/contexts/UserContext';

export function Header() {
  const { user } = useUser();
  const xpPercent = user ? xpProgressPercent(user.xpProgress.current, user.xpProgress.needed) : 0;


  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-bg/80 backdrop-blur-md">
      {/* Left: Page Title placeholder (filled per-page via children if needed) */}
      <div className="flex-1" />

      {/* Right: Stats + Avatar */}
      <div className="flex items-center gap-3">
        {/* Streak Badge */}
        {user && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="stat-badge hidden sm:flex"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-mono font-semibold text-orange-400">{user.streak}</span>
            <span className="text-text-muted text-xs">streak</span>
          </motion.div>
        )}

        {/* Level + XP */}
        {user && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border border-surface-border bg-surface-card"
          >
            {/* Level Badge */}
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user.level}
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-xs text-text-muted">
                  <span className="font-mono font-semibold text-text-secondary">{formatNumber(user.xpProgress.current)}</span>
                  <span className="text-text-muted"> / {formatNumber(user.xpProgress.needed)} XP</span>
                </span>
                <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
              </div>
              {/* XP Progress Bar */}
              <div className="xp-bar w-28">
                <motion.div
                  className="xp-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative p-2.5 rounded-xl border border-surface-border bg-surface-card hover:border-brand-blue/30 transition-all duration-200 hover:bg-surface-hover"
        >
          <Bell className="w-4 h-4 text-text-secondary" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-blue" />
        </button>

        {/* Avatar */}
        {user && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-xl border-2 border-surface-border overflow-hidden cursor-pointer bg-gradient-brand flex items-center justify-center text-white font-bold text-sm hover:border-brand-blue/40 transition-all duration-200"
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase() || 'U'
            )}
          </motion.div>
        )}

        {/* Loading skeleton */}
        {!user && (
          <div className="flex items-center gap-3">
            <div className="w-24 h-8 rounded-xl bg-surface-card animate-pulse" />
            <div className="w-9 h-9 rounded-xl bg-surface-card animate-pulse" />
          </div>
        )}
      </div>
    </header>
  );
}
