"use client";
import { useState } from "react";

// ─── Inline SVG Icon helper ───────────────────────────────────────────────────
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const ICONS = {
  close: "M6 18L18 6M6 6l12 12",
  person: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  contact: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  emergency: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  medical: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  register: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
};

// ─── Reusable field components ────────────────────────────────────────────────
const Label = ({ children }) => (
  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`
      w-full px-4 py-2.5 rounded-xl text-sm
      bg-gray-50 dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      text-gray-900 dark:text-white placeholder-gray-400
      focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600
      outline-none transition-all
      ${className}
    `}
    {...props}
  />
);

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select
      className="
        appearance-none w-full px-4 py-2.5 rounded-xl text-sm
        bg-gray-50 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600
        outline-none transition-all cursor-pointer
      "
      {...props}
    >
      {children}
    </select>
    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, label, accent = "blue" }) => {
  const colors = {
    blue: "bg-blue-600/10 text-blue-600",
    green: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[accent]}`}>
        <Icon path={icon} className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">{label}</h3>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function AddPatientModal({ onClose }) {
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    fullName: "", gender: "", dob: "",
    phone: "", email: "", address: "",
    ecName: "", ecRelation: "", ecPhone: "",
    bloodGroup: "O+", allergies: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    setDone(true);
    setTimeout(() => {
      setDone(false);
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
            w-full max-w-3xl
            rounded-2xl shadow-2xl
            border border-gray-100 dark:border-gray-800
            flex flex-col
            overflow-hidden
            max-h-[95vh]
          "
          style={{ animation: "modalIn 0.25s cubic-bezier(.22,1,.36,1) both" }}
        >
          <style>{`
            @keyframes modalIn {
              from { opacity:0; transform:scale(0.96) translateY(14px); }
              to   { opacity:1; transform:scale(1)    translateY(0); }
            }
          `}</style>

          {/* ── Header ── */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Icon path={ICONS.register} className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white text-lg font-extrabold tracking-tight leading-none">Register New Patient</h2>
                <p className="text-gray-400 text-xs mt-0.5">Enter clinical and personal data to create a new record</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-generated patient ID badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono border border-blue-100 dark:border-blue-800">
                ID: CS-2024-0891
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon path={ICONS.close} className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ── Scrollable Form ── */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-8">

            {/* ── Section 1: Personal Info ── */}
            <section>
              <SectionHeader icon={ICONS.person} label="Personal Information" accent="blue" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <Label>Full Name</Label>
                  <Input placeholder="e.g. Eleanor Vance" value={form.fullName} onChange={set("fullName")} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onChange={set("gender")}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={form.dob} onChange={set("dob")} />
                </div>
              </div>
            </section>

            {/* ── Section 2: Contact Details ── */}
            <section>
              <SectionHeader icon={ICONS.contact} label="Contact Details" accent="blue" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="patient@example.com" value={form.email} onChange={set("email")} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Residential Address</Label>
                  <Input placeholder="Street name, City, State, ZIP" value={form.address} onChange={set("address")} />
                </div>
              </div>
            </section>

            {/* ── Section 3: Emergency Contact ── */}
            <section className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-100 dark:border-amber-800/30">
              <SectionHeader icon={ICONS.emergency} label="Emergency Contact" accent="amber" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Relative's name"
                    value={form.ecName} onChange={set("ecName")}
                    className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800/40"
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    placeholder="e.g. Spouse"
                    value={form.ecRelation} onChange={set("ecRelation")}
                    className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800/40"
                  />
                </div>
                <div>
                  <Label>Emergency Phone</Label>
                  <Input
                    type="tel" placeholder="+1 (555) 000-0000"
                    value={form.ecPhone} onChange={set("ecPhone")}
                    className="bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800/40"
                  />
                </div>
              </div>
            </section>

            {/* ── Section 4: Medical Data ── */}
            <section>
              <SectionHeader icon={ICONS.medical} label="Preliminary Medical Data" accent="red" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Blood Group</Label>
                  <Select value={form.bloodGroup} onChange={set("bloodGroup")}>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => <option key={g}>{g}</option>)}
                  </Select>
                </div>
                <div className="sm:col-span-3">
                  <Label>Known Allergies</Label>
                  <textarea
                    rows={2}
                    placeholder="List any known medication or environmental allergies…"
                    value={form.allergies}
                    onChange={set("allergies")}
                    className="
                      w-full px-4 py-2.5 rounded-xl text-sm resize-none
                      bg-gray-50 dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      text-gray-900 dark:text-white placeholder-gray-400
                      focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600
                      outline-none transition-all
                    "
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ── Footer ── */}
          <footer className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={done}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-bold text-white
                flex items-center gap-2 transition-all
                ${done
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 scale-[0.98]"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 active:scale-[0.97]"
                }
              `}
            >
              <Icon path={done ? ICONS.check : ICONS.register} className="w-4 h-4" />
              {done ? "Patient Registered!" : "Register Patient"}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}