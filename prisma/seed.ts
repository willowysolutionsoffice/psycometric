import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Map RIASEC personality types to distribute among questions
  const personalityTypes = [
    'Realistic',
    'Investigative',
    'Artistic',
    'Social',
    'Enterprising',
    'Conventional'
  ];

  // Find or create categories by name
  const healthcareCategory = await prisma.category.upsert({
    where: { name: 'Healthcare' },
    update: {},
    create: { name: 'Healthcare' },
  });

  const reasoningCategory = await prisma.category.upsert({
    where: { name: 'Reasoning' },
    update: {},
    create: { name: 'Reasoning' },
  });

  const scienceCategory = await prisma.category.upsert({
    where: { name: 'Science' },
    update: {},
    create: { name: 'Science' },
  });

  const personalityCategory = await prisma.category.upsert({
    where: { name: 'Personality' },
    update: {},
    create: { name: 'Personality' },
  });

  // Find or create streams by name
  const commerceStream = await prisma.stream.upsert({
    where: { name: 'Commerce' },
    update: {},
    create: { name: 'Commerce' },
  });

  const scienceStream = await prisma.stream.upsert({
    where: { name: 'Science' },
    update: {},
    create: { name: 'Science' },
  });

  const personalityStream = await prisma.stream.upsert({
    where: { name: 'Personality' },
    update: {},
    create: { name: 'Personality' },
  });


  // Create an admin user (idempotent upsert by email)
  const adminEmail = 'admin@gmail.com';
  const adminPasswordPlain = 'admin123';
  const adminHashed = await bcrypt.hash(adminPasswordPlain, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
      password: adminHashed,
      name: 'Administrator',
    },
    create: {
      name: 'Administrator',
      email: adminEmail,
      password: adminHashed,
      role: 'admin',
      emailVerified: true,
    },
  });

  // Questions are seeded elsewhere; only ensuring admin user exists here.
  console.log('✅ Ensured admin user exists');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

