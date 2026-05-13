'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, GitBranch, Zap, CheckCircle, Circle, Play, BookOpen, Clock, Trophy } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn, categoryLabel } from '@/lib/utils';
import type { Skill, Module, Lesson } from '@/types';

export default function SkillDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSkill = useCallback(async () => {
    try {
      const data = await api.get<Skill>(`/skills/${id}`);
      setSkill(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load skill details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSkill();
  }, [id, fetchSkill]);

  const handleCompleteLesson = async (lessonId: string) => {
    try {
      const res = await api.patch<{ lesson: Lesson; xp: { amount: number } }>(`/skills/lessons/${lessonId}/complete`);
      toast.success(`Lesson Complete! +${res.xp.amount} XP`);
      fetchSkill(); // Refresh to update progress
    } catch (err) {
      toast.error('Failed to complete lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin" />
        <p className="text-text-muted animate-pulse">Loading roadmap...</p>
      </div>
    );
  }

  if (!skill) return <div className="text-center p-20 text-text-muted">Skill not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Skills
      </button>

      {/* Header Card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <GitBranch className="w-40 h-40 text-brand-purple" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
                {categoryLabel(skill.category)}
              </span>
              {skill.progress >= 100 && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                  <Trophy className="w-3 h-3" />
                  Mastered
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-text-primary">{skill.name}</h1>
            <p className="text-text-secondary max-w-xl">
              Master {skill.name} by completing the modules and lessons below. Each lesson earned awards XP and unlocks new challenges.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mb-2 mx-auto">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle
                    cx="18" cy="18" r="16" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - skill.progress / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-text-primary">{skill.progress}%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-text-muted uppercase">Overall Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-blue" />
            Learning Modules
          </h2>

          <div className="space-y-4">
            {skill.modules?.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "glass-card overflow-hidden border-l-4 transition-all duration-300",
                  module.completed ? "border-l-emerald-500" : "border-l-brand-blue"
                )}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-sm font-mono">
                          {idx + 1}
                        </span>
                        {module.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1">
                        {module.lessons.filter(l => l.completed).length} / {module.lessons.length} lessons completed
                      </p>
                    </div>
                    {module.completed && (
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20 text-xs font-bold">
                        <CheckCircle className="w-4 h-4" />
                        Module Complete
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl transition-all",
                          lesson.completed 
                            ? "bg-emerald-500/5 border border-emerald-500/20" 
                            : "bg-surface-card border border-surface-border hover:border-brand-blue/30 group"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            lesson.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-black/20 text-text-muted group-hover:text-brand-blue"
                          )}>
                            {lesson.completed ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className={cn("font-bold text-sm", lesson.completed ? "text-emerald-400" : "text-text-primary")}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {lesson.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>

                        {!lesson.completed && (
                          <button
                            onClick={() => handleCompleteLesson(lesson.id)}
                            className="px-4 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue/90 transition-all opacity-0 group-hover:opacity-100"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-bold text-text-primary">Skill Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Total Lessons</span>
                <span className="text-sm font-bold text-text-primary">
                  {skill.modules?.reduce((acc, m) => acc + m.lessons.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Lessons Completed</span>
                <span className="text-sm font-bold text-emerald-400">
                  {skill.modules?.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Estimated Time</span>
                <span className="text-sm font-bold text-text-primary">
                  ~{skill.modules?.reduce((acc, m) => acc + m.lessons.length, 0)! * 15} mins
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-border">
              <div className="p-4 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-brand-purple" />
                  <span className="font-bold text-sm text-brand-purple">XP Reward Bonus</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Complete an entire module to earn a <span className="font-bold text-brand-purple">+10 XP</span> completion bonus!
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-text-primary mb-4">Last Activity</h3>
            {skill.lastActivity ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                  <Clock className="w-5 h-5 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {new Date(skill.lastActivity).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-text-muted">Roadmap progress updated</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">No activity yet. Start your journey today!</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
