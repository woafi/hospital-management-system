import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🚀 Seeding Appointments...");

  // Get all patients
  const patients = await prisma.patient.findMany();

  if (patients.length === 0) {
    console.log("❌ No patients found. Run main seed first.");
    return;
  }

  // Get all available (not booked) slots with doctor relation
  const slots = await prisma.slot.findMany({
    where: {
      is_booked: false,
    },
    include: {
      availability: {
        include: {
          doctor: true,
        },
      },
    },
  });

  if (slots.length === 0) {
    console.log("❌ No available slots found.");
    return;
  }

  let createdCount = 0;

  for (let i = 0; i < 10; i++) {
    const patient = getRandomItem(patients);

    // pick only free slot
    const availableSlots = await prisma.slot.findMany({
      where: { is_booked: false },
      include: {
        availability: {
          include: { doctor: true },
        },
      },
    });

    if (availableSlots.length === 0) {
      console.log("⚠️ No more free slots");
      break;
    }

    const slot = getRandomItem(availableSlots);

    const doctor = slot.availability.doctor;

    // Create appointment
    await prisma.appointment.create({
      data: {
        date: new Date(), // you can randomize later
        startTime: slot.startTime,
        endTime: slot.endTime,

        status: getRandomItem([
          "SCHEDULED",
          "WAITING",
          "CHECKED_IN",
        ]),

        patientId: patient.id,
        doctorId: doctor.id,
        slotId: slot.id,
      },
    });

    // Mark slot as booked
    await prisma.slot.update({
      where: { id: slot.id },
      data: { is_booked: true },
    });

    createdCount++;
  }

  console.log(`✅ ${createdCount} appointments created`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });