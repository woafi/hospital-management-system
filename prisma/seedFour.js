import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedDoctors() {
    const newDoctors = [
        {
            name: "Dr. Ayesha Rahman",
            email: "doc6@example.com",
            phone: "01766666666",
            doctor_id: "DOC-006",
            specialization: "Gynecology",
            qualification: "MBBS, FCPS (Gynae)",
            gender: "FEMALE",
            room: 201,
        },
        {
            name: "Dr. Tanvir Hasan",
            email: "doc7@example.com",
            phone: "01777777777",
            doctor_id: "DOC-007",
            specialization: "ENT",
            qualification: "MBBS, DLO",
            gender: "MALE",
            room: 305,
        },
        {
            name: "Dr. Nusrat Jahan",
            email: "doc8@example.com",
            phone: "01788888888",
            doctor_id: "DOC-008",
            specialization: "Ophthalmology",
            qualification: "MBBS, DO",
            gender: "FEMALE",
            room: 210,
        },
        {
            name: "Dr. Imran Hossain",
            email: "doc9@example.com",
            phone: "01799999999",
            doctor_id: "DOC-009",
            specialization: "Urology",
            qualification: "MBBS, MS (Urology)",
            gender: "MALE",
            room: 410,
        },
        {
            name: "Dr. Farhana Sultana",
            email: "doc10@example.com",
            phone: "01800000001",
            doctor_id: "DOC-010",
            specialization: "Endocrinology",
            qualification: "MBBS, MD",
            gender: "FEMALE",
            room: 115,
        },
        {
            name: "Dr. Rakib Chowdhury",
            email: "doc11@example.com",
            phone: "01800000002",
            doctor_id: "DOC-011",
            specialization: "Nephrology",
            qualification: "MBBS, MD (Nephro)",
            gender: "MALE",
            room: 512,
        },
        {
            name: "Dr. Sharmeen Akter",
            email: "doc12@example.com",
            phone: "01800000003",
            doctor_id: "DOC-012",
            specialization: "Psychiatry",
            qualification: "MBBS, MPhil",
            gender: "FEMALE",
            room: 222,
        },
        {
            name: "Dr. Mahmudul Karim",
            email: "doc13@example.com",
            phone: "01800000004",
            doctor_id: "DOC-013",
            specialization: "Oncology",
            qualification: "MBBS, MD (Onco)",
            gender: "MALE",
            room: 220,
        },
        {
            name: "Dr. Rafia Islam",
            email: "doc14@example.com",
            phone: "01800000005",
            doctor_id: "DOC-014",
            specialization: "Radiology",
            qualification: "MBBS, DMRT",
            gender: "FEMALE",
            room: 318,
        },
        {
            name: "Dr. Arif Mahmud",
            email: "doc15@example.com",
            phone: "01800000006",
            doctor_id: "DOC-015",
            specialization: "Anesthesiology",
            qualification: "MBBS, DA",
            gender: "MALE",
            room: 101,
        },
        {
            name: "Dr. Sadia Noor",
            email: "doc16@example.com",
            phone: "01800000007",
            doctor_id: "DOC-016",
            specialization: "Hematology",
            qualification: "MBBS, FCPS",
            gender: "FEMALE",
            room: 118,
        },
        {
            name: "Dr. Faisal Ahmed",
            email: "doc17@example.com",
            phone: "01800000008",
            doctor_id: "DOC-017",
            specialization: "Gastroenterology",
            qualification: "MBBS, MD (Gastro)",
            gender: "MALE",
            room: 402,
        },
        {
            name: "Dr. Laila Yasmin",
            email: "doc18@example.com",
            phone: "01800000009",
            doctor_id: "DOC-018",
            specialization: "Pulmonology",
            qualification: "MBBS, DTCD",
            gender: "FEMALE",
            room: 330,
        },
        {
            name: "Dr. Zubair Alam",
            email: "doc19@example.com",
            phone: "01800000010",
            doctor_id: "DOC-019",
            specialization: "General Surgery",
            qualification: "MBBS, MS",
            gender: "MALE",
            room: 101,
        },
        {
            name: "Dr. Tania Haque",
            email: "doc20@example.com",
            phone: "01800000011",
            doctor_id: "DOC-020",
            specialization: "Pathology",
            qualification: "MBBS, MPhil",
            gender: "FEMALE",
            room: 250,
        },
    ];

    for (const doc of newDoctors) {
        try {
            // Check existing user OR doctor
            const existingUser = await prisma.user.findUnique({
                where: { email: doc.email },
            });

            const existingDoctor = await prisma.doctor.findUnique({
                where: { doctor_id: doc.doctor_id },
            });

            if (existingUser || existingDoctor) {
                console.log(`⚠️ Skipped ${doc.name} (already exists)`);
                continue;
            }

            // ✅ Correct hashing
            const hashedPassword = await bcrypt.hash("Doctor@123", 12);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: doc.email,
                    password: hashedPassword, // ✅ FIXED
                    role: "DOCTOR",
                    phone: doc.phone,
                },
            });

            // Create doctor
            await prisma.doctor.create({
                data: {
                    doctor_id: doc.doctor_id,
                    name: doc.name,
                    specialization: doc.specialization,
                    qualification: doc.qualification,
                    gender: doc.gender,
                    room: doc.room,
                    bio: "Experienced doctor",
                    userId: user.id,
                },
            });

            console.log(`✅ Created ${doc.name}`);

        } catch (error) {
            console.error(`❌ Error creating ${doc.name}:`, error.message);
        }
    }
}

seedDoctors()
    .then(() => console.log("🎉 Doctors seeded successfully"))
    .catch(console.error)
    .finally(() => prisma.$disconnect());