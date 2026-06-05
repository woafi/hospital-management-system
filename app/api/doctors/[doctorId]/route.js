import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { doctorId } = params;
    const detailed = request.nextUrl.searchParams.get("detailed") === "true";

    if (!doctorId) {
      return NextResponse.json(
        { ok: false, error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    // Fetch doctor details
    const doctor = await prisma.doctor.findFirst({
      where: {
        OR: [{ id: doctorId }, { doctor_id: doctorId }],
        isActive: true,
      },
      select: {
        id: true,
        doctor_id: true,
        name: true,
        specialization: true,
        qualification: true,
        room: true,
        bio: true,
        profileImage: true,
        consultationFee: true,
        gender: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { ok: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    if (!detailed) {
      return NextResponse.json({ ok: true, doctor });
    }

    // Fetch availabilities with slots
    const availabilities = await prisma.availability.findMany({
      where: { doctorId: doctor.id },
      include: {
        available_slots: {
          orderBy: { startTime: "asc" },
        },
      },
    });

    // Build availability map
    const availabilityMap = availabilities.reduce((acc, avail) => {
      acc[avail.day] = {
        status: avail.status,
        slots: avail.available_slots.map((slot) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          is_booked: slot.is_booked,
        })),
      };
      return acc;
    }, {});

    // Fetch booked appointments for this doctor to mark slots
    const bookedAppointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: {
        slotId: true,
        date: true,
      },
    });

    const bookedSlotIds = bookedAppointments
      .filter((appt) => appt.slotId)
      .map((appt) => appt.slotId);

    // Mark booked slots
    Object.keys(availabilityMap).forEach((day) => {
      availabilityMap[day].slots.forEach((slot) => {
        if (slot.is_booked || bookedSlotIds.includes(slot.id)) {
          slot.is_booked = true;
        }
      });
    });

    return NextResponse.json({
      ok: true,
      doctor,
      availabilities: availabilityMap,
      bookedSlotIds,
    });
  } catch (error) {
    console.error("Doctor details API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load doctor details" },
      { status: 500 }
    );
  }
}
