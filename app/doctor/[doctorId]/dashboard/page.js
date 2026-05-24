import AvailabilitySchedule from "@/components/WeeklyAvailability"
import AppointmentCalender from "@/components/AppointmentCalender";
import AppointmentButton from "@/components/AppointmentButton";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DoctorPage({ params }) {
  const { doctorId } = await params; // Log the doctor ID to the console

  const doctor = await prisma.doctor.findFirst({
    where: {
      OR: [{ id: doctorId }, { userId: doctorId }, { doctor_id: doctorId }],
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
      availabilities: {
        include: {
          available_slots: {
            orderBy: { startTime: "asc" },
          },
        },
      },
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  const today = new Date();
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(today);

  // Placeholder counts until metrics are wired to DB/API.
  const patientsSeenCount = 14;
  const remainingAppointmentsCount = 8;
  const totalPatientsTarget = patientsSeenCount + remainingAppointmentsCount;
  const completionPercent =
    totalPatientsTarget === 0
      ? 0
      : Math.round((patientsSeenCount / totalPatientsTarget) * 100);

  // Placeholder data until appointments are wired to DB/API.
  const todaysAppointments = [
    {
      id: "APT-1042",
      time: "09:00 AM",
      patient: { name: "Sophia Reynolds", initials: "SR", phone: "+1 (555) 123-4567" },
      reason: "Follow-up",
      status: "Waiting",
      room: "Room 2",
    },
    {
      id: "APT-1043",
      time: "09:30 AM",
      patient: { name: "Amina Rahman", initials: "AR", phone: "+880 17XX-XXXXXX" },
      reason: "Blood pressure review",
      status: "Checked in",
      room: "Room 1",
    },
    {
      id: "APT-1044",
      time: "10:15 AM",
      patient: { name: "James Miller", initials: "JM", phone: "+1 (555) 019-2234" },
      reason: "New consultation",
      status: "Scheduled",
      room: "Room 3",
    },
    {
      id: "APT-1045",
      time: "11:00 AM",
      patient: { name: "Noah Patel", initials: "NP", phone: "+1 (555) 202-1140" },
      reason: "Lab results discussion",
      status: "In progress",
      room: "Room 2",
    },
    {
      id: "APT-1046",
      time: "12:30 PM",
      patient: { name: "Olivia Chen", initials: "OC", phone: "+1 (555) 555-0108" },
      reason: "Post-op check",
      status: "Scheduled",
      room: "Room 4",
    },
  ];

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Checked in":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "In progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Waiting":
        return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300";
      case "Scheduled":
      default:
        return "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200";
    }
  };

  return (
    <div className="relative flex-1 overflow-x-hidden bg-background text-gray-900 dark:text-gray-100 font-sans">
      <main className="max-w-[1400px] mx-auto p-6 space-y-8 pb-20">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Daily Summary Metrics */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Today at a glance
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Key metrics for quick triage
                </p>
              </div>
              <div className="shrink-0 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-black/5 dark:border-white/10">
                Doctor: {doctorId}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-[#0d1117]/70 backdrop-blur p-5 rounded-2xl border border-black/5 dark:border-white/10 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Patients Seen
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {patientsSeenCount}
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#0d1117]/70 backdrop-blur p-5 rounded-2xl border border-black/5 dark:border-white/10 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/25 flex items-center justify-center text-orange-600 dark:text-orange-300">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Remaining Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {String(remainingAppointmentsCount).padStart(2, "0")}
                  </p>
                </div>
              </div>
              {/* Completion bar card */}
              <div className="sm:col-span-2 bg-white/80 dark:bg-[#0d1117]/70 backdrop-blur rounded-2xl border border-black/5 dark:border-white/10 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Day Progress
                  </p>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {patientsSeenCount} / {totalPatientsTarget} patients
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-black/[0.05] dark:bg-white/[0.07] overflow-hidden"
                  role="progressbar"
                  aria-label="Day progress"
                  aria-valuenow={completionPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {completionPercent}% complete - {remainingAppointmentsCount} appointments remaining today
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AppointmentCalender />
          </div>
        </section>

        {/* AppointmentList for today's patients */}
        <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0d1117]/70 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                Today&apos;s appointments
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {todayLabel} - {todaysAppointments.length} scheduled
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/doctor/${doctorId}/patients`}
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 border border-black/5 dark:border-white/10 transition-colors"
              >
                Patient Directory
              </a>
            </div>
          </div>

          <div className="border-t border-black/5 dark:border-white/10">
            {todaysAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-50">
                  No appointments yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add an appointment or pick a date from the calendar.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-black/5 dark:divide-white/10">
                {todaysAppointments.map((appt) => (
                  <li
                    key={appt.id}
                    className="px-5 sm:px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:w-52">
                        <div className="shrink-0 px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/15 text-xs font-bold tracking-wide">
                          {appt.time}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {appt.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                          {appt.patient.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-50 truncate">
                              {appt.patient.name}
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClasses(
                                appt.status
                              )}`}
                            >
                              {appt.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {appt.reason} - {appt.room} - {appt.patient.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 sm:w-52">
                        
                        <AppointmentButton text="In progress" />
                        <AppointmentButton text="Checked in" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        
        {/* Schedule Grid */}
        <AvailabilitySchedule
          availabilities={doctor.availabilities}
          doctorId={doctor.id}
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
