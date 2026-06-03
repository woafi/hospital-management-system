import AvailabilitySchedule from "@/components/WeeklyAvailability";
import DoctorDailySummaryMetrics from "@/components/DoctorDailySummaryMetrics";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DoctorPage({ params }) {
  const { doctorId } = await params;

  // Fetch doctor details from database
  const doctor = await prisma.doctor.findFirst({
    where: {
      OR: [{ id: doctorId }, { userId: doctorId }, { doctor_id: doctorId }],
    },
    select: {
      id: true,
      userId: true,
      name: true,
      specialization: true,
      room: true,
    },
  });

  if (!doctor) {
    notFound();
  }

  // Fetch doctor's availabilities for schedule section
  const doctorWithAvailabilities = await prisma.doctor.findFirst({
    where: {
      OR: [{ id: doctorId }, { userId: doctorId }, { doctor_id: doctorId }],
    },
    include: {
      availabilities: {
        include: {
          available_slots: {
            orderBy: { startTime: "asc" },
          },
        },
      },
    },
  });

  // Pusher configuration for real-time updates
  const pusherConfig = {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.PUSHER_KEY || "",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER || "",
    channel: "doctor-dashboard",
    event: "appointments-updated",
  };

  return (
    <div className="relative flex-1 overflow-x-hidden bg-background text-gray-900 dark:text-gray-100 font-sans">
      {/* Dashboard component with real-time appointments and metrics */}
      <DoctorDailySummaryMetrics
        doctor={doctor}
        doctorId={doctorId}
        pusherConfig={pusherConfig}
      />

      {/* Main container for schedule grid */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-8 pb-20">
        {/* Schedule Grid */}
        <AvailabilitySchedule
          availabilities={doctorWithAvailabilities.availabilities}
          doctorId={doctorWithAvailabilities.id}
          revalidatePaths={[`/doctor/${doctorId}/dashboard`, `/doctor/${doctorId}/profile`]}
        />
      </main>
    </div>
  );
}

// export async function generateStaticParams() {
//   const doctorIds = ["32HDJ3G5", "32HDJ3G4F", "32HDJ3G52"];
//   return doctorIds.map((doctorId) => ({
//     doctorId,
//   }));
// }

// export const revalidate = 3600; // Revalidate every hour (ISR)

// export async function generateStaticParams() {
//   const doctorIds = ["32HDJ3G5", "32HDJ3G4F", "32HDJ3G52"];
//   return doctorIds.map((doctorId) => ({
//     doctorId,
//   }));
// }

// export const revalidate = 3600; // Revalidate every hour (ISR)           
