import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "./seed-database";

async function main() {
  const client = new PrismaClient();
  const slateId = await seedDatabase(client);
  console.log(`Seeded slate ${slateId}`);
  await client.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
