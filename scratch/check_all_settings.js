const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const settings = await prisma.siteSettings.findMany();
  console.log('All Site Settings:', JSON.stringify(settings, null, 2));
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
