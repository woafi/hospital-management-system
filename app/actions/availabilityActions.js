"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const SLOT_REFERENCE = new Date(2000, 0, 1);
const DAYS = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);
const STATUSES = new Set(["Available", "Emergency Only", "Off-duty"]);
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function statusToDb(status) {
  if (status === "Emergency Only") return "Emergency_Only";
  if (status === "Off-duty") return "Off_duty";
  return status;
}

function statusFromDb(status) {
  if (status === "Emergency_Only") return "Emergency Only";
  if (status === "Off_duty") return "Off-duty";
  return status;
}

function timeToDate(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(SLOT_REFERENCE);
  d.setHours(h, m, 0, 0);
  return d;
}

function timeFromDate(value) {
  const date = new Date(value);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function serializeAvailability(availability) {
  // Server actions should return plain data so the client can update immediately.
  return {
    id: availability.id,
    day: availability.day,
    status: statusFromDb(availability.status),
    timeSlots: (availability.available_slots ?? []).map((slot) => ({
      id: slot.id,
      start: timeFromDate(slot.startTime),
      end: timeFromDate(slot.endTime),
      isBooked: slot.is_booked,
    })),
  };
}

function normalizeTimeSlots(timeSlots = []) {
  return timeSlots.map((slot) => ({
    id: slot.id,
    start: String(slot.start ?? "").trim(),
    end: String(slot.end ?? "").trim(),
  }));
}

function validateTimeSlots(timeSlots) {
  for (const [index, slot] of timeSlots.entries()) {
    if (!TIME_PATTERN.test(slot.start) || !TIME_PATTERN.test(slot.end)) {
      return `Slot ${index + 1} needs a valid start and end time`;
    }

    if (timeToMinutes(slot.start) >= timeToMinutes(slot.end)) {
      return "Each slot end time must be after its start time";
    }
  }

  return null;
}

async function persistSlots(tx, availabilityId, timeSlots) {
  const existing = await tx.slot.findMany({
    where: { availabilityId },
  });
  const existingById = new Map(existing.map((s) => [s.id, s]));
  const draftIds = new Set(timeSlots.filter((s) => s.id).map((s) => s.id));

  for (const booked of existing.filter((s) => s.is_booked)) {
    if (!draftIds.has(booked.id)) {
      return { ok: false, error: "Cannot remove a booked time slot" };
    }
  }

  const toDelete = existing
    .filter((s) => !s.is_booked && !draftIds.has(s.id))
    .map((s) => s.id);

  if (toDelete.length > 0) {
    await tx.slot.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const slot of timeSlots) {
    const startTime = timeToDate(slot.start);
    const endTime = timeToDate(slot.end);

    if (slot.id && existingById.has(slot.id)) {
      const current = existingById.get(slot.id);
      if (current.is_booked) continue;
      await tx.slot.update({
        where: { id: slot.id },
        data: { startTime, endTime },
      });
    } else {
      await tx.slot.create({
        data: { startTime, endTime, availabilityId },
      });
    }
  }

  return { ok: true };
}

export async function createAvailability(doctorId, payload, pathsToRevalidate = []) {
  try {
    const { day, status } = payload;
    const timeSlots = normalizeTimeSlots(payload.timeSlots);

    if (!doctorId || !day) {
      return { ok: false, error: "Doctor and day are required" };
    }
    if (!DAYS.has(day)) {
      return { ok: false, error: "Please choose a valid day" };
    }
    if (!STATUSES.has(status)) {
      return { ok: false, error: "Please choose a valid status" };
    }

    const duplicate = await prisma.availability.findFirst({
      where: { doctorId, day },
    });
    if (duplicate) {
      return { ok: false, error: `${day} is already on the schedule` };
    }

    if (status !== "Off-duty") {
      const slotError = validateTimeSlots(timeSlots);
      if (slotError) return { ok: false, error: slotError };
    }

    const availability = await prisma.availability.create({
      data: {
        doctorId,
        day,
        status: statusToDb(status),
        ...(status !== "Off-duty" && timeSlots.length > 0
          ? {
              available_slots: {
                create: timeSlots.map((slot) => ({
                  startTime: timeToDate(slot.start),
                  endTime: timeToDate(slot.end),
                })),
              },
            }
          : {}),
      },
      include: {
        available_slots: { orderBy: { startTime: "asc" } },
      },
    });

    for (const path of pathsToRevalidate) revalidatePath(path);
    return { ok: true, availability: serializeAvailability(availability) };
  } catch (error) {
    console.error("createAvailability:", error);
    return { ok: false, error: "Failed to add availability" };
  }
}

export async function updateAvailability(availabilityId, payload, pathsToRevalidate = []) {
  try {
    const { status } = payload;
    const timeSlots = normalizeTimeSlots(payload.timeSlots);

    if (!availabilityId) {
      return { ok: false, error: "Availability id is required" };
    }
    if (!STATUSES.has(status)) {
      return { ok: false, error: "Please choose a valid status" };
    }

    if (status !== "Off-duty") {
      const slotError = validateTimeSlots(timeSlots);
      if (slotError) return { ok: false, error: slotError };
    }

    const availability = await prisma.$transaction(async (tx) => {
      // Keep status and slot changes atomic, especially when booked slots exist.
      if (status === "Off-duty") {
        const booked = await tx.slot.count({
          where: { availabilityId, is_booked: true },
        });
        if (booked > 0) {
          return {
            error: "Cannot set off-duty while booked slots exist on this day",
          };
        }
      }

      await tx.availability.update({
        where: { id: availabilityId },
        data: { status: statusToDb(status) },
      });

      if (status === "Off-duty") {
        await tx.slot.deleteMany({ where: { availabilityId } });
      } else {
        const slotResult = await persistSlots(tx, availabilityId, timeSlots);
        if (!slotResult.ok) return { error: slotResult.error };
      }

      return tx.availability.findUnique({
        where: { id: availabilityId },
        include: { available_slots: { orderBy: { startTime: "asc" } } },
      });
    });

    if (availability?.error) {
      return { ok: false, error: availability.error };
    }

    for (const path of pathsToRevalidate) revalidatePath(path);
    return { ok: true, availability: serializeAvailability(availability) };
  } catch (error) {
    console.error("updateAvailability:", error);
    return { ok: false, error: "Failed to update availability" };
  }
}

export async function deleteAvailability(availabilityId, pathsToRevalidate = []) {
  try {
    if (!availabilityId) {
      return { ok: false, error: "Availability id is required" };
    }

    const booked = await prisma.slot.count({
      where: { availabilityId, is_booked: true },
    });
    if (booked > 0) {
      return {
        ok: false,
        error: "Cannot delete a day that has booked appointments",
      };
    }

    await prisma.slot.deleteMany({ where: { availabilityId } });
    await prisma.availability.delete({ where: { id: availabilityId } });

    for (const path of pathsToRevalidate) revalidatePath(path);
    return { ok: true };
  } catch (error) {
    console.error("deleteAvailability:", error);
    return { ok: false, error: "Failed to delete availability" };
  }
}
