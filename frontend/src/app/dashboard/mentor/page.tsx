'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, RefreshCw, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { AIInsight } from '@/types';

export default function MentorPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<AIInsight[]>('/ai/insights')
      .then(setInsights).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const { feedback } = await api.post<{ feedback: string }>('/ai/mentor');
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        feedback,
        createdAt: new Date().toISOString(),
        userId: '',
      };
      setInsights((prev) => [newInsight, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate feedback. Check your OpenAI API key.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-purple" /> AI Mentor
        </h1>
        <p className="text-text-secondary mt-1">Get personalized learning feedback powered by AI</p>
      </div>

      {/* Generate Card */}
      <motion.div
        className="glass-card p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.06) 100%)', borderColor: 'rgba(139,92,246,0.2)' }}
      >
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none opacity-40" />
        <motion.div
          animate={{ rotate: generating ? 360 : 0 }}
          transition={{ repeat: generating ? Infinity : 0, duration: 2, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Your Personal AI Mentor</h2>
        <p className="text-text-secondary mb-6 text-sm leading-relaxed max-w-md mx-auto">
          Get AI-powered analysis of your learning progress, identify weak areas,
          and receive motivational tips tailored specifically to you.
        </p>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left">
            {error}
          </div>
        )}

        <button
          id="generate-ai-feedback"
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing your progress...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate AI Feedback
            </>
          )}
        </button>
      </motion.div>

      {/* Past Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" /> Past Insights
          </h2>
          {insights.length > 0 && (
            <span className="text-xs text-text-muted">{insights.length} feedback sessions</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-surface-card animate-pulse" />)}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-brand-purple" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">AI Mentor Feedback</p>
                        <p className="text-xs text-text-muted">{timeAgo(insight.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                      {insight.feedback}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-10 text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-text-muted opacity-30" />
                <p className="text-text-muted text-sm">No feedback generated yet.</p>
                <p className="text-text-muted text-xs mt-1">Click the button above to get your first AI insight!</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
