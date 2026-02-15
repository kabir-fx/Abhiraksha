import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const policy = await prisma.insurancePolicy.upsert({
    where: { policyNumber: "001" },
    update: {},
    create: {
      policyNumber: "001",
      patientName: "Rahul Verma",
      billNumber: "IP-2023-8821",
      admissionDate: "12-10-2023",
      lengthOfStayDays: 3,
      grossTotal: 133000,
      discount: 3000,
      netPayable: 130000,
      perDayRate: 6500,
      days: 3,
      roomRentTotal: 19500,
      icuTotal: 0,
      icuDays: 0,
      doctorVisitCharges: 4500,
      surgeryCharges: 65000,
      anesthesiaCharges: 12000,
      procedureTotal: 81500,
      otCharges: 15000,
      equipmentCharges: 1000,
      pharmacyCharges: 4250,
      investigationCharges: 5500,
      nursingCharges: 1500,
      consumablesCharges: 3500,
      miscellaneousCharges: 750,
    },
  });

  console.log({ policy });
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
