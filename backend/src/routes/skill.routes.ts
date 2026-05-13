import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/skills - Get all skills for user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalXP: true } });
    
    if (user) {
      // Catch-up: Unlock any skills the user qualifies for but aren't unlocked yet
      await prisma.skill.updateMany({
        where: {
          userId: req.userId,
          unlocked: false,
          xpRequired: { lte: user.totalXP },
        },
        data: { unlocked: true },
      });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: req.userId },
      orderBy: { xpRequired: 'asc' },
    });

    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/skills/seed - Seed initial skill tree
router.post('/seed', async (req: AuthRequest, res: Response): Promise<void> => {
  const defaultSkills = [
    // Frontend
    { name: 'HTML & CSS', category: 'FRONTEND' as const, progress: 0, unlocked: true, xpRequired: 0 },
    { name: 'JavaScript', category: 'FRONTEND' as const, progress: 0, unlocked: false, xpRequired: 100, prerequisiteId: 'html-css' },
    { name: 'React', category: 'FRONTEND' as const, progress: 0, unlocked: false, xpRequired: 250, prerequisiteId: 'javascript' },
    { name: 'Next.js', category: 'FRONTEND' as const, progress: 0, unlocked: false, xpRequired: 500, prerequisiteId: 'react' },
    // Backend
    { name: 'Node.js', category: 'BACKEND' as const, progress: 0, unlocked: true, xpRequired: 0 },
    { name: 'Express.js', category: 'BACKEND' as const, progress: 0, unlocked: false, xpRequired: 100, prerequisiteId: 'node-js' },
    { name: 'Databases', category: 'BACKEND' as const, progress: 0, unlocked: false, xpRequired: 250, prerequisiteId: 'express-js' },
    { name: 'REST APIs', category: 'BACKEND' as const, progress: 0, unlocked: false, xpRequired: 400, prerequisiteId: 'express-js' },
    // AI/ML
    { name: 'Python Basics', category: 'AI_ML' as const, progress: 0, unlocked: true, xpRequired: 0 },
    { name: 'ML Fundamentals', category: 'AI_ML' as const, progress: 0, unlocked: false, xpRequired: 200, prerequisiteId: 'python-basics' },
    { name: 'Deep Learning', category: 'AI_ML' as const, progress: 0, unlocked: false, xpRequired: 600, prerequisiteId: 'ml-fundamentals' },
    // System Design
    { name: 'Architecture Basics', category: 'SYSTEM_DESIGN' as const, progress: 0, unlocked: false, xpRequired: 300 },
    { name: 'Scalability', category: 'SYSTEM_DESIGN' as const, progress: 0, unlocked: false, xpRequired: 700, prerequisiteId: 'architecture-basics' },
    // Problem Solving
    { name: 'Data Structures', category: 'PROBLEM_SOLVING' as const, progress: 0, unlocked: true, xpRequired: 0 },
    { name: 'Algorithms', category: 'PROBLEM_SOLVING' as const, progress: 0, unlocked: false, xpRequired: 150, prerequisiteId: 'data-structures' },
  ];

  try {
    const existingCount = await prisma.skill.count({ where: { userId: req.userId! } });
    
    if (existingCount > 0) {
      const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalXP: true } });
      if (user) {
        await prisma.skill.updateMany({
          where: {
            userId: req.userId,
            unlocked: false,
            xpRequired: { lte: user.totalXP },
          },
          data: { unlocked: true },
        });
      }
      
      const skills = await prisma.skill.findMany({ where: { userId: req.userId! }, orderBy: { xpRequired: 'asc' } });
      res.json({ skills, seeded: false });
      return;
    }


    const userForSeed = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalXP: true } });
    const userXP = userForSeed?.totalXP || 0;

    // 1. Create all skills first
    const createdSkills = [];
    for (const s of defaultSkills) {
      const skill = await prisma.skill.create({
        data: {
          name: s.name,
          category: s.category,
          progress: s.progress,
          unlocked: s.unlocked || s.xpRequired <= userXP,
          xpRequired: s.xpRequired,
          userId: req.userId!,
        },
      });
      createdSkills.push(skill);
    }

    // 2. Link prerequisites
    for (const s of defaultSkills) {
      if (s.prerequisiteId) {
        const skill = createdSkills.find((cs) => cs.name === s.name);
        const prereq = createdSkills.find((cs) => {
           // Mapping name back to common slug/id
           const slug = cs.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/\.js/g, '-js').replace(/\//g, '-');
           return slug === s.prerequisiteId;
        });

        if (skill && prereq) {
          await prisma.skill.update({
            where: { id: skill.id },
            data: { prerequisiteId: prereq.id },
          });
        }
      }
    }


    const skills = await prisma.skill.findMany({ where: { userId: req.userId! }, orderBy: { xpRequired: 'asc' } });
    res.json({ skills, seeded: true });
  } catch (err) {
    console.error('[POST /skills/seed]', err);
    res.status(500).json({ error: 'Failed to seed skills' });
  }
});

// PATCH /api/skills/:id - Update skill progress
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { progress, unlocked } = req.body;

  try {
    const skill = await prisma.skill.findFirst({ where: { id, userId: req.userId } });
    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...(progress !== undefined && { progress: Math.min(100, Math.max(0, progress)) }),
        ...(unlocked !== undefined && { unlocked }),
      },
    });

    // If skill was just completed, check if we can unlock its dependents
    if (progress !== undefined && progress >= 100) {
      const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalXP: true } });
      const userXP = user?.totalXP || 0;

      const dependents = await prisma.skill.findMany({
        where: {
          userId: req.userId,
          prerequisiteId: updated.id,
          unlocked: false,
          xpRequired: { lte: userXP }
        }
      });

      if (dependents.length > 0) {
        await prisma.skill.updateMany({
          where: { id: { in: dependents.map(d => d.id) } },
          data: { unlocked: true }
        });
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

export default router;
