"use client";
import { useState } from "react";

// ─── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const ICONS = {
  close:    "M6 18L18 6M6 6l12 12",
  search:   "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  person:   "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  doctor:   "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  chevron:  "M19 9l-7 7-7-7",
  info:     "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check:    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = [
  { day: "Mon", date: 17 },
  { day: "Tue", date: 18, selected: true },
  { day: "Wed", date: 19 },
  { day: "Thu", date: 20 },
  { day: "Fri", date: 21 },
  { day: "Sat", date: 22, disabled: true },
  { day: "Sun", date: 23, disabled: true },
];

const SLOTS = [
  { time: "09:00 AM" },
  { time: "09:30 AM" },
  { time: "10:00 AM", selected: true },
  { time: "10:30 AM" },
  { time: "11:00 AM" },
  { time: "11:30 AM", booked: true },
  { time: "01:30 PM" },
  { time: "02:00 PM" },
];

const DEPARTMENTS = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "General Medicine"];
const DOCTORS = ["Dr. Sarah Jenkins", "Dr. Michael Chen", "Dr. Elena Rodriguez"];

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function BookAppointmentModal({ onClose }) {
  const [selectedDay, setSelectedDay]   = useState(18);
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [dept, setDept]                 = useState("Cardiology");
  const [doctor, setDoctor]             = useState("Dr. Sarah Jenkins");
  const [query, setQuery]               = useState("");
  const [confirmed, setConfirmed]       = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose?.();
    }, 1800);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="
            bg-white dark:bg-gray-900
            w-full max-w-4xl
            rounded-2xl shadow-2xl
            border border-gray-100 dark:border-gray-800
            flex flex-col
            overflow-hidden
            max-h-[95vh]
            animate-modal-in
          "
          style={{ animation: "modalIn 0.25s cubic-bezier(.22,1,.36,1) both" }}
        >
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.96) translateY(12px); }
              to   { opacity: 1; transform: scale(1)    translateY(0); }
            }
          `}</style>

          {/* ── Header ── */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Icon path={ICONS.calendar} className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white text-lg font-extrabold tracking-tight leading-none">Book New Appointment</h2>
                <p className="text-gray-400 text-xs mt-0.5">Schedule a consultation for a patient</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon path={ICONS.close} className="w-4 h-4" />
            </button>
          </header>

          {/* ── Body ── */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

            {/* Left: Form */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 min-h-0">

              {/* Patient Search */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Patient Name or ID</label>
                <div className="relative group">
                  <Icon path={ICONS.search} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name, phone, or MRN..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Dept & Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Department", value: dept, setter: setDept, options: DEPARTMENTS },
                  { label: "Doctor",     value: doctor, setter: setDoctor, options: DOCTORS },
                ].map(({ label, value, setter, options }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={e => setter(e.target.value)}
                        className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-9 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all cursor-pointer"
                      >
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <Icon path={ICONS.chevron} className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Date</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS.map(({ day, date, disabled }) => {
                    const active = selectedDay === date;
                    return (
                      <button
                        key={date}
                        disabled={disabled}
                        onClick={() => !disabled && setSelectedDay(date)}
                        className={`
                          flex flex-col items-center py-2.5 px-1 rounded-xl border text-center transition-all
                          ${disabled
                            ? "opacity-40 cursor-not-allowed border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                            : active
                              ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-600/25"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500"
                          }
                        `}
                      >
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? "text-blue-100" : "text-gray-400"}`}>{day}</span>
                        <span className={`text-base font-black mt-0.5 ${active ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>{date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available Time Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SLOTS.map(({ time, booked }) => {
                    const active = selectedSlot === time && !booked;
                    return (
                      <button
                        key={time}
                        disabled={booked}
                        onClick={() => !booked && setSelectedSlot(time)}
                        className={`
                          py-2.5 text-sm font-semibold rounded-xl border transition-all
                          ${booked
                            ? "line-through text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 cursor-not-allowed"
                            : active
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          }
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-6 flex flex-col justify-between flex-shrink-0">
              <div className="space-y-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Appointment Summary</p>

                {/* Summary rows */}
                {[
                  { icon: ICONS.person,   label: "Patient",    value: "John Doe",         sub: "MRN-92831" },
                  { icon: ICONS.doctor,   label: "Doctor",     value: doctor,             sub: dept },
                  { icon: ICONS.clock,    label: "Date & Time",value: `${DAYS.find(d=>d.date===selectedDay)?.day}, Mar ${selectedDay}`, sub: selectedSlot },
                ].map(({ icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon path={icon} className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{value}</p>
                      {sub && <p className="text-xs text-gray-400">{sub}</p>}
                    </div>
                  </div>
                ))}

                {/* Fee breakdown */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Consultation Fee</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">$120.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Facility Charge</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">$15.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300 dark:border-gray-600 mt-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-black text-blue-600">$135.00</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-300 text-xs">
                  <Icon path={ICONS.info} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>A confirmation SMS will be sent to the patient.</span>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={confirmed}
                  className={`
                    w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${confirmed
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[0.98]"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-[0.97]"
                    }
                  `}
                >
                  <Icon path={confirmed ? ICONS.check : ICONS.calendar} className="w-4 h-4" />
                  {confirmed ? "Appointment Confirmed!" : "Confirm Appointment"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  Discard Draft
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}