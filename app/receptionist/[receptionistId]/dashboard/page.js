import DailySummaryMetrics from "@/components/DailySummaryMetrics";
import prisma from "@/lib/prisma";


export default async function ReceptionPage({ params }) {
  const { receptionistId } = await params; // Log the doctor ID to the console

  const receptionist = await prisma.receptionist.findFirst({
    where: {
      OR: [{ userId: receptionistId }, { id: receptionistId }],
    },
  });

  // 1. Define the boundaries for "today" in UTC
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 999);

  // 2. Query Prisma for the count
  const checkedInTodayCount = await prisma.appointment.count({
    where: {
      status: 'CHECKED_IN',
      date: {
        gte: startOfToday, // Greater than or equal to 12:00 AM today
        lte: endOfToday,   // Less than or equal to 11:59 PM today
      },
    },
  });

  if (!receptionist) {
    notFound();
  }


  return (
    <div className="relative flex-1 overflow-x-hidden bg-background text-gray-900 dark:text-gray-100 font-sans">
      <DailySummaryMetrics receptionist={receptionist}/>
      
    </div>
  );
}




// export async function generateStaticParams() {
//   const receptionistId = ["32HDJ3G5", "32HDJ3G4F", "32HDJ3G52"];
//   return receptionistId.map((receptionistId) => ({
//     receptionistId,
//   }));
// }

// export const revalidate = 3600; // Revalidate every hour (ISR)           
