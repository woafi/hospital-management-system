
import BookAppointment from "@/components/BookAppointment";
export default async function AppointmentManagement() {
    return (
        <div className="relative flex-1 overflow-x-hidden bg-background text-gray-900 dark:text-gray-100 font-sans">

            <main className="max-w-7xl mx-auto p-6 space-y-8 ">

                <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
                            Appointment Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
                            Efficiently track and manage hospital scheduling workflows.
                        </p>
                    </div>

                    {/* Book new Appointment */}
                    <BookAppointment />
                </div>

                {/* Filters & Search Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative group">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-foregd border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-600  transition-all text-sm"
                                placeholder="Search by Name, Patient ID, or Phone Number..."
                            />
                        </div>
                    </div>
                </div>


                {/* Table Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium">
                        <span>All Status</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-blue-600/5">
                        <span>Pending</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-blue-600/5">
                        <span>Confirmed</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-blue-600/5">
                        <span>Completed</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 text-blue-600 cursor-pointer">
                            <option>Latest</option>
                            <option>Department</option>
                            <option>Doctor Name</option>
                        </select>
                    </div>
                </div>


                {/* Appointments Table */}
                <div className="rounded-xl border border-blue-600/10 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-blue-600/10">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Patient Name</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Doctor</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Department</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Time Slot</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-600/5">
                                {/* Row 1 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">John Doe</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Smith</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Cardiology
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">09:00 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Jane Roe</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Adams</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Pediatrics
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">10:30 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Robert Fox</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Taylor</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Neurology
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">11:15 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Emily Chen</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Smith</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Cardiology
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">01:45 PM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancelled
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 5 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Michael Brown</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Wilson</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Orthopedics
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">03:00 PM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 6 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Michael Brown</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Wilson</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Orthopedics
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">03:00 PM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 7 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Michael Brown</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Wilson</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Orthopedics
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">03:00 PM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 8 */}
                                <tr className="hover:bg-blue-600/5 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Michael Brown</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Dr. Wilson</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-600">
                                            Orthopedics
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">03:00 PM</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-blue-600/10 bg-gray-50 dark:bg-gray-900/50">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-bold text-gray-900 dark:text-white">5</span> of{' '}
                            <span className="font-bold text-gray-900 dark:text-white">128</span> appointments
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/5 disabled:opacity-50"
                                disabled
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-blue-600 text-white text-sm font-bold">
                                1
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/5">
                                2
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/5">
                                3
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-gray-800 border border-blue-600/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}


export async function generateStaticParams() {
    const receptionistId = ["32HDJ3G5", "32HDJ3G4F", "32HDJ3G52"];
    return receptionistId.map((receptionistId) => ({
        receptionistId,
    }));
}

// export const revalidate = 3600; // Revalidate every hour (ISR)
