'use client'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link"
import Image from "next/image";
import { getReceptionistDetails } from "@/app/actions/GetIDdetails";


export default function ReceptionistNav() {
    const pathname = usePathname();
    const receptionist_id = pathname.split("/")[2];

    const [receptionist, setReceptionist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReceptionist() {
            try {
                const data = await getReceptionistDetails(receptionist_id);
                setReceptionist(data);
            } catch (error) {
                console.error("Error fetching receptionist:", error);
            } finally {
                setLoading(false);
            }
        }

        if (receptionist_id) {
            fetchReceptionist();
        }

    }, [receptionist_id]);

    if (loading) return <div>Loading...</div>;

    // Get current date in a readable format
    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const receptionistName = receptionist?.name || "Receptionist";
    
    return (
        <div className="bg-foreground flex items-center justify-between border-b border-gray-300 dark:border-slate-700 px-6 py-3">
            <div className="flex items-center gap-8">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined select-none">medical_services</span>
                    </div>
                    <span className="font-bold text-lg hidden sm:block text-primary select-none">MedCare HMS</span>
                </div>             
            </div>
            <div className="flex items-center gap-4">

                {/* Date */}
                <div className="hidden md:flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{getCurrentDate()}</span>
                </div>

                <div className="flex gap-2">
                    <Link href="/settings" className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Link>
                </div>


                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-600">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-black dark:text-white font-bold leading-none">{receptionistName}</p>
                        <p className="text-xs text-gray-500 mt-1">Receptionist</p>
                    </div>
                    <div className="relative w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden">
                        <Link href={`/receptionist/${receptionist_id}/profile`} className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {receptionist?.profileImage ? (
                                <Image
                                    src={receptionist.profileImage}
                                    alt={receptionist?.name || "Receptionist profile"}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                    {receptionist?.name?.charAt(0)?.toUpperCase()}
                                </div>
                            )}
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    )
}
