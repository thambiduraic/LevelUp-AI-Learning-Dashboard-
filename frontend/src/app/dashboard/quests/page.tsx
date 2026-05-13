'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Filter, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { QuestCard } from '@/components/dashboard/QuestCard';
import { toast } from 'sonner';
import type { Quest, User } from '@/types';

type FilterType = 'ALL' | 'PENDING' | 'COMPLETED';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [questData, userData] = await Promise.all([
        api.post<{ quests: Quest[] }>('/quests/seed', {}),
        api.get<User>('/users/profile'),
      ]);
      setQuests(questData.quests);
      setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleComplete = async (questId: string) => {
    try {
      const res = await api.patch<{ quest: Quest; xp: { newLevel: number; leveledUp: boolean; amount: number } }>(`/quests/${questId}/complete`);
      
      toast.success(`Quest Completed! +${res.xp.amount} XP`, {
        description: res.quest.title,
        icon: <Zap className="w-4 h-4 text-brand-blue" />,
      });

      if (res.xp.leveledUp) {
        toast('Level Up!', {
          description: `You've reached Level ${res.xp.newLevel}! 🎉`,
          duration: 5000,
          style: { background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', color: 'white', border: 'none' },
        });
      }

      const [questData, userData] = await Promise.all([
        api.get<Quest[]>('/quests'),
        api.get<User>('/users/profile'),
      ]);
      setQuests(questData);
      setUser(userData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete quest');
    }
  };

  const filteredQuests = quests.filter((q) => {
    if (filter === 'PENDING') return !q.completed;
    if (filter === 'COMPLETED') return q.completed;
    return true;
  });

  const completedCount = quests.filter(q => q.completed).length;
  const totalXPAvailable = quests.filter(q => !q.completed).reduce((acc, q) => acc + q.xpReward, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-blue" />
            Daily Quests
          </h1>
          <p className="text-text-secondary mt-1">
            {completedCount}/{quests.length} completed ·{' '}
            <span className="text-brand-blue font-mono font-semibold">{totalXPAvailable} XP</span> still available
          </p>
        </div>
        <button
          id="refresh-quests"
          onClick={fetchData}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:border-brand-blue/30 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      {/* XP Summary Banner */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)', borderColor: 'rgba(59,130,246,0.2)' }}
        >
          <div>
            <p className="text-text-muted text-sm">Your Total XP</p>
            <p className="text-2xl font-bold font-mono gradient-text">{user.totalXP.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-sm">Level</p>
            <p className="text-2xl font-bold font-mono text-brand-purple">{user.level}</p>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-sm">Streak</p>
            <p className="text-2xl font-bold font-mono text-orange-400">🔥 {user.streak}</p>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted" />
        {(['ALL', 'PENDING', 'COMPLETED'] as FilterType[]).map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-brand-blue/15 border border-brand-blue/30 text-brand-blue'
                : 'text-text-muted border border-transparent hover:text-text-secondary hover:border-surface-border'
            }`}
          >
            {f === 'ALL' ? `All (${quests.length})` : f === 'PENDING' ? `Pending (${quests.filter(q => !q.completed).length})` : `Done (${completedCount})`}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-card animate-pulse" />
          ))}
        </div>
      ) : filteredQuests.length > 0 ? (
        <div className="space-y-3">
          {filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-30" />
          <p className="text-text-muted">
            {filter === 'COMPLETED' ? 'No completed quests yet. Go complete some!' : 'All quests done for today! 🎉'}
          </p>
        </div>
      )}

      {/* Completion celebration */}
      {completedCount === quests.length && quests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 text-center"
          style={{ borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.05)' }}
        >
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="font-bold text-emerald-400 text-lg mb-1">All quests completed!</h3>
          <p className="text-text-secondary text-sm">
            Amazing work! You've finished all your daily quests.
            <br />Check back tomorrow for fresh challenges.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Zap className="w-4 h-4 text-brand-blue" />
            <span className="font-mono font-bold text-brand-blue">
              +{quests.reduce((acc, q) => acc + q.xpReward, 0)} XP earned today
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
