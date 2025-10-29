import { PrismaClient } from '@prisma/client';
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

  // Each question will have options (array of 4)
  const questions = [

    {
      question: 'Which activity best reflects an enterprising personality?',
      options: [
        'Creating business plans and leading a team',
        'Conducting scientific experiments',
        'Designing artwork or creative projects',
        'Working independently on data analysis'
      ],
      answerKey: 'Creating business plans and leading a team',
      categoryId: personalityCategory.id,
      streamId: personalityStream.id,
      personalityType: personalityTypes[4], // Enterprising
    },
  ];

  console.log('📝 Inserting questions...');

  for (const q of questions) {
    try {
      await prisma.question.create({ data: q });
      console.log(`✅ Created question: ${q.question.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Failed to create question: ${q.question.substring(0, 50)}...`, error);
    }
  }

  console.log(`\n✅ Successfully inserted ${questions.length} questions!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

