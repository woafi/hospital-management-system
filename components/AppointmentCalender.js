"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";

const AppointmentCalender = () => {
    const [value, onChange] = useState(new Date());

    const selectedLabel = useMemo(() => {
        const selected = Array.isArray(value) ? value?.[0] : value;
        if (!selected) return "";

        try {
            return new Intl.DateTimeFormat(undefined, {
                weekday: "short",
                month: "short",
                day: "2-digit",
                year: "numeric",
            }).format(selected);
        } catch {
            return String(selected);
        }
    }, [value]);

    return (
        <section className="rounded-2xl border border-black/5 dark:border-white/10 min-h-113 bg-white/80 dark:bg-[#0d1117]/70 backdrop-blur p-4 sm:p-6 ">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Calendar
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pick a day to review appointments
                    </p>
                </div>
                <div className="shrink-0 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                    {selectedLabel}
                </div>
            </div>

            <Calendar
                className="hms-calendar text-gray-900 dark:text-gray-100"
                onChange={onChange}
                value={value}
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
            />
        </section>
    );
};

export default AppointmentCalender;
