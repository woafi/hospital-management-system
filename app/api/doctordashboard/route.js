import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyDoctorDashboard, notifyReceptionDashboard } from "@/lib/pusher";

const DOCTOR_ALLOWED_STATUS_UPDATES = new Set(["IN_PROGRESS", "CHECKED_IN"]);

function getDateRange(dateParam) {
  const selectedDate = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();

  if (Number.isNaN(selectedDate.getTime())) {
    return null;
  }

  const start = new Date(selectedDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function formatInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

async function findDoctor(doctorId) {
  if (!doctorId) return null;

  return prisma.doctor.findFirst({
    where: {
      OR: [{ userId: doctorId }, { id: doctorId }, { doctor_id: doctorId }],
    },
    select: {
      id: true,
      userId: true,
      doctor_id: true,
      name: true,
      specialization: true,
      room: true,
    },
  });
}

function serializeAppointment(appointment) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    id: appointment.id,
    date: appointment.date.toISOString(),
    time: formatter.format(appointment.startTime),
    endTime: formatter.format(appointment.endTime),
    status: appointment.status,
    patient: {
      id: appointment.patient.id,
      name: appointment.patient.fullname,
      profileImage: appointment.patient.profileImage,
      initials: formatInitials(appointment.patient.fullname) || "PT",
      phone: appointment.patient.phone || "No phone",
      patientId: appointment.patient.patientId,
    },
    doctor: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      specialization: appointment.doctor.specialization,
      room: appointment.doctor.room,
    },
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const range = getDateRange(date);

    if (!doctorId) {
      return NextResponse.json(
        { ok: false, error: "Doctor ID is required." },
        { status: 400 }
      );
    }

    if (!range) {
      return NextResponse.json(
        { ok: false, error: "Invalid dashboard date." },
        { status: 400 }
      );
    }

    const doctor = await findDoctor(doctorId);

    if (!doctor) {
      return NextResponse.json(
        { ok: false, error: "Doctor not found." },
        { status: 404 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        date: {
          gte: range.start,
          lte: range.end,
        },
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
      include: {
        patient: {
          select: {
            id: true,
            fullname: true,
            patientId: true,
            phone: true,
            profileImage: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            room: true,
          },
        },
      },
    });

    const metrics = appointments.reduce(
      (result, appointment) => {
        result.total += 1;

        if (appointment.status === "CHECKED_IN") result.patientSeen += 1;
        if (appointment.status === "IN_PROGRESS") result.inProgress += 1;
        if (appointment.status !== "CHECKED_IN") result.remaining += 1;
        if (appointment.status === "WAITING") {
          result.waiting += 1;
        }

        return result;
      },
      {
        total: 0,
        patientSeen: 0,
        remaining: 0,
        inProgress: 0,
        waiting: 0,
      }
    );

    metrics.completionPercent =
      metrics.total === 0
        ? 0
        : Math.round((metrics.patientSeen / metrics.total) * 100);

    return NextResponse.json({
      ok: true,
      doctor,
      metrics,
      appointments: appointments.map(serializeAppointment),
      realtime: {
        channel: "doctor-dashboard",
        event: "appointments-updated",
      },
    });
  } catch (error) {
    console.error("Doctor dashboard GET error:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to load doctor dashboard." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const appointmentId = String(body?.appointmentId || "");
    const status = String(body?.status || "");
    const doctorId = String(body?.doctorId || "");

    if (!appointmentId || !DOCTOR_ALLOWED_STATUS_UPDATES.has(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Valid appointment ID and doctor status are required.",
        },
        { status: 400 }
      );
    }

    const doctor = await findDoctor(doctorId);

    if (!doctor) {
      return NextResponse.json(
        { ok: false, error: "Doctor not found." },
        { status: 404 }
      );
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { ok: false, error: "Appointment not found for this doctor." },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      select: {
        id: true,
        date: true,
        status: true,
        doctorId: true,
      },
    });

    const notificationPayload = {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      requestedDoctorId: doctorId,
      date: appointment.date.toISOString(),
      status: appointment.status,
    };

    await notifyDoctorDashboard(notificationPayload);
    await notifyReceptionDashboard(notificationPayload);

    return NextResponse.json({ ok: true, appointment });
  } catch (error) {
    console.error("Doctor dashboard PATCH error:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to update appointment status." },
      { status: 500 }
    );
  }
}
