"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function cleanSearchTerm(term) {
  return String(term || "").trim().slice(0, 80);
}

export async function searchDirectory(entity, term) {
  const query = cleanSearchTerm(term);

  if (!query) {
    return [];
  }

  if (entity === "doctors") {
    const doctors = await prisma.doctor.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { doctor_id: { contains: query, mode: "insensitive" } },
          { specialization: { contains: query, mode: "insensitive" } },
          { qualification: { contains: query, mode: "insensitive" } },
          {
            user: {
              is: {
                OR: [
                  { phone: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        doctor_id: true,
        name: true,
        specialization: true,
        profileImage: true,
        user: {
          select: {
            phone: true,
            email: true,
          },
        },
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      title: doctor.name,
      code: doctor.doctor_id,
      subtitle: doctor.specialization,
      contact: doctor.user?.phone || doctor.user?.email || "",
      image: doctor.profileImage,
      href: `/doctor/${doctor.id}/profile`,
    }));
  }

  if (entity === "receptionists") {
    const receptionists = await prisma.receptionist.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { receptionists_id: { contains: query, mode: "insensitive" } },
          {
            user: {
              is: {
                OR: [
                  { phone: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        receptionists_id: true,
        shift: true,
        profileImage: true,
        user: {
          select: {
            phone: true,
            email: true,
          },
        },
      },
    });

    return receptionists.map((receptionist) => ({
      id: receptionist.id,
      title: receptionist.name,
      code: receptionist.receptionists_id,
      subtitle: `${receptionist.shift} Shift`,
      contact: receptionist.user?.phone || receptionist.user?.email || "",
      image: receptionist.profileImage,
      href: `/receptionist/${receptionist.id}/dashboard`,
    }));
  }

  return [];
}
