import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userA = await prisma.user.upsert({
    where: { name: "A" },
    update: {},
    create: {
      name: "A",
      role: "Sender",
    },
  });
  const userB = await prisma.user.upsert({
    where: { name: "B" },
    update: {},
    create: {
      name: "B",
      role: "Receiver",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
