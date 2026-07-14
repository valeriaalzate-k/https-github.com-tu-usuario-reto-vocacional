import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SCHOOL_NAME = "Colegio San Marcos";

const CODES = [
  "RV-2601", "RV-2602", "RV-2603", "RV-2604", "RV-2605", "RV-2606",
  "RV-2607", "RV-2608", "RV-2609", "RV-2610", "RV-2611", "RV-2612",
  "RV-2613", "RV-2614", "RV-2615", "RV-2616", "RV-2617", "RV-2618",
  "RV-2619", "RV-2620", "RV-2621", "RV-2622", "RV-2623", "RV-2624",
];

async function main() {
  await prisma.school.deleteMany();
  await prisma.school.create({ data: { name: SCHOOL_NAME } });

  for (const code of CODES) {
    await prisma.rosterCode.upsert({
      where: { code },
      update: {},
      create: { code },
    });
  }
  console.log(`Seed listo: ${SCHOOL_NAME}, ${CODES.length} códigos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
