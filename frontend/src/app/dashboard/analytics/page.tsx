'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Zap, Activity } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { api } from '@/lib/api';
import { formatNumber, timeAgo } from '@/lib/utils';
import type { AnalyticsOverview } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AnalyticsOverview>('/analytics/overview')
      .then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-surface-card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-surface-card" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-cyan" /> Analytics
        </h1>
        <p className="text-text-secondary mt-1">Your learning performance at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: formatNumber(data?.user?.totalXP || 0), icon: Zap, color: 'text-brand-blue' },
          { label: 'Current Level', value: `Lv. ${data?.user?.level || 1}`, icon: TrendingUp, color: 'text-brand-purple' },
          { label: 'Quests Done', value: data?.totalQuestsCompleted || 0, icon: Target, color: 'text-emerald-400' },
          { label: 'Completion Rate', value: `${data?.questCompletionRate || 0}%`, icon: Activity, color: 'text-brand-cyan' },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-text-muted text-sm">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-bold text-text-primary mb-1">Weekly XP Earned</h2>
          <p className="text-text-muted text-sm mb-5">Last 7 days of XP activity</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data?.weeklyXP || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }} />
              <Area type="monotone" dataKey="xp" stroke="#3B82F6" strokeWidth={2.5} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-bold text-text-primary mb-1">Daily Learning Activity</h2>
          <p className="text-text-muted text-sm mb-5">XP gained per day</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.weeklyXP || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }} />
              <Bar dataKey="xp" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quest Stats */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-text-primary mb-4">Quest Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-surface-card/50">
              <span className="text-text-secondary">Completed</span>
              <span className="font-mono font-bold text-emerald-400 text-xl">{data?.totalQuestsCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-surface-card/50">
              <span className="text-text-secondary">Total Quests</span>
              <span className="font-mono font-bold text-text-primary text-xl">{data?.totalQuests || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-surface-card/50">
              <span className="text-text-secondary">Completion Rate</span>
              <span className="font-mono font-bold text-brand-blue text-xl">{data?.questCompletionRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Recent XP History */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-text-primary mb-4">Recent XP Gains</h2>
          {data?.recentXPHistory && data.recentXPHistory.length > 0 ? (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {data.recentXPHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary font-medium leading-tight">{item.source}</p>
                      <p className="text-xs text-text-muted">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-brand-blue text-sm">+{item.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-text-muted text-sm">Complete quests to see XP history</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
