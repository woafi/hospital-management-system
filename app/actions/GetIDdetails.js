"use server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReceptionistDetails(receptionistId) {
    try {
        // Get receptionist with user details
        const receptionist = await prisma.receptionist.findFirst({
            where: {
                OR: [{ userId: receptionistId }, { id: receptionistId }],
            },
            include: {
                user: {
                    select: {
                        email: true,
                        phone: true,
                        lastLoginAt: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!receptionist) {
            throw new Error("Receptionist not found");
        }

        return receptionist;
    } catch (error) {
        console.error("Error fetching receptionist:", error);
        throw error;
    }
}


export async function getDoctorDetails(doctorId) {
    try {
        // Get doctor with user details
        const doctor = await prisma.doctor.findFirst({
            where: {
                OR: [{ userId: doctorId }, { id: doctorId }],
            },
            include: {
                user: {
                    select: {
                        email: true,
                        phone: true,
                        lastLoginAt: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!doctor) {
            throw new Error("doctor not found");
        }

         // Convert Decimal -> Number
        return {
            ...doctor,
            consultationFee: Number(doctor.consultationFee),
        };
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw error;
    }
}