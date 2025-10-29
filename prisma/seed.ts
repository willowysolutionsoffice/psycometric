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

  // Each question will have options (array of 4)
  const questions = [
    {
      question: 'Which method is most effective for reducing patient anxiety before a medical procedure?',
      options: [
        'Using technical jargon',
        'Offering clear explanations and reassurance',
        'Avoiding communication',
        'Rushing through instructions'
      ],
      answerKey: 'Offering clear explanations and reassurance',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[3],
    },
    {
      question: 'Which of the following is an example of good hand hygiene practice?',
      options: [
        'Washing hands only after meals',
        'Using gloves instead of washing hands',
        'Washing hands before and after patient contact',
        'Avoiding soap to protect skin'
      ],
      answerKey: 'Washing hands before and after patient contact',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[0],
    },
    {
      question: 'Which organ is primarily responsible for pumping blood throughout the body?',
      options: ['Lungs', 'Heart', 'Brain', 'Liver'],
      answerKey: 'Heart',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'A patient reports dizziness and fatigue. What is the most appropriate first step?',
      options: [
        'Ignore the symptoms',
        'Document and report immediately',
        'Advise the patient to sleep',
        'Ask the patient to walk quickly'
      ],
      answerKey: 'Document and report immediately',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[3],
    },
    {
      question: 'What is the primary function of red blood cells?',
      options: [
        'Fighting infections',
        'Carrying oxygen',
        'Producing hormones',
        'Digesting food'
      ],
      answerKey: 'Carrying oxygen',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'What should a healthcare worker do when a patient expresses fear?',
      options: [
        'Dismiss their feelings',
        'Encourage them to stay quiet',
        'Listen calmly and provide reassurance',
        'Change the topic'
      ],
      answerKey: 'Listen calmly and provide reassurance',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[3],
    },
    {
      question: 'If a number is increased from 50 to 75, what is the percentage increase?',
      options: ['25%', '50%', '75%', '100%'],
      answerKey: '50%',
      categoryId: reasoningCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'What is the next number in the series: 3, 6, 12, 24, ?',
      options: ['36', '48', '50', '60'],
      answerKey: '48',
      categoryId: reasoningCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'A shopkeeper gives a 20% discount on a ₹500 item. What is the selling price?',
      options: ['₹300', '₹400', '₹450', '₹350'],
      answerKey: '₹400',
      categoryId: reasoningCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'Which figure comes next in a sequence of increasing squares?',
      options: ['Triangle', 'Circle', 'Bigger square', 'Pentagon'],
      answerKey: 'Bigger square',
      categoryId: reasoningCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[4],
    },
    {
      question: 'If 15 workers complete a job in 10 days, how long will 30 workers take?',
      options: ['2 days', '3 days', '4 days', '5 days'],
      answerKey: '5 days',
      categoryId: reasoningCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'What part of a plant conducts photosynthesis?',
      options: ['Roots', 'Stem', 'Leaves', 'Flowers'],
      answerKey: 'Leaves',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which gas is essential for human respiration?',
      options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
      answerKey: 'Oxygen',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which vitamin is known as the "sunshine vitamin"?',
      options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
      answerKey: 'Vitamin D',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'What is the boiling point of water at sea level?',
      options: ['50°C', '100°C', '150°C', '200°C'],
      answerKey: '100°C',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which organ controls thoughts and memory?',
      options: ['Heart', 'Kidney', 'Brain', 'Lung'],
      answerKey: 'Brain',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'The chemical formula for water is:',
      options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
      answerKey: 'H₂O',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
      answerKey: 'Mars',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Sound travels fastest through:',
      options: ['Gas', 'Liquid', 'Solid', 'Vacuum'],
      answerKey: 'Solid',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which metal is used to make electrical wires?',
      options: ['Copper', 'Gold', 'Lead', 'Iron'],
      answerKey: 'Copper',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which of these is a renewable source of energy?',
      options: ['Coal', 'Oil', 'Wind', 'Natural gas'],
      answerKey: 'Wind',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[0],
    },
    {
      question: 'Which blood group is known as the universal donor?',
      options: ['A', 'B', 'AB', 'O negative'],
      answerKey: 'O negative',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which action shows respect for patient privacy?',
      options: [
        'Discussing case details in public',
        'Sharing patient photos',
        'Maintaining confidentiality',
        'Posting medical records online'
      ],
      answerKey: 'Maintaining confidentiality',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[3],
    },
    {
      question: 'What should a nurse do before administering medication?',
      options: [
        'Skip verification steps',
        'Check the patient\'s identity',
        'Confirm with another patient',
        'Give medication quickly'
      ],
      answerKey: 'Check the patient\'s identity',
      categoryId: healthcareCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'A triangle with all equal sides is called:',
      options: ['Scalene', 'Isosceles', 'Equilateral', 'Right triangle'],
      answerKey: 'Equilateral',
      categoryId: reasoningCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[4],
    },
    {
      question: 'What is 25% of 200?',
      options: ['25', '50', '75', '100'],
      answerKey: '50',
      categoryId: reasoningCategory.id,
      streamId: commerceStream.id,
      personalityType: personalityTypes[5],
    },
    {
      question: 'Which of the following is NOT a simple machine?',
      options: ['Lever', 'Pulley', 'Inclined plane', 'Battery'],
      answerKey: 'Battery',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'Which gas is used by plants during photosynthesis?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'],
      answerKey: 'Carbon dioxide',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
    },
    {
      question: 'An animal that eats only plants is called:',
      options: ['Carnivore', 'Herbivore', 'Omnivore', 'Decomposer'],
      answerKey: 'Herbivore',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[0],
    },
    {
      question: 'Which part of the cell contains genetic material?',
      options: ['Nucleus', 'Cytoplasm', 'Cell wall', 'Mitochondria'],
      answerKey: 'Nucleus',
      categoryId: scienceCategory.id,
      streamId: scienceStream.id,
      personalityType: personalityTypes[1],
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

