import { prisma } from "./lib/prisma";

async function main() {
  const patient = await prisma.patient.create({
    data: {
      name: "Vryon",
      phone: "09676767676",
      age: 20,
    },
  });
  console.log("Created patient:", patient);

  // Fetch all users with their posts
  const allPatients = await prisma.patient.findMany({});
  console.log("All users:", JSON.stringify(allPatients));
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
