import { prisma } from '../lib/prisma';

// XP required to reach each level (cumulative)
const LEVEL_XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 900,
  6: 1400,
  7: 2100,
  8: 3000,
  9: 4200,
  10: 5800,
};

/**
 * Calculate the level based on total XP using scalable formula.
 * After level 10, uses: 5800 + (level - 10) * 2000
 */
export const calculateLevel = (totalXP: number): number => {
  const thresholds = Object.entries(LEVEL_XP_THRESHOLDS)
    .map(([lvl, xp]) => ({ level: parseInt(lvl), xp }))
    .sort((a, b) => b.xp - a.xp); // descending

  for (const { level, xp } of thresholds) {
    if (totalXP >= xp) return level;
  }

  // Beyond level 10
  let level = 10;
  let required = 5800;
  while (totalXP >= required) {
    level++;
    required += 2000;
  }
  return level;
};

/**
 * Get XP needed for the next level from current total XP.
 */
export const getXPForNextLevel = (totalXP: number): { current: number; needed: number; nextLevel: number } => {
  const currentLevel = calculateLevel(totalXP);
  const nextLevel = currentLevel + 1;

  let needed: number;
  if (nextLevel <= 10) {
    needed = LEVEL_XP_THRESHOLDS[nextLevel];
  } else {
    needed = 5800 + (nextLevel - 10) * 2000;
  }

  const currentLevelXP = nextLevel - 1 <= 10 ? LEVEL_XP_THRESHOLDS[currentLevel] : 5800 + (currentLevel - 10) * 2000;
  const current = totalXP - currentLevelXP;
  const range = needed - currentLevelXP;

  return { current, needed: range, nextLevel };
};

/**
 * Award XP to a user, update their level, and record XP history.
 */
export const awardXP = async (
  userId: string,
  amount: number,
  source: string
): Promise<{ newTotalXP: number; newLevel: number; leveledUp: boolean }> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const oldLevel = user.level;
  const newTotalXP = user.totalXP + amount;
  const newLevel = calculateLevel(newTotalXP);

  await prisma.$transaction(async (tx) => {
    // 1. Update user XP and Level
    await tx.user.update({
      where: { id: userId },
      data: { totalXP: newTotalXP, level: newLevel },
    });

    // 2. Record XP History
    await tx.xPHistory.create({
      data: { userId, amount, source },
    });

    // 3. Auto-unlock skills based on new total XP and prerequisites
    const lockSkills = await tx.skill.findMany({
      where: {
        userId,
        unlocked: false,
        xpRequired: { lte: newTotalXP },
      },
      include: { prerequisite: true },
    });

    for (const skill of lockSkills) {
      // Unlock if no prereq OR prereq is complete
      if (!skill.prerequisiteId || (skill.prerequisite && skill.prerequisite.progress >= 100)) {
        await tx.skill.update({
          where: { id: skill.id },
          data: { unlocked: true },
        });
      }
    }
  });


  return {
    newTotalXP,
    newLevel,
    leveledUp: newLevel > oldLevel,
  };
};
