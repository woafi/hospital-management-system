'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import LogoutButton from "./LogoutButton"


const DoctorSideNav = () => {
    const pathname = usePathname();
    const doctor_id = pathname.split("/")[2]; 

    return (
        <div className="w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-foreground flex flex-col shrink-0 ">
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href={`/doctor/${doctor_id}/dashboard`} className={`flex items-center gap-3 p-3 rounded-lg ${pathname.includes("/dashboard") ? `bg-blue-600/10 text-blue-600` : `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}  transition-colors`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium hidden lg:block">Dashboard</span>
                </Link>
                <Link href={`/doctor/${doctor_id}/patients`} className={`flex items-center gap-3 p-3 rounded-lg ${pathname.includes("/patients") ? `bg-blue-600/10 text-blue-600` : `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}  transition-colors`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium hidden lg:block">Patients Records</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                {/* <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            JW
                        </div>
                    </div>
                    <div className="hidden lg:block truncate">
                        <p className="text-xs font-bold truncate">Dr. James Wilson</p>
                        <p className="text-xs text-gray-500 truncate">Cardiologist</p>
                    </div>
                </div> */}
                <LogoutButton />

            </div>
        </div>
    )
}

export default DoctorSideNav