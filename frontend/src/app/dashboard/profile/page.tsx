'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Star, Flame, Target, Zap, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/utils';
import type { User as UserType } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UserType>('/users/profile').then(setUser).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-48 rounded-2xl bg-surface-card" />
        <div className="h-64 rounded-2xl bg-surface-card" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Profile</h1>

      {/* Profile Card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{user?.name}</h2>
            <div className="flex items-center gap-1.5 text-text-muted mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-medium">
                <Star className="w-3 h-3" />
                Level {user?.level}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-medium">
                <Flame className="w-3 h-3" />
                {user?.streak} day streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total XP Earned', value: formatNumber(user?.totalXP || 0), icon: Zap, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
          { label: 'Current Level', value: user?.level || 1, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Learning Streak', value: `${user?.streak} days`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', icon: Calendar, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} className="glass-card p-5">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
            <div className="text-text-muted text-sm mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      {user && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-text-primary mb-4">Level Progress</h3>
          <div className="flex items-center justify-between text-sm text-text-muted mb-2">
            <span>Level {user.level}</span>
            <span className="font-mono">{formatNumber(user.xpProgress.current)} / {formatNumber(user.xpProgress.needed)} XP</span>
            <span>Level {user.xpProgress.nextLevel}</span>
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.round((user.xpProgress.current / user.xpProgress.needed) * 100))}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <p className="text-center text-xs text-text-muted mt-2">
            {user.xpProgress.needed - user.xpProgress.current} XP to level {user.xpProgress.nextLevel}
          </p>
        </div>
      )}
    </motion.div>
  );
}
