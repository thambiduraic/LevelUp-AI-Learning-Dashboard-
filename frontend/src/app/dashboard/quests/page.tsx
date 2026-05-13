'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Filter, RefreshCw, Play } from 'lucide-react';
import { api } from '@/lib/api';
import { QuestCard } from '@/components/dashboard/QuestCard';
import { toast } from 'sonner';
import type { Quest, User } from '@/types';

import { QuestDetailModal } from '@/components/dashboard/QuestDetailModal';

type FilterType = 'ALL' | 'PENDING' | 'COMPLETED';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleStart = async (questId: string) => {
    try {
      const res = await api.patch<Quest>(`/quests/${questId}/start`);
      setQuests(prev => prev.map(q => q.id === questId ? res : q));
      if (selectedQuest?.id === questId) setSelectedQuest(res);
      toast.success('Quest Started!', {
        description: "Good luck with your learning!",
        icon: <Play className="w-4 h-4 text-brand-blue" />,
      });
    } catch (err) {
      toast.error('Failed to start quest');
    }
  };

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

      setQuests(prev => prev.map(q => q.id === questId ? res.quest : q));
      if (selectedQuest?.id === questId) setSelectedQuest(res.quest);
      
      const userData = await api.get<User>('/users/profile');
      setUser(userData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete quest');
    }
  };

  const handleDetails = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsModalOpen(true);
  };

  const filteredQuests = quests.filter((q) => {
    if (filter === 'PENDING') return q.status !== 'COMPLETED';
    if (filter === 'COMPLETED') return q.status === 'COMPLETED';
    return true;
  });

  const completedCount = quests.filter(q => q.status === 'COMPLETED').length;
  const totalXPAvailable = quests.filter(q => q.status !== 'COMPLETED').reduce((acc, q) => acc + q.xpReward, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto px-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            <Target className="w-8 h-8 text-brand-blue" />
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
          className="p-3 rounded-xl border border-surface-border bg-surface-card hover:border-brand-blue/30 transition-all shadow-sm hover:shadow-brand-blue/10"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* XP Summary Banner */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 flex items-center justify-between shadow-lg"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)', borderColor: 'rgba(59,130,246,0.2)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-blue" />
            </div>
            <div>
              <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Total Experience</p>
              <p className="text-2xl font-bold font-mono gradient-text">{user.totalXP.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Level</p>
              <p className="text-2xl font-bold font-mono text-brand-purple">{user.level}</p>
            </div>
            <div className="text-right">
              <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-bold font-mono text-orange-400">🔥 {user.streak}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-surface-card/50 rounded-2xl border border-surface-border w-fit">
        {(['ALL', 'PENDING', 'COMPLETED'] as FilterType[]).map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
              filter === f
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-card'
            }`}
          >
            {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-card animate-pulse" />
          ))}
        </div>
      ) : filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              onStart={handleStart}
              onComplete={handleComplete} 
              onDetails={handleDetails}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 bg-surface-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-surface-border">
            <Target className="w-8 h-8 text-text-muted opacity-30" />
          </div>
          <p className="text-text-muted font-medium">
            {filter === 'COMPLETED' ? 'No completed quests yet.' : 'All quests done for today! 🎉'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <QuestDetailModal
        quest={selectedQuest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={handleStart}
        onComplete={handleComplete}
      />

      {/* Completion celebration */}
      {completedCount === quests.length && quests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center border-emerald-500/30 bg-emerald-500/5 shadow-xl shadow-emerald-500/5"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="font-bold text-emerald-400 text-2xl mb-2">Daily Quests Cleared!</h3>
          <p className="text-text-secondary max-w-md mx-auto">
            You&apos;ve maximized your learning today. Check back tomorrow for a new set of challenges!
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="px-4 py-2 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-blue" />
              <span className="font-mono font-bold text-brand-blue">
                +{quests.reduce((acc, q) => acc + q.xpReward, 0)} XP Earned Today
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
