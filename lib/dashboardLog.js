import prisma from "@/lib/prisma";

export const ENTITY_LOG_CATEGORY = "ENTITY";
export const APPOINTMENT_LOG_CATEGORY = "APPOINTMENT";

export async function createEntityDashboardLog({ type, message, entityId, metadata }) {
  return prisma.dashboardLog.create({
    data: {
      type,
      category: ENTITY_LOG_CATEGORY,
      message,
      entityId,
      metadata: metadata || null,
    },
  });
}

export async function createAppointmentDashboardLog({ type, message, appointmentId, metadata }) {
  return prisma.dashboardLog.create({
    data: {
      type,
      category: APPOINTMENT_LOG_CATEGORY,
      message,
      appointmentId,
      metadata: metadata || null,
    },
  });
}
