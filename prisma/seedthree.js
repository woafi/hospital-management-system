import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const usedRooms = new Set();

function generateUniqueRoom() {
  let room;
  do {
    room = Math.floor(100 + Math.random() * 400);
  } while (usedRooms.has(room));

  usedRooms.add(room);
  return room;
}

const doctors = [
    {
      name: "Dr. John Smith",
      email: "doc1@example.com",
      phone: "01711111111",
      doctor_id: "DOC-001",
      specialization: "Cardiology",
      qualification: "MBBS, FCPS",
      gender: "MALE",
    },
    {
      name: "Dr. Sarah Ahmed",
      email: "doc2@example.com",
      phone: "01722222222",
      doctor_id: "DOC-002",
      specialization: "Neurology",
      qualification: "MBBS, MD",
      gender: "FEMALE",
    },
    {
      name: "Dr. David Lee",
      email: "doc3@example.com",
      phone: "01733333333",
      doctor_id: "DOC-003",
      specialization: "Orthopedics",
      qualification: "MBBS, MS",
      gender: "MALE",
    },
    {
      name: "Dr. Emily Brown",
      email: "doc4@example.com",
      phone: "01744444444",
      doctor_id: "DOC-004",
      specialization: "Dermatology",
      qualification: "MBBS, DDV",
      gender: "FEMALE",
    },
    {
      name: "Dr. Michael Khan",
      email: "doc5@example.com",
      phone: "01755555555",
      doctor_id: "DOC-005",
      specialization: "Pediatrics",
      qualification: "MBBS, DCH",
      gender: "MALE",
    },
  ];

async function assignRooms() {
  const updates = doctors.map(async (doc) => {
    try {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { doctor_id: doc.doctor_id },
      });

      if (!existingDoctor) {
        console.warn(`⚠️ Doctor not found: ${doc.doctor_id}`);
        return;
      }

      const room = generateUniqueRoom();

      await prisma.doctor.update({
        where: { doctor_id: doc.doctor_id },
        data: { room },
      });

      console.log(`🏥 ${doc.name} → Room ${room}`);
    } catch (error) {
      console.error(`❌ Failed for ${doc.doctor_id}:`, error.message);
    }
  });

  await Promise.all(updates); // 🚀 run in parallel
}

await assignRooms();