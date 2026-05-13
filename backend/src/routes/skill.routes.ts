import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { awardXP } from '../services/xp.service';
import { QuestStatus } from '@prisma/client';

const router = Router();
router.use(authMiddleware);

// GET /api/skills/:id - Get a specific skill with modules and lessons
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const skill = await prisma.skill.findFirst({
      where: { id, userId: req.userId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { id: 'asc' } // Or order if added
            }
          }
        }
      }
    });

    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skill details' });
  }
});

// POST /api/skills/seed - Seed initial skill tree with modules
router.post('/seed', async (req: AuthRequest, res: Response): Promise<void> => {
  const defaultSkills = [
    { 
      name: 'HTML & CSS', 
      category: 'FRONTEND' as const, 
      xpRequired: 0,
      modules: [
        { title: 'HTML Basics', order: 1, lessons: ['Intro to HTML', 'Tags & Elements', 'Forms & Inputs'] },
        { title: 'CSS Fundamentals', order: 2, lessons: ['Selectors', 'Box Model', 'Flexbox & Grid'] },
        { title: 'Responsive Design', order: 3, lessons: ['Media Queries', 'Mobile First', 'A11y'] }
      ]
    },
    { 
      name: 'JavaScript', 
      category: 'FRONTEND' as const, 
      xpRequired: 100,
      modules: [
        { title: 'JS Basics', order: 1, lessons: ['Variables & Types', 'Functions', 'Loops'] },
        { title: 'DOM Manipulation', order: 2, lessons: ['Selectors', 'Events', 'Attributes'] },
        { title: 'Async JS', order: 3, lessons: ['Promises', 'Fetch API', 'Async/Await'] }
      ]
    },
    { 
      name: 'React', 
      category: 'FRONTEND' as const, 
      xpRequired: 250,
      modules: [
        { title: 'React Fundamentals', order: 1, lessons: ['JSX', 'Components', 'Props'] },
        { title: 'Hooks', order: 2, lessons: ['useState', 'useEffect', 'useContext'] },
        { title: 'Advanced React', order: 3, lessons: ['Custom Hooks', 'Performance', 'Patterns'] }
      ]
    },
    { 
      name: 'Node.js', 
      category: 'BACKEND' as const, 
      xpRequired: 0,
      modules: [
        { title: 'Node Basics', order: 1, lessons: ['FS Module', 'Path Module', 'Events'] },
        { title: 'Express', order: 2, lessons: ['Routing', 'Middleware', 'Error Handling'] },
        { title: 'Auth', order: 3, lessons: ['JWT', 'Sessions', 'OAuth'] }
      ]
    },
    { 
      name: 'Python Basics', 
      category: 'AI_ML' as const, 
      xpRequired: 0,
      modules: [
        { title: 'Python Basics', order: 1, lessons: ['Syntax', 'Data Structures', 'Functions'] },
        { title: 'NumPy & Pandas', order: 2, lessons: ['Arrays', 'DataFrames', 'Manipulation'] },
        { title: 'Visualization', order: 3, lessons: ['Matplotlib', 'Seaborn'] }
      ]
    }
  ];

  try {
    const existingCount = await prisma.skill.count({ where: { userId: req.userId! } });
    
    if (existingCount > 0) {
      const skills = await prisma.skill.findMany({ 
        where: { userId: req.userId! }, 
        orderBy: { xpRequired: 'asc' },
        include: { modules: { include: { lessons: true } } }
      });
      res.json({ skills, seeded: false });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalXP: true } });
    const userXP = user?.totalXP || 0;

    for (const s of defaultSkills) {
      const skill = await prisma.skill.create({
        data: {
          name: s.name,
          category: s.category,
          unlocked: s.xpRequired <= userXP,
          xpRequired: s.xpRequired,
          userId: req.userId!,
          modules: {
            create: s.modules.map(m => ({
              title: m.title,
              order: m.order,
              lessons: {
                create: m.lessons.map(l => ({
                  title: l,
                  xpReward: 5
                }))
              }
            }))
          }
        }
      });
    }

    const skills = await prisma.skill.findMany({ 
      where: { userId: req.userId! }, 
      orderBy: { xpRequired: 'asc' },
      include: { modules: { include: { lessons: true } } }
    });
    res.json({ skills, seeded: true });
  } catch (err) {
    console.error('[POST /skills/seed]', err);
    res.status(500).json({ error: 'Failed to seed skills' });
  }
});

// PATCH /api/skills/lessons/:id/complete - Complete a lesson
router.patch('/lessons/:id/complete', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { module: { include: { skill: true } } }
    });

    if (!lesson || lesson.module.skill.userId !== req.userId) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (lesson.completed) {
      res.status(400).json({ error: 'Lesson already completed' });
      return;
    }

    const [updatedLesson, xpResult] = await Promise.all([
      prisma.lesson.update({
        where: { id },
        data: { completed: true }
      }),
      awardXP(req.userId!, lesson.xpReward, `Lesson: ${lesson.title}`)
    ]);

    // Check if module is now complete
    const allLessons = await prisma.lesson.findMany({ where: { moduleId: lesson.moduleId } });
    const allCompleted = allLessons.every(l => l.completed);

    if (allCompleted) {
      await prisma.module.update({
        where: { id: lesson.moduleId },
        data: { completed: true }
      });
      await awardXP(req.userId!, lesson.module.xpReward, `Module: ${lesson.module.title}`);
    }

    // Update skill progress
    const allSkillLessons = await prisma.lesson.findMany({
      where: { module: { skillId: lesson.module.skillId } }
    });
    const completedCount = allSkillLessons.filter(l => l.completed).length;
    const progress = Math.round((completedCount / allSkillLessons.length) * 100);

    await prisma.skill.update({
      where: { id: lesson.module.skillId },
      data: { 
        progress,
        lastActivity: new Date()
      }
    });

    res.json({ lesson: updatedLesson, xp: xpResult });
  } catch (err) {
    console.error('[PATCH /lessons/:id/complete]', err);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

export default router;
