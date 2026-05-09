import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('Starting skill cleanup...');

  // Find all user IDs
  const users = await prisma.user.findMany({ select: { id: true } });

  for (const user of users) {
    const skills = await prisma.skill.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    const seen = new Set();
    const toDelete = [];

    for (const skill of skills) {
      if (seen.has(skill.name)) {
        toDelete.push(skill.id);
      } else {
        seen.add(skill.name);
      }
    }

    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate skills for user ${user.id}...`);
      await prisma.skill.deleteMany({
        where: { id: { in: toDelete } },
      });
    }
  }

  console.log('Cleanup complete!');
}

cleanupDuplicates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
