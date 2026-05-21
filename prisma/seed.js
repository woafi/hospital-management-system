import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Helper: create time slots
function generateSlots(date, count) {
  const slots = [];
  let startHour = 9; // 9 AM start

  for (let i = 0; i < count; i++) {
    const start = new Date(date);
    start.setHours(startHour + i, 0, 0);

    const end = new Date(date);
    end.setHours(startHour + i + 1, 0, 0);

    slots.push({
      startTime: start,
      endTime: end,
    });
  }

  return slots;
}

async function main() {
  /*
    ===============================
    SUPER ADMIN
    ===============================
  */
  const superAdminEmail = "superadmin@example.com";

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 12);

    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        phone: "01700000000",
      },
    });

    console.log("🚀 Super Admin created");
  }

  /*
    ===============================
    DOCTORS
    ===============================
  */
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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (const doc of doctors) {
    const existing = await prisma.user.findUnique({
      where: { email: doc.email },
    });

    if (existing) {
      console.log(`✅ ${doc.name} exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash("Doctor@123", 12);

    const doctor = await prisma.doctor.create({
      data: {
        doctor_id: doc.doctor_id,
        name: doc.name,
        specialization: doc.specialization,
        qualification: doc.qualification,
        bio: `${doc.specialization} specialist`,
        gender: doc.gender,
        consultationFee: 500,

        user: {
          create: {
            email: doc.email,
            phone: doc.phone,
            password: hashedPassword,
            role: "DOCTOR",
          },
        },
      },
    });

    // Availability + Slots
    for (const day of days) {
      let status = "Available";
      let slotCount = 5;

      if (day === "Friday") {
        status = "Off_duty";
        slotCount = 0;
      } else if (day === "Thursday") {
        slotCount = 3; // half day
      }

      const availability = await prisma.availability.create({
        data: {
          day,
          status,
          doctorId: doctor.id,
        },
      });

      if (slotCount > 0) {
        const today = new Date();

        const slots = generateSlots(today, slotCount);

        for (const slot of slots) {
          await prisma.slot.create({
            data: {
              startTime: slot.startTime,
              endTime: slot.endTime,
              availabilityId: availability.id,
            },
          });
        }
      }
    }

    console.log(`🚀 ${doc.name} created with schedule`);
  }

  /*
    ===============================
    RECEPTIONISTS
    ===============================
  */
  const receptionists = [
    {
      name: "Alice Rahman",
      receptionists_id: "REC-001",
      email: "reception1@example.com",
      phone: "01811111111",
      gender: "FEMALE",
      shift: "Morning",
    },
    {
      name: "Bob Hasan",
      receptionists_id: "REC-002",
      email: "reception2@example.com",
      phone: "01822222222",
      gender: "MALE",
      shift: "Evening",
    },
  ];

  for (const rec of receptionists) {
    const existing = await prisma.user.findUnique({
      where: { email: rec.email },
    });

    if (existing) continue;

    const hashedPassword = await bcrypt.hash("Reception@123", 12);

    await prisma.receptionist.create({
      data: {
        name: rec.name,
        receptionists_id: rec.receptionists_id,
        gender: rec.gender,
        shift: rec.shift,

        user: {
          create: {
            email: rec.email,
            phone: rec.phone,
            password: hashedPassword,
            role: "RECEPTIONIST",
          },
        },
      },
    });

    console.log(`🚀 ${rec.name} created`);
  }

  /*
    ===============================
    PATIENTS
    ===============================
  */
  const patients = [
    {
      fullname: "Rahim Uddin",
      phone: "01911111111",
      gender: "MALE",
    },
    {
      fullname: "Karim Ahmed",
      phone: "01922222222",
      gender: "MALE",
    },
    {
      fullname: "Ayesha Khan",
      phone: "01933333333",
      gender: "FEMALE",
    },
    {
      fullname: "Nusrat Jahan",
      phone: "01944444444",
      gender: "FEMALE",
    },
    {
      fullname: "Tanvir Hasan",
      phone: "01955555555",
      gender: "MALE",
    },
  ];

  let counter = 1;

  for (const p of patients) {
    await prisma.patient.create({
      data: {
        patientId: `HMS-2026-${String(counter).padStart(6, "0")}`,
        fullname: p.fullname,
        gender: p.gender,
        phone: p.phone,
      },
    });

    counter++;
  }

  console.log("🚀 Patients created");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });