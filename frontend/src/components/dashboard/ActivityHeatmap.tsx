'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityHeatmapProps {
  data: Array<{ date: string; xp: number; count: number }>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Determine color based on XP amount
  const getLevel = (xp: number) => {
    if (xp === 0) return 0;
    if (xp < 50) return 1;
    if (xp < 150) return 2;
    if (xp < 300) return 3;
    return 4;
  };

  const colors = [
    'bg-surface-border',
    'bg-brand-blue/20',
    'bg-brand-blue/40',
    'bg-brand-blue/70',
    'bg-brand-blue',
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">Activity Heatmap (Last 30 Days)</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <span>Less</span>
          <div className="flex gap-1">
            {colors.map((c, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-[1px]', c)} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1.5 h-28">
        {data.map((day, i) => {
          const level = getLevel(day.xp);
          const date = new Date(day.date);
          const label = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${day.xp} XP (${day.count} activities)`;

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              className={cn(
                'w-full h-full rounded-[2px] transition-colors cursor-help relative group',
                colors[level]
              )}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-card border border-surface-border rounded text-[10px] text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-text-muted mt-1 px-1">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
