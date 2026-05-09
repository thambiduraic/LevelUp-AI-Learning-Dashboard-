'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Flame, GitBranch, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { api } from '@/lib/api';
import { XPCard } from '@/components/dashboard/XPCard';
import { QuestCard } from '@/components/dashboard/QuestCard';
import { formatNumber } from '@/lib/utils';
import type { User, Quest, AnalyticsOverview } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

import { useUser } from '@/contexts/UserContext';

export default function DashboardPage() {
  const { user, refreshUser } = useUser();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questData, analyticsData] = await Promise.all([
          api.post<{ quests: Quest[] }>('/quests/seed', {}),
          api.get<AnalyticsOverview>('/analytics/overview'),
        ]);
        setQuests(questData.quests.slice(0, 3)); // Show top 3 on home
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompleteQuest = async (questId: string) => {
    try {
      await api.patch(`/quests/${questId}/complete`);
      // Global refresh
      await refreshUser();
      // Local refresh for quests (optional, could just refetch quests)
      const questData = await api.post<{ quests: Quest[] }>('/quests/seed', {});
      setQuests(questData.quests.slice(0, 3));
    } catch (err) {
      console.error('Failed to complete quest:', err);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-surface-card" />
          <div className="h-64 rounded-2xl bg-surface-card lg:col-span-2" />
        </div>
      </div>
    );
  }

  const completedToday = quests.filter(q => q.completed).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋
        </h1>
        <p className="text-text-secondary mt-1">
          {completedToday > 0
            ? `You've completed ${completedToday} quest${completedToday > 1 ? 's' : ''} today. Keep it up!`
            : "You have quests waiting. Start your day strong!"}
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total XP',
            value: formatNumber(user?.totalXP || 0),
            icon: Zap,
            color: 'text-brand-blue',
            bg: 'bg-brand-blue/10',
            border: 'border-brand-blue/20',
          },
          {
            label: 'Current Streak',
            value: `${user?.streak || 0} days`,
            icon: Flame,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/20',
          },
          {
            label: 'Quests Done',
            value: `${analytics?.totalQuestsCompleted || 0}`,
            icon: Target,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20',
          },
          {
            label: 'Completion Rate',
            value: `${analytics?.questCompletionRate || 0}%`,
            icon: TrendingUp,
            color: 'text-brand-purple',
            bg: 'bg-brand-purple/10',
            border: 'border-brand-purple/20',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className={`glass-card p-5 border ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted text-sm">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP Card */}
        <motion.div variants={itemVariants}>
          {user && <XPCard user={user} />}
        </motion.div>

        {/* Weekly XP Chart */}
        <motion.div variants={itemVariants} className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-text-primary">Weekly XP Progress</h2>
              <p className="text-text-muted text-sm mt-0.5">Your learning activity this week</p>
            </div>
            <Link href="/dashboard/analytics" className="text-brand-blue hover:text-blue-400 text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.weeklyXP && analytics.weeklyXP.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={analytics.weeklyXP} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
                <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }}
                  cursor={{ stroke: 'rgba(59,130,246,0.2)' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#3B82F6" strokeWidth={2} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-text-muted text-sm">
              Complete quests to see your XP progress here
            </div>
          )}
        </motion.div>
      </div>

      {/* Today's Quests */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-text-primary flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-blue" />
              Today's Quests
            </h2>
            <p className="text-text-muted text-sm mt-0.5">{completedToday} of {quests.length} completed</p>
          </div>
          <Link href="/dashboard/quests" className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {quests.length > 0 ? (
          <div className="space-y-3">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted">
            <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No quests yet. They'll appear once your account is set up.</p>
          </div>
        )}
      </motion.div>

      {/* Skill Overview */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-text-primary flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-brand-purple" />
            Skill Progress
          </h2>
          <Link href="/dashboard/skills" className="text-brand-blue hover:text-blue-400 text-sm flex items-center gap-1 transition-colors">
            Full Skill Tree <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['FRONTEND', 'BACKEND', 'AI_ML', 'SYSTEM_DESIGN', 'PROBLEM_SOLVING'].map((cat, i) => (
            <motion.div
              key={cat}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl border border-surface-border bg-surface-card/50 text-center cursor-pointer hover:border-brand-blue/30 transition-all"
            >
              <div className="text-2xl mb-2">
                {['⚡', '🔧', '🤖', '🏗️', '🧩'][i]}
              </div>
              <div className="text-xs font-medium text-text-secondary leading-snug">
                {['Frontend', 'Backend', 'AI/ML', 'System Design', 'Prob. Solving'][i]}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
