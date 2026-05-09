'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import { api } from '@/lib/api';
import { SkillNode } from '@/components/dashboard/SkillNode';
import { categoryLabel } from '@/lib/utils';
import type { Skill, Category } from '@/types';

const CATEGORIES: Category[] = ['FRONTEND', 'BACKEND', 'AI_ML', 'SYSTEM_DESIGN', 'PROBLEM_SOLVING'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.post<{ skills: Skill[] }>('/skills/seed', {});
        setSkills(data.skills);
      } catch {
        try {
          const data = await api.get<Skill[]>('/skills');
          setSkills(data);
        } catch (err) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = activeCategory === 'ALL'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const unlockedCount = skills.filter(s => s.unlocked).length;
  const avgProgress = skills.length > 0
    ? Math.round(skills.filter(s => s.unlocked).reduce((acc, s) => acc + s.progress, 0) / (unlockedCount || 1))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-brand-purple" />
          Skill Trees
        </h1>
        <p className="text-text-secondary mt-1">
          {unlockedCount}/{skills.length} skills unlocked · Average progress {avgProgress}%
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          id="filter-all-skills"
          onClick={() => setActiveCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'ALL'
              ? 'bg-brand-purple/15 border border-brand-purple/30 text-brand-purple'
              : 'text-text-muted border border-transparent hover:text-text-secondary hover:border-surface-border'
          }`}
        >
          All ({skills.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = skills.filter(s => s.category === cat).length;
          return (
            <button
              key={cat}
              id={`filter-skill-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-brand-purple/15 border border-brand-purple/30 text-brand-purple'
                  : 'text-text-muted border border-transparent hover:text-text-secondary hover:border-surface-border'
              }`}
            >
              {categoryLabel(cat)} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-surface-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {(activeCategory === 'ALL' ? CATEGORIES : [activeCategory]).map((cat) => {
            const catSkills = filtered.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="text-xl">{['⚡', '🔧', '🤖', '🏗️', '🧩'][CATEGORIES.indexOf(cat)]}</span>
                  {categoryLabel(cat).split(' ').slice(1).join(' ')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catSkills.map((skill, i) => (
                    <SkillNode key={skill.id} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
