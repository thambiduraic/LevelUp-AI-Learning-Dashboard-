import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/analytics/overview - Summary stats
router.get('/overview', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [user, questStats, xpHistory] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.userId } }),
      prisma.quest.groupBy({
        by: ['completed'],
        where: { userId: req.userId },
        _count: true,
      }),
      prisma.xPHistory.findMany({
        where: { 
          userId: req.userId,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const completed = questStats.find((q) => q.completed)?._count || 0;
    const total = questStats.reduce((acc, q) => acc + q._count, 0);

    // Group XP by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const weeklyXP = last7Days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const xpForDay = xpHistory
        .filter((h) => h.createdAt >= day && h.createdAt < nextDay)
        .reduce((acc, h) => acc + h.amount, 0);
      return {
        date: day.toLocaleDateString('en-US', { weekday: 'short' }),
        xp: xpForDay,
      };
    });

    // Group XP by day for the last 30 days (for heatmap)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const activityHeatmap = last30Days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const xpForDay = xpHistory
        .filter((h) => h.createdAt >= day && h.createdAt < nextDay)
        .reduce((acc, h) => acc + h.amount, 0);
      return {
        date: day.toISOString(),
        xp: xpForDay,
        count: xpHistory.filter((h) => h.createdAt >= day && h.createdAt < nextDay).length,
      };
    });

    res.json({
      user,
      questCompletionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalQuestsCompleted: completed,
      totalQuests: total,
      weeklyXP,
      activityHeatmap,
      recentXPHistory: xpHistory.slice(0, 10),
    });
  } catch (err) {
    console.error('[GET /analytics/overview]', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/xp-history - Full XP history
router.get('/xp-history', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await prisma.xPHistory.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch XP history' });
  }
});

export default router;
