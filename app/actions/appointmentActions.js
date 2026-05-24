"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Helper to format Date to AM/PM string (e.g. "09:00 AM")
function formatToAmPm(dateValue) {
  const date = new Date(dateValue);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour 0 should be 12
  const strHours = String(hours).padStart(2, "0");
  return `${strHours}:${minutes} ${ampm}`;
}

// Fetch all active doctors and compile unique departments/specializations
export async function getBookingMetaData() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        doctor_id: true,
        name: true,
        specialization: true,
        consultationFee: true,
        profileImage: true,
      },
      orderBy: { name: "asc" },
    });

    const departmentsSet = new Set();
    doctors.forEach((doc) => {
      if (doc.specialization) {
        departmentsSet.add(doc.specialization);
      }
    });
    const departments = Array.from(departmentsSet).sort();

    const serializedDoctors = doctors.map((doc) => ({
      ...doc,
      consultationFee: Number(doc.consultationFee),
    }));

    return { ok: true, departments, doctors: serializedDoctors };
  } catch (error) {
    console.error("getBookingMetaData error:", error);
    return { ok: false, error: "Failed to load booking metadata" };
  }
}

// Live search patients by name, patient ID, or phone
export async function searchPatientsAction(term) {
  try {
    const query = String(term || "").trim();
    if (!query) return [];

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { fullname: { contains: query, mode: "insensitive" } },
          { patientId: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 6,
      select: {
        id: true,
        patientId: true,
        fullname: true,
        profileImage: true,
        gender: true,
      },
    });

    return patients;
  } catch (error) {
    console.error("searchPatientsAction error:", error);
    return [];
  }
}

// Fetch doctor weekly schedule status (which weekdays are Available, Off-duty, etc.)
export async function getDoctorWeeklyScheduleAction(doctorId) {
  try {
    if (!doctorId) return { ok: false, schedule: [] };

    const availabilities = await prisma.availability.findMany({
      where: { doctorId },
      select: {
        day: true,
        status: true,
      },
    });

    return { ok: true, schedule: availabilities };
  } catch (error) {
    console.error("getDoctorWeeklyScheduleAction error:", error);
    return { ok: false, schedule: [] };
  }
}

// Fetch availability slots for a specific doctor on a specific date, checking booking status
export async function getDoctorAvailabilityAction(doctorId, dateString) {
  try {
    if (!doctorId || !dateString) {
      return { ok: false, error: "Doctor ID and date are required", slots: [] };
    }

    const dateObj = new Date(`${dateString}T00:00:00`);
    const dayIndex = dateObj.getDay(); // 0: Sunday, 1: Monday, ...
    const dayMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayMap[dayIndex];

    // Find the template weekly availability for this weekday
    const availability = await prisma.availability.findFirst({
      where: {
        doctorId,
        day: dayName,
      },
      include: {
        available_slots: {
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!availability) {
      return { ok: true, status: "Off_duty", slots: [] };
    }

    // Find existing appointments on this calendar date for this doctor to mark slots as booked
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: dateObj,
      },
      select: {
        slotId: true,
        startTime: true,
      },
    });

    const bookedSlotIds = new Set(appointments.map((a) => a.slotId).filter(Boolean));
    const bookedTimes = new Set(
      appointments.map((a) => formatToAmPm(a.startTime))
    );

    const slots = availability.available_slots || [];
    const processedSlots = slots.map((slot) => {
      const displayTime = formatToAmPm(slot.startTime);
      const isBooked =
        slot.is_booked ||
        bookedSlotIds.has(slot.id) ||
        bookedTimes.has(displayTime);

      return {
        id: slot.id,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        isBooked,
        time: displayTime,
      };
    });

    return {
      ok: true,
      status: availability.status,
      slots: processedSlots,
    };
  } catch (error) {
    console.error("getDoctorAvailabilityAction error:", error);
    return { ok: false, error: "Failed to fetch availability", slots: [] };
  }
}

// Book a new appointment
export async function bookAppointmentAction(payload) {
  try {
    const { patientId, doctorId, dateString, slotId } = payload;

    if (!patientId || !doctorId || !dateString || !slotId) {
      return { success: false, message: "All fields are required" };
    }

    const apptDate = new Date(`${dateString}T00:00:00`);

    // Fetch the slot template
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return { success: false, message: "Invalid time slot selected." };
    }

    // Compute actual calendar times for appointment
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    const startTime = new Date(apptDate);
    startTime.setHours(slotStart.getHours(), slotStart.getMinutes(), 0, 0);

    const endTime = new Date(apptDate);
    endTime.setHours(slotEnd.getHours(), slotEnd.getMinutes(), 0, 0);

    // Double-booking check
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: apptDate,
        slotId,
      },
    });

    if (existing) {
      return { success: false, message: "This time slot is already booked for this doctor." };
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: apptDate,
        startTime,
        endTime,
        patientId,
        doctorId,
        slotId,
        status: "SCHEDULED",
      },
    });

    // Revalidate receptionist appointments list
    revalidatePath("/receptionist/[receptionistId]/appointments");

    return {
      success: true,
      message: "Appointment booked successfully!",
      appointmentId: appointment.id,
    };
  } catch (error) {
    console.error("bookAppointmentAction error:", error);
    return { success: false, message: "Could not book appointment. Please try again." };
  }
}
