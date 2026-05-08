const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' }
  });
  console.log('Site Settings:', JSON.stringify(settings, null, 2));
  
  const projectsCount = await prisma.project.count();
  console.log('Projects count:', projectsCount);
  
  const skillsCount = await prisma.skill.count();
  console.log('Skills count:', skillsCount);
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
